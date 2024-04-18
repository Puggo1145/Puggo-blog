"use client"

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
// hooks
import { useState } from "react";
import useOrigin from "@/hooks/use-origin";
import useDocument from "@/stores/useDocument";
// server actions
import { updateDocument } from "@/actions/documents/actions";
// utils
import { toast } from "sonner";
// types
import type { Document } from "@/types/document";
import { CheckIcon, CopyIcon, GlobeIcon } from "lucide-react";

interface PublishProps {
    initialData: Document;
}

const Publish: React.FC<PublishProps> = ({ initialData }) => {
    const origin = useOrigin();
    const { setPublish } = useDocument();

    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = `${origin}/preview/${initialData._id}`;

    const onPublish = () => {
        setIsSubmitting(true);

        const promise = updateDocument(initialData._id, {
            ...initialData,
            isPublished: true
        });
        setPublish(true);

        toast.promise(promise, {
            loading: "Publishing...",
            success: () => {
                setIsSubmitting(false);
                return "Note published!"
            },
            error: () => {
                setIsSubmitting(false);
                return "Failed to publish notes"
            }
        });
    }

    const onUnpublish = () => {
        setIsSubmitting(true);

        const promise = updateDocument(initialData._id, {
            ...initialData,
            isPublished: false
        });
        setPublish(false);

        toast.promise(promise, {
            loading: "Unpublishing...",
            success: () => {
                setIsSubmitting(false);
                return "Note unpublished!"
            },
            error: () => {
                setIsSubmitting(false);
                return "Failed to unpublish notes"
            }
        });
    }

    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="btn btn-sm"
                    disabled={isSubmitting}
                >
                    Publish
                    {
                        initialData.isPublished &&
                        <GlobeIcon className="text-sky-500 size-4 ml-2" />
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-72"
                align="end"
                alignOffset={8}
                forceMount
            >
                {
                    initialData.isPublished ?
                        <div className="space-y-4">
                            <div className="flex items-center gap-x-2">
                                <GlobeIcon className="text-sky-500 animate-pulse size-4" />
                                <p className="text-sky-500 text-xs">
                                    This note is live on web
                                </p>
                            </div>
                            <div className="flex items-center">
                                <input
                                    value={url}
                                    className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                                    type="text"
                                    disabled
                                />
                                <Button
                                    onClick={onCopy}
                                    disabled={copied}
                                    className="h-8 rounded-l-none"
                                >
                                    {
                                        copied ?
                                            <CheckIcon className="size-4" />
                                            :
                                            <CopyIcon className="size-4" />
                                    }
                                </Button>
                            </div>
                            <Button
                                size="sm"
                                className="w-full text-xs"
                                disabled={isSubmitting}
                                onClick={onUnpublish}
                            >
                                unpublish
                            </Button>
                        </div>
                        :
                        <div className="flex flex-col items-center justify-center">
                            <GlobeIcon className="size-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium mb-2">
                                Publish this note
                            </p>
                            <span className="text-xs text-muted-foreground mb-4">
                                share your work with others
                            </span>
                            <Button
                                disabled={isSubmitting}
                                onClick={onPublish}
                                className="w-full text-xs"
                                size="sm"
                            >
                                Publish
                            </Button>
                        </div>
                }
            </PopoverContent>
        </Popover>
    );
};

export default Publish;