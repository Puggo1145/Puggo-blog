import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Separator: React.FC<Props> = ({ children, className }) => {
  return (
    <div className="relative">
        <div className={cn("absolute inset-0 flex items-center", className ?? null)}>
            <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
                {children}
            </span>
        </div>
    </div>
  );
};

export default Separator;