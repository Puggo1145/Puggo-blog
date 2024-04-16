"use client"

// UI
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { File } from "lucide-react"
// hooks
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useSearch } from "@/stores/useSearch"
// utils
import { toast } from "sonner"
// server action
import { getSearch } from "@/actions/search/actions"
// types
import type { Document } from "@/types/document"

const SeachCommand = () => {
    const { data: session } = useSession();
    const user = useMemo(() => session?.user, [session]);
    const router = useRouter();
    const { toggle, isOpen, onClose } = useSearch();

    const [isMounted, setIsMounted] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                toggle();
            }
        }

        document.addEventListener("keydown", down);

        return () => document.removeEventListener("keydown", down);
    }, [toggle]);


    // fetch documents
    const fetchDocuments = async () => {
        const res = await getSearch();
        if (res.ok) {
            setDocuments(JSON.parse(res.documents));
        } else {
            toast.error("fetching documents failed: " + res.error);
        }
    };


    const onSelect = (id: string) => {
        router.push(`/documents/${id}`);
        onClose();
    }

    // prevent hydration error
    useEffect(() => {
        setIsMounted(true);

        fetchDocuments();
    }, []);
    if (!isMounted) return null;

    return (
        <CommandDialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <CommandInput placeholder={`search ${user?.name}'s blog`} />
            <CommandList>
                <CommandGroup heading="documents">
                    {
                        documents.map(document => {
                            return (
                                <CommandItem
                                    key={document._id}
                                    value={`${document._id}-${document.title}`}
                                    title={document.title}
                                    onSelect={onSelect}
                                >
                                    {
                                        document.icon ?
                                            (
                                                <p className="mr-2 text-[18px]">{document.icon}</p>
                                            ) :
                                            (
                                                <File className="mr-2 size-4" />
                                            )
                                    }
                                    <span>
                                        {document.title}
                                    </span>
                                </CommandItem>
                            )
                        })
                    }
                </CommandGroup>
                <CommandEmpty>
                    No results found
                </CommandEmpty>
            </CommandList>
        </CommandDialog>
    )
};

export default SeachCommand;