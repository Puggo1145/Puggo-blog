"use client";

import {
    // BlockNoteEditor,
    PartialBlock
} from "@blocknote/core";
import {
    BlockNoteView,
    useCreateBlockNote
} from "@blocknote/react";
// hooks
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
// styles
import "@blocknote/react/style.css";

interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
}

const Editor: React.FC<EditorProps> = ({
    onChange,
    initialContent,
    editable
}) => {
    const { resolvedTheme } = useTheme();
    const { edgestore } = useEdgeStore();

    const handleUpload = async (file: File) => {
        const res = await edgestore.publicFiles.upload({ file });

        return res.url;
    }

    const editor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile: handleUpload,
    });

    return (
        <BlockNoteView
            editor={editor}
            theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
            editable={editable}
            onChange={() => { onChange(JSON.stringify(editor.document, null, 2)) }}
        />
    );
};

export default Editor;