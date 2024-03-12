import { useState } from "react";

import { Loader } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
    "text-muted-foreground animate-spin",
    {
        variants: {
            size: {
                default: "h-4 w-4",
                sm: "h-2 w-2",
                lg: "h-6 w-6",
                icon: "h-10 w-10"
            }
        },
        defaultVariants: {
            size: "default"
        }
    }
)

interface SpinnerProps extends VariantProps<typeof spinnerVariants> { 
    className?: string;
    spinByDefault?: boolean;
}

const useSpinner = ({ size, className, spinByDefault }: SpinnerProps) => {

    const [loading, setLoading] = useState(() => spinByDefault ?? false);

    return ({
        loading: loading,
        setLoading: setLoading,
        dom: loading && <Loader className={cn(spinnerVariants({ size }), className)} />
    });
};

export default useSpinner;