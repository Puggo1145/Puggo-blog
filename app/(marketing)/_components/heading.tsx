"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react'
import useSpinner from "@/components/spinner";
// hooks
import { useEffect } from "react";
import { useSession } from 'next-auth/react';

const Heading: React.FC = () => {
    const { data: session, status } = useSession();
    const { setLoading, Spinner } = useSpinner();
    
    useEffect(() => {
        setLoading(true);
    }, []);

    return (
        <div className="flex flex-col items-start gap-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-3xl font-bold">
                Make Development Awesome, Elegant, and Fun
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                👋 Hi! This is Puggo&apos;s blog <br />
                where I write about my journey of development learning <br />
            </h3>
            {status === "loading" && (
                <div className="w-full flex items-center justify-center">
                    <Spinner />
                </div>
            )}
            <div className="mt-12">
                {status === "authenticated" && (
                    <Button asChild>
                        <Link href="/documents">
                            Enter My Blog
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
        </div>
    );
};

export default Heading;