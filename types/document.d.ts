export interface Document {
    _id: string;
    user_id: string;

    title: string;
    isArchived: boolean;
    parentDocument?: string;
    content?: string;
    coverImage?: string;
    icon?: string;
    isPublished: boolean;

    createdAt: string;
    updatedAt: string;
}