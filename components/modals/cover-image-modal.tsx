"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
// hooks
import { useState } from "react";
import { useCoverImage } from "@/stores/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
// stores
import useDocument from "@/stores/useDocument";
// components
import { SingleImageDropzone } from "../single-image-dropzone";
// server actions
import { updateDocument } from "@/actions/documents/actions";

const CoverImageModal: React.FC = () => {
    const { documentId } = useParams();
    const { setCoverImage } = useDocument();

    const [file, setFile] = useState<File>();
    const [isSubmiting, setIsSubmiting] = useState(false);
    const coverImage = useCoverImage();
    const { edgestore } = useEdgeStore();

    const onClose = () => {
        setFile(undefined);
        setIsSubmiting(false);
        coverImage.onClose();
    }

    const onChange = async (file?: File) => {
        if (file) {
            setIsSubmiting(true);
            setFile(file);

            const res = await edgestore.publicFiles.upload({
                file,
                options: {
                    replaceTargetUrl: coverImage.url
                }
            });

            setCoverImage(res.url);
            await updateDocument(documentId as string, { coverImage: res.url });
            
            onClose();
        }
    }


    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Cover Image
                    </DialogTitle>
                    <DialogDescription>Upload a cover image for your profile</DialogDescription>
                </DialogHeader>
                <SingleImageDropzone
                    className="w-full outline-none"
                    disabled={isSubmiting}
                    value={file}
                    onChange={onChange}
                />
            </DialogContent>
        </Dialog>
    );
};

export default CoverImageModal;