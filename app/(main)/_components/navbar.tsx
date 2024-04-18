"use client"

// UI
import { MenuIcon } from "lucide-react";
// server action
import { getById } from "@/actions/documents/actions";
// components
import Banner from "./banner";
import Menu from "./menu";
// hooks
import { useParams } from "next/navigation";
import { useEffect } from "react";
// utils
import { toast } from "sonner";
import Title from "./title";
// stores
import useDocument from "@/stores/useDocument";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
    isCollapsed,
    onResetWidth
}) => {
    const params = useParams();
    const { document, setDocument } = useDocument();

    // 监听 id 变更，更新 document
    useEffect(() => {
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


    if (document._id === '') {
        return (
            <nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full
                flex items-center justify-between gap-x-4"
            >
                <Title.Skeleton />
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton />
                </div>
            </nav>
        )
    }

    if (document === null) {
        return null;
    }

    return (
        <>
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
                    <Title />
                    {
                        !document.isArchived &&
                        <div className="flex items-center gap-x-2">
                            <Menu documentId={document._id} />
                        </div>
                    }
                </div>
            </nav>
            {
                document.isArchived &&
                <Banner documentId={document._id} />
            }
        </>
    );
};

export default Navbar;