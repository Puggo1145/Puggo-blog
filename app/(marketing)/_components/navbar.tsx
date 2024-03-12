"use client"

import Logo from "./logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Spinner from "@/components/spinner";

import { cn } from "@/lib/utils";
import { useScrollTop } from "@/hooks/useScrollTop";

import { signIn, useSession } from 'next-auth/react';

const Navbar: React.FC = () => {
    const scrolled = useScrollTop();

    const { data: session } = useSession();

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
                {/* { isLoading && (
                    <Spinner />
                )} */}
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
                {/* {isAuthenticated && !isLoading && (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/documents">Enter Notion</Link>
                        </Button>
                        <UserButton 
                            afterSignOutUrl="/"
                        />
                    </>
                )} */}
                <ModeToggle />
            </div>
        </div>
    );
};

export default Navbar;