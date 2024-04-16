"use server"

// auth
import { getServerSession } from "next-auth"
import authOptions from "@/constants/authOptions"
// models
import Document from "@/models/document"


export const getSearch = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user.id) {
            return { error: "Unauthorized" }
        }

        const documents = await Document
            .find({ user_id: session?.user.id })
            .select("-isArchived")
            .sort({ createdAt: -1 });

        return {
            ok: true,
            documents: JSON.stringify(documents)
        }

    } catch (err) {
        if (err instanceof Error) return { error: "server error" + err.message };
        return { error: "unknown error" };
    }
}