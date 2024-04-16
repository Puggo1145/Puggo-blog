import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"],
})

const Logo: React.FC = () => {
  return (
    <div className="hidden md:flex items-center gap-x-4">
        <Image src="/logo.svg" width="40" height="40" alt="Logo" className="dark:hidden"/>
        <Image src="/logo-dark.svg" width="40" height="40" alt="Logo" className="hidden dark:block"/>
        <p className={cn("font-semibold whitespace-nowrap", font.className)}>Puggo Blog</p>
    </div>
  );
};

export default Logo;