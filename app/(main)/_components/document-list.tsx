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
// server actions
import { getDocuments } from "@/actions/documents/actions";
// utils
import PubSub from "pubsub-js";
// stores
import useDocument from "@/stores/useDocument";
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
    const [documents, setDocuments] = useState<Document[]>();
    const { document } = useDocument();

    const onExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId]
        }))
    };

    const getDoc = async (parentDocumentId: string | null) => {
        const res = await getDocuments(parentDocumentId);

        if (res?.ok) {
            setDocuments(JSON.parse(res.documents!));
        }
    };

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    }

    useEffect(() => {
        getDoc(parentDocumentId);

        const refreshToken = PubSub.subscribe("refresh-documents-list", () => getDoc(parentDocumentId));

        return () => {
            PubSub.unsubscribe(refreshToken);
        };
    }, []);

    // 追踪并接管当前打开 document 的更新
    useEffect(() => {
        if (document._id) {
            setDocuments(prevDocs => {
                if (prevDocs) {
                    return prevDocs.map(doc => {
                        if (doc._id === document._id) {
                            return document;
                        }
                        return doc;
                    });
                }
            });
        }
    }, [document])

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
                    paddingLeft: level ? `${(level * 12) + 25}px` : `12px`
                }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                No pages
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