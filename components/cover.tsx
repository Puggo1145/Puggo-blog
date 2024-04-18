"use client"

// utils
import Image from "next/image";
import { cn } from "@/lib/utils";
// UI
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
// hooks
import { useParams } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";
// stores
import { useCoverImage } from "@/stores/use-cover-image";
import useDocument from "@/stores/useDocument";
// utils
import { toast } from "sonner";
// server action
import { updateDocument } from "@/actions/documents/actions";

interface CoverProps {
    url: string | null;
    preview: boolean;
}

const Cover: React.FC<CoverProps> = ({ url, preview }) => {
    const { documentId } = useParams();
    const coverImage = useCoverImage();
    const { setCoverImage } = useDocument();
    const { edgestore } = useEdgeStore();

    const onRemove = async () => {
        if (!url) return;

        // instantly remove cover in UI
        setCoverImage(null);
        try {
            await edgestore.publicFiles.delete({ url });
            await updateDocument(documentId as string, { coverImage: null });
            toast.success("Cover image removed");
        } catch (err) {
            toast.error("Failed to remove cover image");
        }
    }

    return (
        <div className={cn(
            "relative w-full h-[35vh] group",
            !url && "h-[12vh]",
            url && "bg-muted",
        )}>
            {
                url &&
                <Image
                    src={url}
                    fill
                    alt="cover"
                    className="object-cover"
                />
            }
            {
                url && !preview &&
                <div
                    className="transition opacity-0 group-hover:opacity-100 absolute bottom-5 right-5
                    flex items-center gap-x-2"
                >
                    <Button
                        onClick={() => coverImage.onReplace(url)}
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <ImageIcon className="size-4 mr-2" />
                        Change Cover
                    </Button>
                    <Button
                        onClick={onRemove}
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <X className="size-4 mr-2" />
                        Remove
                    </Button>
                </div>
            }
        </div>
    );
};

export default Cover;