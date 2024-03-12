"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react'
import useSpinner from "@/components/spinner";

import { useSession } from 'next-auth/react';

const Heading: React.FC = () => {
    const { data: session, status } = useSession();
    const { dom: spinnerElement } = useSpinner({ size: "default", spinByDefault: true });

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-3xl font-bold">
                Your Ideas, Documents, & Plans. Unified. Welcome to
                <span className="underline"> Notion</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Notion is the connected workspace where <br />
                better, faster work happens.
            </h3>
            {status === "loading" && (
                <div className="w-full flex items-center justify-center">
                    {spinnerElement}
                </div>
            )}
            {status === "authenticated" && (
                <Button asChild>
                    <Link href="/documents">
                        Enter Notion
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            )}
            {!session && (
                <Button asChild>
                    <Link href="login">
                        Get Notion Free
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            )}
        </div>
    );
};

export default Heading;