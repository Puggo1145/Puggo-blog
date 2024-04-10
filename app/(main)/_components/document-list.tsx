"use client"

// UI
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
// components
import Item from "./item";
// hooks
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useDocuments from "@/stores/documents";
// apis
import { getDocuments } from "@/routes/documents";
// types
import { Document } from "@/types/document";

interface DocumentListProps {
    parentDocumentId?: string;
    level?: number;
    data?: Document[]
}

const DocumentList: React.FC<DocumentListProps> = ({
    parentDocumentId = null,
    level = 0,
}) => {
    const params = useParams();
    const router = useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const {documents, setDocuments} = useDocuments();

    const onExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId]
        }))
    };

    const getDoc = async (parentDocumentId?: string | null) => {
        const res = await getDocuments(parentDocumentId);
        if (res.ok) {
            const documents = await res.json();
            setDocuments(documents);
        }
    };

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    }

    useEffect(() => {
        getDoc(parentDocumentId);
    }, []);

    if (!documents) {
        return (
            <>
                <Item.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level} />
                        <Item.Skeleton level={level} />
                    </>
                )}
            </>
        )
    }

    return (
        <div className="flex flex-col">
            <p
                style={{
                    paddingLeft: level ? `${(level * 12) + 25}px` : undefined
                }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                No pages inside
            </p>
            {
                documents.map(doc => {
                    return (
                        <div key={doc._id}>
                            <Item
                                id={doc._id}
                                onClick={() => onRedirect(doc._id)}
                                label={doc.title}
                                icon={FileIcon}
                                documentIcon={doc.icon}
                                active={params.document_id === doc._id}
                                level={level}
                                onExpand={() => onExpand(doc._id)}
                                expanded={expanded[doc._id]}
                            />
                            {expanded[doc._id] && (
                                <DocumentList
                                    parentDocumentId={doc._id}
                                    level={level + 1}
                                />
                            )}
                        </div>
                    )
                })
            }
        </div>
    );
};

export default DocumentList;