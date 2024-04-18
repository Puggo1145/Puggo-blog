"use client"

// hooks
import { useEffect, useMemo } from "react";
// utils
import dynamic from "next/dynamic";
// server action
import { getById } from "@/actions/documents/actions";
// stores
import useDocument from "@/stores/useDocument";
// types
import Toolbar from "@/components/tool-bar";
import Cover from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";

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
            <Cover
                preview
                url={document.coverImage!}
            />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar preview />
                <Editor
                    editable={false}
                    onChange={() => {}}
                    initialContent={document.content!}
                />
            </div>
        </div>
    );
};

export default DocumentDetailPage;