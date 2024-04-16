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
}

const useSpinner = (
    { loadingBydefault = false }: { loadingBydefault?: boolean } = {}
) => {

    const [loading, setLoading] = useState(() => loadingBydefault);

    const Spinner = ({ size, className }: SpinnerProps) => {
        return (
            loading &&
            <Loader
                className={cn(spinnerVariants({ size }), className)}
            />
        );
    }

    return ({
        Spinner,
        loading,
        setLoading,
    });
};

export default useSpinner;