"use client"

// UI
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import EmojiPicker, { Theme } from "emoji-picker-react";
// hooks
import { useMemo } from "react";
import { useTheme } from "next-themes";

interface IconPickerProps {
    onChange: (icon: string) => void;
    children?: React.ReactNode;
    asChild?: boolean;
}

const IconPicker: React.FC<IconPickerProps> = ({
    onChange,
    children,
    asChild
}) => {
    const { resolvedTheme } = useTheme();
    const currentTheme = useMemo(() => {
        return (resolvedTheme || "light") as keyof typeof themeMap;
    }, [resolvedTheme]);

    const themeMap = {
        "dark": Theme.DARK,
        "light": Theme.LIGHT,
    };

    const theme = themeMap[currentTheme];

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent 
                align="start"
                className="p-0 w-0 border-none shadow-none"
            >
                <EmojiPicker 
                    height={350}
                    theme={theme}
                    onEmojiClick={data => onChange(data.emoji)}
                />
            </PopoverContent>
        </Popover>
    );
};

export default IconPicker;