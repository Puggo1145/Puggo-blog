import { 
    GET,
    POST 
} from "@/utils/request";

export const getDocuments = async (
    parentDocument?: string | null
) => {
    if (!parentDocument) {
        return await GET("/api/documents")
    }

    return await GET(`/api/documents?parentDocument=${parentDocument}`)
}

export const createDocument = async (
    user_id: string
) => await POST("/api/documents", {
    body: JSON.stringify({ user_id })
});