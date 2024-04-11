"use server"

import connectToDB from "@/utils/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/(server)/api/auth/[...nextauth]/route";

import Document from "@/models/document";

import { revalidatePath } from "next/cache";

export const getDocuments = async (
    parentDocument?: string | null
) => {
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);

        const documents = await Document
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

        const document = await Document.create({
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

        const document = await Document.findById(documentId) as Document;
        if (!document) {
            return { error: "Document not found" };
        }

        // 验证是否是本文档的用户来编辑
        const session = await getServerSession(authOptions);
        if (document.user_id.toString() !== session?.user.id) {
            return { error: "Unauthorized" };
        }

        // 递归查找该文档下是否有子文档，并一并 archive 子文档，直到没有子文档为止
        const recursiveArchive = async (documentId: string) => {
            const children = await Document.find({
                user_id: session?.user.id,
                parentDocument: documentId
            }) as Document[];

            // 如果没有子文档，结束递归
            if (children.length === 0) return;

            for (const child of children) {
                await Document.findByIdAndUpdate(child._id, { isArchived: true });

                await recursiveArchive(child._id);
            }
        };

        await Document.findByIdAndUpdate(documentId, { isArchived: true });
        await recursiveArchive(documentId!);

        revalidatePath("/documents");

        return { message: "Deleted successfully" };
    } catch (err) {
        if (err instanceof Error) {
            return { message: "fail" };
        }
    }
}