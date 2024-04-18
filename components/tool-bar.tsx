"use client"

import {
  ImageIcon,
  Smile,
  X
} from "lucide-react";
import { Button } from "./ui/button";
// components
import IconPicker from "./icon-picker";
import TextareaAutosize from "react-textarea-autosize";
// hooks
import React, { useRef, useState } from "react";
// server action
import { 
  updateDocument,
  removeIcon
} from "@/actions/documents/actions";
// utils
import { toast } from "sonner";
// stores
import useDocument from "@/stores/useDocument";
import { useCoverImage } from "@/stores/use-cover-image";

interface ToolbarProps {
  preview?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  preview
}) => {
  const coverImage = useCoverImage();

  const { document, setDocument } = useDocument();
  const inputRef = useRef<React.ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  const diableInput = async () => {
    setIsEditing(false);
    
    const res = await updateDocument(document._id, { title: document.title });
    if (res.error) toast.error("错误：" + res.error)
  }

  const onKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      diableInput();
    }
  }

  const onIconSelect = async (icon: string) => {
    const res = await updateDocument(document._id, { icon });
    if (res.error) toast.error("错误：" + res.error);

    setDocument({ ...document, icon });
  }

  const onIconRemove = async () => {
    await removeIcon(document._id);
    setDocument({ ...document, icon: null });
  }

  return (
    <div className="pl-[54px] group relative">
      {
        document.icon && !preview && (
          <div className="flex items-center gap-x-2 group/icon pt-6">
            <IconPicker onChange={onIconSelect}>
              <p className="text-6xl hover:opacity-75 transition">
                {document.icon}
              </p>
            </IconPicker>
            <Button
              className="rounded-full opacity-0 group-hover:opacity-100 transition text-muted-foreground text-xs"
              variant="outline"
              size="icon"
              onClick={onIconRemove}
            >
              <X className="size-4" />
            </Button>
          </div>
        )
      }
      {
        document.icon && preview && (
          <p className="text-6xl pt-6">
            {document.icon}
          </p>
        )
      }
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {
          !document.icon && !preview &&
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="size-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        }
        {
          !document.coverImage && !preview &&
          <Button
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
            onClick={coverImage.onOpen}
          >
            <ImageIcon className="size-4 mr-2" />
            Add cover
          </Button>
        }
      </div>
      {
        isEditing && !preview ?
          <TextareaAutosize
            ref={inputRef}
            onBlur={diableInput}
            onKeyDown={onKeydown}
            value={document.title}
            onChange={(e) => setDocument({ ...document, title: e.target.value || "untitled" })}
            className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
          />
          :
          <div
            onClick={enableInput}
            className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
          >
            {document.title}
          </div>
      }
    </div>
  );
};

export default Toolbar;