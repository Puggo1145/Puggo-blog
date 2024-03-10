"use client"
import Logo from "./logo";
import { ModeToggle } from "@/components/ui/mode-toggle";

import { useScrollTop } from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
    const scrolled = useScrollTop();

    return (
        <div className={cn(
            "z-50 bg-background dark:bg-darkbackground fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto w-full
                flex items-center gap-x-2
                md:justify-end justify-between
            ">
                <ModeToggle />
            </div>
        </div>
    );
};

export default Navbar;