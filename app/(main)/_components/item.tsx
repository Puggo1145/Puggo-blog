"use client"

import type { LucideIcon } from "lucide-react";

interface Props {
    label: string;
    onClick: () => void;
    icon: LucideIcon
}

const Item: React.FC<Props> = ({ label, icon: Icon, onClick }) => {
    return (
        <div
            onClick={onClick}
            role="button"
            style={{ paddingLeft: "12px" }}
            className="
            group min-h-[27px] py-1 pr-3 w-full hover:bg-primary/5
            flex items-center
            text-sm text-muted-foreground font-medium
        "
        >
            <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
            <span className="truncate">
                {label}
            </span>
        </div>
    );
};

export default Item;