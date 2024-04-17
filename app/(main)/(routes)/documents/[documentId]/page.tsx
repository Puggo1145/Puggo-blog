"use client"

// hooks
import { useEffect } from "react";
// utils
import { toast } from "sonner";
// server action
import { getById } from "@/actions/documents/actions";
// stores
import useDocument from "@/stores/useDocument";
// types
import Toolbar from "@/components/tool-bar";

interface DocumentDetailPageProps {
    params: {
        documentId: string
    }
}

const DocumentDetailPage: React.FC<DocumentDetailPageProps> = ({
    params: { documentId }
}) => {
    const { document, setDocument } = useDocument();

    useEffect(() => {
        getDocDetail();
    }, []);

    const getDocDetail = async () => {
        const res = await getById(documentId);
        if (res.ok) {
            setDocument(JSON.parse(res.document));
        } else {
            toast.error(res.error);
        }
    };

    if (document === undefined) {
        return (
            <div>loading...</div>
        )
    }

    if (document === null) {
        return <div>Document Not Found</div>
    }

    return (
        <div
            className="pb-40"
        >
            <div className="h-[35vh]" />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar /> 
            </div>
        </div>
    );
};

export default DocumentDetailPage;