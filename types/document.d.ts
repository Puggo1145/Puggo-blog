import { Schema } from "mongoose";

export interface Document {
    _id: string & Schema.Types.ObjectId;
    user_id: string & Schema.Types.ObjectId;

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