"use client"

// shadcn components
import { Search, Trash, Undo } from "lucide-react";
// server actions
import {
    getTrash,
    restoreDocument,
    removeDocument,
} from "@/actions/documents/actions";
// hooks
import { useParams, useRouter } from "next/navigation";
import React, {
    useState,
    useMemo,
    useEffect
} from "react";
// utils
import { toast } from "sonner";
import useSpinner from "@/components/spinner";
// types
import type { Document } from "@/types/document";
import { Input } from "@/components/ui/input";
import ConfirmModal from "@/components/modals/confirm-modal";

const TrashBox: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const { Spinner } = useSpinner({ loadingBydefault: true });

    const [documents, setDocuments] = useState<Document[]>();
    const [search, setSearch] = useState("");

    useEffect(() => {
        getTrashDocuments();
    }, []);

    const getTrashDocuments = async () => {
        const res = await getTrash();

        if (res?.ok) {
            setDocuments(JSON.parse(res.documents!));
        } else {
            setDocuments([]);
            toast.error("Failed to fetch documents");
        }
    }

    const filterDocuments = useMemo(() => {
        if (!documents) return [];
        return documents.filter(doc => doc.title.toLowerCase().includes(search.toLowerCase()));
    }, [documents, search]);

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    }

    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
        documentId: string
    ) => {
        event.stopPropagation();
        const promise = restoreDocument(documentId);

        toast.promise(promise, {
            loading: "Restoring document...",
            success: () => {
                getTrashDocuments();
                PubSub.publish("refresh-documents-list");
                return "Document restored"
            },
            error: "Failed to restore document"
        })
    }

    const onRemove = (documentId: string) => {
        const promise = removeDocument(documentId);

        toast.promise(promise, {
            loading: "Deleting document...",
            success: "Document deleted",
            error: "Failed to deleted document"
        })

        if (params.documentId === documentId) {
            router.push("/documents");
        }

        getTrashDocuments();
    }

    if (documents === undefined) {
        return (
            <div className="h-full flex icen' justify-center p-4">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="size-4" />
                <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filter by page title"
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-center to-muted-foreground pb-2">
                    No documents found
                </p>
                {filterDocuments?.map(document => (
                    <div
                        key={document._id}
                        role="button"
                        onClick={() => onClick(document._id)}
                        className="text-sm rounded-sm w-full hover:bg-primary/5
                        flex items-center justify-between text-primary"
                    >
                        <span className="truncate pl-2">
                            {document.title}
                        </span>
                        <div className="flex items-center">
                            <div
                                onClick={e => onRestore(e, document._id)}
                                role="button"
                                className="rounded-sm p-2 hover:bg-foreground/30"
                            >
                                <Undo className="size-4 text-muted-foreground" />
                            </div>
                            <ConfirmModal
                                onConfirm={() => onRemove(document._id)}
                            >
                                <div
                                    role="button"
                                    className="rounded-sm p-2 hover:bg-foreground/30"
                                >
                                    <Trash className="size-4 text-muted-foreground" />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrashBox;