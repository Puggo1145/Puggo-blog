"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react'
import Spinner from "@/components/spinner";

import { useSession, signIn } from 'next-auth/react';

const Heading: React.FC = () => {
    const { data: session } = useSession();

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
            {/* {isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href="/documents">
                        Enter Notion
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            )} */}
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