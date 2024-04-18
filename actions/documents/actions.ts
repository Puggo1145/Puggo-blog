"use server"

import connectToDB from "@/utils/database";
import { getServerSession } from "next-auth/next";
import authOptions from "@/constants/authOptions";
import { revalidatePath } from "next/cache";

import DocumentModel from "@/models/document";

import type { Document } from "@/types/document";

export const getDocuments = async (
    parentDocument?: string | null
) => {
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);

        const documents = await DocumentModel
            .find({
                user_id: session?.user.id,
                parentDocument,
                isArchived: false
            })
            .sort({ createdAt: -1 }) as Document[];

        return {
            ok: true,
            documents: JSON.stringify(documents)
        }
    } catch (err) {
        if (err instanceof Error) {
            return {
                ok: false,
                message: "fail"
            };
        }
    }
};

export const createDocument = async (
    parentDocument?: string | null
) => {
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);

        const document = await DocumentModel.create({
            parentDocument,
            user_id: session?.user.id
        }) as Document;

        revalidatePath("/documents");

        return {
            message: "success",
            documentId: document._id.toString()
        };
    } catch (err) {
        if (err instanceof Error) {
            return { message: "fail" };
        }
    }
}

export const archiveDocuments = async (
    documentId: string
) => {
    try {
        await connectToDB();

        const document = await DocumentModel.findById(documentId) as Document;
        if (!document) {
            return { error: "Document not found" };
        }

        // 验证是否是本文档的用户来编辑
        const session = await getServerSession(authOptions);
        if (document.user_id.toString() !== session?.user.id) {
            return { error: "Unauthorized. Please sign in" };
        }

        // 递归查找该文档下是否有子文档，并一并 archive 子文档，直到没有子文档为止
        const recursiveArchive = async (documentId: string) => {
            const children = await DocumentModel.find({
                user_id: session?.user.id,
                parentDocument: documentId
            }) as Document[];

            // 如果没有子文档，结束递归
            if (children.length === 0) return;

            for (const child of children) {
                await DocumentModel.findByIdAndUpdate(child._id, { isArchived: true });

                await recursiveArchive(child._id);
            }
        };

        await DocumentModel.findByIdAndUpdate(documentId, { isArchived: true });
        await recursiveArchive(documentId!);

        revalidatePath("/documents");

        return { message: "Moved to trash" };
    } catch (err) {
        if (err instanceof Error) {
            return { message: "fail" };
        }
    }
}

export const getTrash = async () => {
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);

        const documents = await DocumentModel
            .find({
                user_id: session?.user.id,
                isArchived: true
            })
            .sort({ createdAt: -1 }) as Document[];

        return {
            ok: true,
            documents: JSON.stringify(documents)
        }
    } catch (err) {
        if (err instanceof Error) {
            return {
                ok: false,
                message: "fail"
            };
        }
    }
}

export const restoreDocument = async (
    documentId: string
) => {
    try {
        await connectToDB();

        const document = await DocumentModel
            .findById(documentId) as Document;
        if (!document) {
            return { error: "Document not found" };
        }

        // 验证是否是本文档的用户来编辑
        const session = await getServerSession(authOptions);
        if (document.user_id.toString() !== session?.user.id) {
            return { error: "Unauthorized" };
        }

        // 递归查找该文档下是否有子文档，并一并 restore 子文档，直到没有子文档为止
        const recursiveRestore = async (documentId: string) => {
            const children = await DocumentModel.find({
                user_id: session?.user.id,
                parentDocument: documentId
            }) as Document[];

            // 如果没有子文档，结束递归
            if (children.length === 0) return;

            for (const child of children) {
                await DocumentModel.findByIdAndUpdate(child._id, { isArchived: false });

                await recursiveRestore(child._id);
            }
        };

        await DocumentModel.findByIdAndUpdate(documentId, { isArchived: false });
        await recursiveRestore(documentId!);

        revalidatePath("/documents");

        return { message: "Restored successfully" };
    } catch (err) {
        if (err instanceof Error) {
            return { message: "fail" };
        }
    }
};

export const removeDocument = async (
    documentId: string
) => {
    try {
        await connectToDB();

        const document = await DocumentModel
            .findById(documentId) as Document;
        if (!document) {
            return { error: "Document not found" };
        }

        // 验证是否是本文档的用户来编辑
        const session = await getServerSession(authOptions);
        if (document.user_id.toString() !== session?.user.id) {
            return { error: "Unauthorized" };
        }

        // 递归查找该文档下是否有子文档，并一并删除子文档，直到没有子文档为止
        const recursiveRemove = async (documentId: string) => {
            const children = await DocumentModel.find({
                user_id: session?.user.id,
                parentDocument: documentId
            }) as Document[];

            // 如果没有子文档，结束递归
            if (children.length === 0) return;

            for (const child of children) {
                await DocumentModel.findByIdAndDelete(child._id);

                await recursiveRemove(child._id);
            }
        };

        await DocumentModel.findByIdAndDelete(documentId);
        await recursiveRemove(documentId!);

        revalidatePath("/documents");

        return { message: "Deleted successfully" };

    } catch (err) {
        if (err instanceof Error) {
            return { message: "fail" };
        }
    }
}

export const getById = async (documentId: string) => {
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);

        const document = await DocumentModel.findById(documentId) as Document;
        if (!document) return { error: "Document not found" };

        // 如果文档是公开的且未删除，所有人可见
        if (document.isPublished && !document.isArchived) {
            return {
                ok: true,
                document: JSON.stringify(document)
            };
        }
        // 如果文档是私有的，只有创建者可见
        const user_id = session?.user.id;
        if (document.user_id.toString() !== user_id) {
            return { error: "Unauthorized" };
        }

        return {
            ok: true,
            document: JSON.stringify(document)
        };
    } catch (err) {
        if (err instanceof Error) {
            return { error: "fail: " + err.message };
        }
        return { error: "An error occured" };
    }
}

export const updateDocument = async (
    document_id: string,
    updateBody: {
        title?: string,
        content?: string | null,
        coverImage?: string | null,
        icon?: string | null,
        isPublished?: boolean
    } 
) => {
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);
        if (!session) return { error: "Unauthorized" };

        const user_id = session.user.id;

        const existingDocument = await DocumentModel.findById(document_id) as Document;
        if (!existingDocument) return { error: "Document not found" };
        if (existingDocument.user_id.toString() !== user_id) {
            return { error: "Unauthorized" };
        }

        await DocumentModel.findByIdAndUpdate(document_id, updateBody);

        return { ok: true }
    } catch (err) {
        if (err instanceof Error) {
            return { error: "fail: " + err.message };
        }
        return { error: "An error occured" };
    }
}

export const removeIcon = async (document_id: string) => {
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);
        if (!session) return { error: "Unauthorized" };

        const existingDocument = await DocumentModel.findById(document_id) as Document;
        if (!existingDocument) return { error: "Document not found" };
        if (existingDocument.user_id.toString() !== session.user.id) return { error: "Unauthorized" };

        await DocumentModel.findByIdAndUpdate(document_id, { icon: null });

        return { ok: true };
    } catch (err) {
        if (err instanceof Error) {
            return { error: "fail: " + err.message };
        }
        return { error: "An error occured" };
    }
}