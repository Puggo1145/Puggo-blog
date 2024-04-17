"use client"

import { useRouter } from "next/navigation";
// server actions
import {
    removeDocument,
    restoreDocument
} from "@/actions/documents/actions";
// components
import ConfirmModal from "@/components/modals/confirm-modal";
// utils
import PubSub from "pubsub-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BannerProps {
    documentId: string;
}

const Banner: React.FC<BannerProps> = ({ documentId }) => {
    const router = useRouter();

    const onRemove = () => {
        const promise = removeDocument(documentId);
        toast.promise(promise, {
            loading: "Deleting document...",
            success: () => {
                PubSub.publish("refresh-documents-list");
                router.replace("/documents");
                return "Document deleted";
            },
            error: "Failed to delete document"
        });
    }

    const onRestore = () => {
        const promise = restoreDocument(documentId);
        toast.promise(promise, {
            loading: "Restoring document...",
            success: () => {
                PubSub.publish("refresh-documents-list");
                router.replace("/documents");
                return "Document restored";
            },
            error: "Failed to restored document"
        });
    }

    return (
        <div className="w-full bg-rose-500 text-center text-sm p-2
        text-white flex items-center justify-center gap-x-2">
            <p>
                This page is in the Trash.
            </p>
            <Button
                size="sm"
                onClick={onRestore}
                variant="outline"
                className="border-white bg-transparent hover:bg-primary/5
                text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore Page
            </Button>
            <ConfirmModal
                onConfirm={onRemove}
            >
                <Button
                    size="sm"
                    variant="outline"
                    className="border-white bg-transparent hover:bg-primary/5
                    text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete Forever
                </Button>
            </ConfirmModal>
        </div>
    );
};

export default Banner;