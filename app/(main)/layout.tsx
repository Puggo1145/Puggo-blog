"use client"

// components
import Navigation from "./_components/navigation";
// hooks
import useSpinner from "@/components/spinner";
import { useSession } from "next-auth/react";
// types
import type { PropsWithChildren } from "react";

const DocumentsMainLayout: React.FC<PropsWithChildren> = ({ children }) => {
    // Fn - page loading status
    const { status } = useSession();
    const { Spinner } = useSpinner();

    if (status === "loading") {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner />
            </div>
        );
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