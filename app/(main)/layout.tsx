"use client"

import { PropsWithChildren } from "react";

import { redirect } from "next/navigation";

import useSpinner from "@/components/spinner";

import Navigation from "./_components/navigation";

import { useSession } from "next-auth/react";

const DocumentsMainLayout: React.FC<PropsWithChildren> = ({ children }) => {

    const { status } = useSession();
    const spinner = useSpinner({ size: "lg" });

    if (status === "loading") {
        return (
            <div className="h-full flex items-center justify-center">
                {spinner.dom}
            </div>
        );
    }

    if (status === "unauthenticated") {
        return redirect("/");
    }

    return (
        <div className="h-full flex dark:bg-[#1f1f1f]">
            <Navigation />
            <main className="flex-1 h-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default DocumentsMainLayout;