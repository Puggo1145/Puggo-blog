"use client"

import Logo from "./logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import useSpinner from "@/components/spinner";

import { cn } from "@/lib/utils";
import { useScrollTop } from "@/hooks/useScrollTop";

import { useSession } from 'next-auth/react';
import { useEffect } from "react";

const Navbar: React.FC = () => {
    const scrolled = useScrollTop();

    const { data: session, status } = useSession();
    const { Spinner, loading, setLoading } = useSpinner();

    useEffect(() => {
        setLoading(status === "loading");
    }, [status]);

    return (
        <div className={cn(
            "z-10 bg-background dark:bg-darkbackground fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto w-full
                flex items-center gap-x-2
                md:justify-end justify-between
            ">
                {loading && <Spinner size="default" />}
                {!session && (
                    <>
                        <Button variant="ghost" size="sm">
                            <Link href="login">
                                Log in
                            </Link>
                        </Button>
                        {/* <Button size="sm">
                            Get Notion Free
                        </Button> */}
                    </>
                )}
                {status === "authenticated" && (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/documents">Enter Blog Editor</Link>
                        </Button>
                    </>
                )}
                <ModeToggle />
            </div>
        </div>
    );
};

export default Navbar;