"use client"

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// server action
import { updateDocument } from "@/actions/documents/actions";
// hooks
import { useState, useRef, useEffect } from "react";
// utils
import PubSub from "pubsub-js";
import { toast } from "sonner";
// types
import type { Document } from "@/types/document";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleProps {
    initialData: Document;
}

const Title = ({
    initialData
}: TitleProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState<string>();
    const inputRef = useRef<HTMLInputElement>(null);

    // 监听 id 变更，更新 title
    useEffect(() => {
        setTitle(initialData.title);
    }, [initialData]);

    const enableInput = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, initialData.title.length);
        }, 0);
    }
    
    const disableInput = async () => {
        setIsEditing(false);
        const res = await updateDocument(initialData._id, { 
            title: title || "Untitled" 
        });

        if (res.ok) {
            PubSub.publish("document-updated", {
                _id: initialData._id,
                title
            });
        } else {
            toast.error(res.error);
        }
    }

    const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            disableInput();
        }
    };

    return (
        <div className="flex items-center gap-x-1">
            {initialData.icon && <p>{initialData.icon}</p>}
            {
                isEditing ?
                    (
                        <Input
                            ref={inputRef}
                            onClick={enableInput}
                            onBlur={disableInput}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            onKeyDown={onKeyDown}
                            className="h-7 px-2 focus-visible:ring-transparent"
                        />
                    )
                    :
                    (
                        <Button
                            onClick={enableInput}
                            variant="ghost"
                            size="sm"
                            className="font-normal h-auto p-1"
                        >
                            {title}
                        </Button>
                    )
            }
        </div>
    );
};

Title.Skeleton = function TitleSkeleton() {
    return (
        <Skeleton className="h-9 w-20 rounded-md" />
    )
}

export default Title;