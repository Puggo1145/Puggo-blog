import { 
    GET,
    POST 
} from "@/utils/request";

export const getDocuments = async () => await GET("/api/documents");

export const createDocument = async (
    user_id: string
) => await POST("/api/documents", {
    body: JSON.stringify({ user_id })
});