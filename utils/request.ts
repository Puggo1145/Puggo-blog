/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
// types
import type { RequestInit } from "next/dist/server/web/spec-extension/request";

type Methods = "GET" | "POST" | "PUT" | "DELETE";
type ExtendedRequestInit = RequestInit & { timeout?: number };


async function BaseRequest(
    method: Methods,
    route: string,
    options: ExtendedRequestInit = {}
) {
    const timeout = options.timeout || 5000;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const res = await fetch(route, {
        method,
        signal: controller.signal,
        headers: {
            "Content-Type": "application/json",
        },
        ...options
    });

    clearTimeout(timer);

    if (!res.status.toString().startsWith('2')) {
        const data = await res.json();
        toast.error("error: " + data.error);
    }

    return res;
}

const GET = async (
    route: string,
    options: ExtendedRequestInit = {}
) => BaseRequest("GET", route, options)

const POST = async (
    route: string,
    options: ExtendedRequestInit = {}
) => BaseRequest("POST", route, options)

const PUT = async (
    route: string,
    options: ExtendedRequestInit = {}
) => BaseRequest("PUT", route, options)

const DELETE = async (
    route: string,
    options: ExtendedRequestInit = {}
) => BaseRequest("DELETE", route, options)

export { GET, POST, PUT, DELETE };