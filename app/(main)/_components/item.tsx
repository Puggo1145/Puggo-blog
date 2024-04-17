"use client"

import { cn } from "@/lib/utils";
import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
    type LucideIcon,
    ChevronDown, 
    ChevronRight, 
    Plus,
    Trash,
    MoreHorizontal
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// hooks
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// utils
import { toast } from "sonner";
// server actions
import { createDocument } from "@/actions/documents/actions";
import { archiveDocuments } from "@/actions/documents/actions";

interface Props {
    id?: string; // parent document id
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void
    label: string;
    onClick?: () => void;
    icon: LucideIcon
}

const Item = ({
    id,
    label,
    icon: Icon,
    onClick,
    active,
    documentIcon,
    isSearch,
    level = 0,
    onExpand,
    expanded,
}: Props) => {
    const router = useRouter();
    const { data: session } = useSession();

    const handleExpand = (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        event.stopPropagation();
        onExpand?.();
    }

    const onCreate = async (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        event.stopPropagation();

        if (!id) return;

        const res = await createDocument(id);
        if (res?.message === "success") {
            const documentId = res.documentId;

            if (!expanded) onExpand?.()

            router.push(`/documents/${documentId}`);
            PubSub.publish("refresh-documents-list");            
            toast.success("Document created");
        } else {
            toast.error("Failed to create document");
        }
    }

    const archive = async (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        event.stopPropagation();

        if (!id) return;

        const res = await archiveDocuments(id);

        if (res?.message) {
            PubSub.publish("refresh-documents-list");
            router.replace("/documents");
            toast.success(res.message);
        } else if (res?.error) {
            toast.error(res.error);
        }
    }

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    return (
        <div
            onClick={onClick}
            role="button"
            style={{
                paddingLeft: level ? `${(level * 12) + 12}px` : "12px"
            }}
            className={cn(
                "group min-h-[27px] py-1 pr-3 w-full hover:bg-primary/5",
                "flex items-center",
                "text-sm text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary"
            )}
        >
            {id && (
                <div
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
                    onClick={handleExpand}
                >
                    <ChevronIcon
                        className="size-4 shrink-0 text-muted-foreground/50"
                    />
                </div>
            )}
            {documentIcon ? (
                <div>
                    {documentIcon}
                </div>
            ) : (
                <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
            )}
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className="
                    ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 
                    rounded border bg-muted px-1.5 
                    font-mono text-[10px] font-medium text-muted-foreground opacity-100
                ">
                    <span className="text-xs">⌘ </span>K
                </kbd>
            )}
            {id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={e => e.stopPropagation()}
                            asChild
                        >
                            <div
                                role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm
                                hover:bg-neutral-300 dark:hover:bg-neutral-600"
                            >
                                <MoreHorizontal className="size-4 text-muted-foreground" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={archive}>
                                <Trash className="size-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="text-xs text-muted-foreground p-2">
                                Last edited by: {session?.user.name}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div 
                        role="button"
                        onClick={onCreate}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm
                        hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                        <Plus className="size-4 text-muted-foreground"/>
                    </div>
                </div>
            )}
        </div>
    );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div
            style={{
                paddingLeft: level ? `${(level * 12) + 12}px` : "12px"
            }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="size-4 bg-muted-foreground/50"/>
            <Skeleton className="size-4 w-[30%] bg-muted-foreground/50"/>
        </div>
    )
}

export default Item;