"use client"

import { cn } from "@/lib/utils";
import { 
    type LucideIcon,
    ChevronDown, 
    ChevronRight, 
    Plus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// hooks
import { useRouter } from "next/navigation";
// utils
import { toast } from "sonner";
// apis
import { createDocument } from "@/routes/documents";

interface Props {
    id?: string; // parent document id
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void
    label: string;
    onClick: () => void;
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


    const handleExpand = (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        event.stopPropagation();
        onExpand?.();
    }

    const onCreate = async (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        event.stopPropagation();

        if (!id) return;

        const res = await createDocument(id);
        if (res.ok) {
            const documentId = await res.json();

            if (!expanded) onExpand?.()

            // router.push(`/documents/${documentId}`);
            PubSub.publish("refresh-documents-list");            
            toast.success("Document created");
        } else {
            toast.error("Failed to create document");
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
                    className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
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