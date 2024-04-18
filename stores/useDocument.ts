import { create } from 'zustand';
import type { Document } from '@/types/document';

type State = {
    document: Document
}

type Action = {
    setDocument: (document: Document) => void;
    resetDocument: () => void;
    setCoverImage: (coverImage: string | null) => void;
}

const useDocument = create<State & Action>()((set) => ({
    document: {
        _id: '',
        user_id: '',

        title: '',
        isArchived: false,
        parentDocument: null,
        content: null,
        coverImage: null,
        icon: null,
        isPublished: false,

        createdAt: '',
        updatedAt: '',
    },

    setDocument: (document: Document) => {
        set({ document })
    },
    resetDocument: () => {
        set({ document: { ...useDocument.getState().document, _id: '' } });
    },
    setCoverImage: (coverImage: string | null) => {
        set((state) => ({
            ...state,
            document: { ...state.document, coverImage }
        }));
    }
}));

export default useDocument;