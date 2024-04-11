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
    parentDocument?: string
) => {
    if (!parentDocument) {
        return await POST("/api/documents")
    }

    return await POST(`/api/documents?parentDocument=${parentDocument}`)
};