import { Schema, model, models } from "mongoose";

const documentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    isArchived: {
        type: Boolean,
        required: true,
        default: false
    },
    parentDocument: {
        type: String,
        required: false
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
        required: false
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    },
});

const Document = models.Document || model("Document", documentSchema);

export default Document;