export interface Document {
    _id: string;
    user_id: string;

    title: string;
    isArchived: boolean;
    parentDocument?: string | null;
    content?: string | null;
    coverImage?: string | null;
    icon?: string | null;
    isPublished: boolean;

    createdAt: string;
    updatedAt: string;
}