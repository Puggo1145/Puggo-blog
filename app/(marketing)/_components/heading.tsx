import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react'

const Heading: React.FC = () => {
    return (
        <div className="flex flex-col items-start gap-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-3xl font-bold">
                Make Development Awesome, Elegant, and Fun
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                👋 Hi! This is Puggo&apos;s blog <br />
                where I write about my journey of development learning <br />
            </h3>
            <div className="mt-12">
                <Button asChild>
                    <Link href="/documents">
                        Enter My Blog
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default Heading;