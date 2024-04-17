"use client"

// UI
import { MenuIcon } from "lucide-react";
// server action
import { getById } from "@/actions/documents/actions";
// hooks
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// utils
import { toast } from "sonner";
import Title from "./title";
// types
import type { Document } from "@/types/document";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
    isCollapsed,
    onResetWidth
}) => {
    const params = useParams();

    const [document, setDocument] = useState<Document>();

    // 监听 id 变更，更新 document
    useEffect(() => {
        setDocument(undefined);
        getDocument();
    }, [params.documentId]);

    const getDocument = async () => {
        const res = await getById(params.documentId as string);
        if (res.ok) {
            setDocument(JSON.parse(res.document));
        } else {
            toast.error(res.error);
        }
    }


    if (document === undefined) {
        return (
            <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full
                flex items-center gap-x-4"
            >
                <Title.Skeleton />
            </nav>
        )
    }

    if (document === null) {
        return null;
    }

    return (
        <nav className="
            bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full
            flex items-center gap-x-4"
        >
            {isCollapsed && (
                <MenuIcon
                    role="button"
                    onClick={onResetWidth}
                    className="size-6 text-muted-foreground"
                />
            )}
            <div className="flex items-center justify-between w-full">
                <Title initialData={document}></Title>
            </div>
        </nav>
    );
};

export default Navbar;