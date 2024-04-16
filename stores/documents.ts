import { create } from 'zustand';
import type { Document } from '@/types/document';

type State = {
    documents: Document[];
    setDocuments: (documents: Document[]) => void;
}

const useDocuments = create<State>()((set) => ({
    documents: [],
    setDocuments: (documents) => set({ documents: documents }),
}));

export default useDocuments;