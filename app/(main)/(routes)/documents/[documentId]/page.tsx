"use client"

// hooks
import { useEffect, useRef, useMemo } from "react";
// utils
import { toast } from "sonner";
import dynamic from "next/dynamic";
// server action
import { getById } from "@/actions/documents/actions";
// components
import useSpinner from "@/components/spinner";
// stores
import useDocument from "@/stores/useDocument";
// types
import Toolbar from "@/components/tool-bar";
import Cover from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
// server actions
import { updateDocument } from "@/actions/documents/actions";

interface DocumentDetailPageProps {
    params: {
        documentId: string
    }
}

const DocumentDetailPage: React.FC<DocumentDetailPageProps> = ({
    params: { documentId }
}) => {
    const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

    const { document, setDocument, resetDocument } = useDocument();
    const { loading, setLoading, Spinner } = useSpinner();
    const timer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        getDocDetail();

        return () => {
            resetDocument();
        }
    }, []);

    const getDocDetail = async () => {
        const res = await getById(documentId);
        if (res.ok) {
            setDocument(JSON.parse(res.document));
        }
    };

    const onChange = async (content: string) => {
        if (timer.current) return;

        setLoading(true);
        timer.current = setTimeout(async () => {
            const res = await updateDocument(documentId, { content: content });
            if (res.error) toast.error(res.error);
            
            timer.current = null;
            setLoading(false);
        }, 2000);
    };

    if (document._id === '') {
        return (
            <div>
                <Cover.Skeleton />
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="h-14 w-[50%]" />
                        <Skeleton className="h-14 w-[80%]" />
                        <Skeleton className="h-14 w-[40%]" />
                        <Skeleton className="h-14 w-[60%]" />
                    </div>
                </div>
            </div>
        )
    }

    if (document === null) {
        return <div>Document Not Found</div>
    }

    return (
        <div className="pt-[52px] pb-40">
            {
                loading &&
                <div className="z-50 fixed top-3 right-16 text-muted-foreground flex items-center gap-x-2">
                    <Spinner />
                    saving...
                </div>
            }
            <Cover
                url={document.coverImage!}
                preview={false}
            />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar />
                <Editor
                    onChange={onChange}
                    initialContent={document.content!}
                />
            </div>
        </div>
    );
};

export default DocumentDetailPage;