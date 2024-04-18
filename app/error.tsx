"use client"

import { Button } from "@/components/ui/button";

import Link from "next/link";

const Error = () => {
  return (
    <div className="w-full felx flex-col items-center justify-center space-y-4">
        <h2 className="text-lg font-medium">404 Not Found</h2>
        <Link href="/">
            <Button>
            Go back
            </Button>
        </Link>
    </div>
  );
};

export default Error;