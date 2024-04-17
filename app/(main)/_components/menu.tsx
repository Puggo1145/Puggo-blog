"use client"

// UI
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash } from "lucide-react"
// hooks
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
// utils
import { toast } from "sonner"
import PubSub from "pubsub-js"
// server action
import { 
    archiveDocuments, 
} from "@/actions/documents/actions"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuProps {
    documentId: string
}

const Menu = ({ documentId }: MenuProps) => {
    const router = useRouter();
    const { data: session } = useSession();

    const onArchive = async () => {
        const promise = archiveDocuments(documentId);
        toast.promise(promise, {
            loading: "Moving to trash...",
            success: () => {
                PubSub.publish("refresh-documents-list");
                router.replace("/documents");
                return "Document moved to trash";
            },
            error: "Failed to archive document"
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-60"
                align="end"
                alignOffset={8}
                forceMount
            >
                <DropdownMenuItem onClick={onArchive}>
                    <Trash className="size-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                    Last edited by {session?.user.name}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

Menu.Skeleton = function MenuSkeleton() {
    return (
        <Skeleton className="size-10"/>
    )
}

export default Menu;