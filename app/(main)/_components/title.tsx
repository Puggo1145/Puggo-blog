"use client"

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
// server action
import { updateDocument } from "@/actions/documents/actions";
// hooks
import { useState, useRef } from "react";
// utils
import { toast } from "sonner";
// stores
import useDocument from "@/stores/useDocument";

const Title = () => {
    const { document, setDocument } = useDocument();
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const enableInput = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, document.title.length);
        }, 0);
    }

    const disableInput = async () => {
        setIsEditing(false);
        const res = await updateDocument(document._id, {
            title: document.title || "Untitled"
        });

        if (res.error) toast.error(res.error);
    }

    const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            disableInput();
        }
    };

    return (
        <div className="flex items-center gap-x-1">
            {document.icon && <p>{document.icon}</p>}
            {
                isEditing ?
                    (
                        <Input
                            ref={inputRef}
                            onClick={enableInput}
                            onBlur={disableInput}
                            value={document.title}
                            onChange={(event) => setDocument({ ...document, title: event.target.value })}
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
                            {document.title || "Untitled"}
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