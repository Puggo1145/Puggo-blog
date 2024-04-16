import { Schema, model, models } from "mongoose";
import type { Document } from "@/types/document";

const documentSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: 'untitiled'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    isArchived: {
        type: Boolean,
        required: true,
        default: false
    },
    parentDocument: {
        type: String,
        required: false,
        default: null
    },
    content: {
        type: String,
        required: false
    },
    coverImage: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false,
        default: null
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true });

documentSchema.index({ user_id: 1, parentDocument: 1 });


const Document = models.Document || model("Document", documentSchema);
export default Document;