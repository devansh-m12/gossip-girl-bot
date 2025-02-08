"use client";

import { LucideIcon } from "lucide-react";
import {
    Text,
    CheckCheck,
    ArrowDownWideNarrow,
    CornerRightDown,
    Send,
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea";

interface ActionItem {
    text: string;
    icon: LucideIcon;
    colors: {
        icon: string;
        border: string;
        bg: string;
    };
}

interface AIInputWithSuggestionsProps {
    id?: string;
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
    actions?: ActionItem[];
    defaultSelected?: string;
    onSubmit?: (text: string, action?: string) => void;
    className?: string;
}

const DEFAULT_ACTIONS: ActionItem[] = [
    {
        text: "Summary",
        icon: Text,
        colors: {
            icon: "text-orange-600",
            border: "border-orange-500",
            bg: "bg-orange-100",
        },
    },
    {
        text: "Fix Spelling and Grammar",
        icon: CheckCheck,
        colors: {
            icon: "text-emerald-600",
            border: "border-emerald-500",
            bg: "bg-emerald-100",
        },
    },
    {
        text: "Make shorter",
        icon: ArrowDownWideNarrow,
        colors: {
            icon: "text-purple-600",
            border: "border-purple-500",
            bg: "bg-purple-100",
        },
    },
];

export function AIInputWithSuggestions({
    id = "ai-input-with-actions",
    placeholder = "Enter your text here...",
    minHeight = 64,
    maxHeight = 200,
    actions = DEFAULT_ACTIONS,
    defaultSelected,
    onSubmit,
    className
}: AIInputWithSuggestionsProps) {
    const [inputValue, setInputValue] = useState("");
    const [selectedItem, setSelectedItem] = useState<string | null>(defaultSelected ?? null);

    const { textareaRef } = useAutoResizeTextarea();

    const toggleItem = (itemText: string) => {
        setSelectedItem((prev) => (prev === itemText ? null : itemText));
    };

    const currentItem = selectedItem
        ? actions.find((item: ActionItem) => item.text === selectedItem)
        : null;

    const handleSubmit = () => {
        if (inputValue.trim()) {
            onSubmit?.(inputValue, selectedItem ?? undefined);
            setInputValue("");
            setSelectedItem(null);
            if (textareaRef.current) {
                textareaRef.current.style.height = `${minHeight}px`;
            }
        }
    };

    return (
        <div className={cn("w-full py-4", className)}>
            <div>
            <div className="relative max-w-xl w-full mx-auto">
                <div className="relative border-2 border-black/10 dark:border-white/10 focus-within:border-black/20 dark:focus-within:border-white/20 rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl">
                    <div className="flex flex-col">
                        <div
                            className="overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent"
                            style={{ maxHeight: `${maxHeight - 48}px` }}
                        >
                            <Textarea
                                ref={textareaRef}
                                id={id}
                                placeholder={placeholder}
                                className={cn(
                                    "max-w-xl w-full rounded-2xl pr-12 pt-4 pb-3 placeholder:text-black/50 dark:placeholder:text-white/50 border-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 text-black dark:text-white resize-none text-wrap bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed transition-all duration-200",
                                    `min-h-[${minHeight}px]`
                                )}
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                            />
                        </div>

                        <div className="h-12 bg-transparent">
                            {currentItem && (
                                <div className="absolute left-3 bottom-3 z-10">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className={cn(
                                            "inline-flex items-center gap-1.5",
                                            "border-2 shadow-sm rounded-full px-3 py-1",
                                            "text-xs font-medium transform transition-all duration-200",
                                            "hover:scale-105 active:scale-95",
                                            currentItem.colors.bg,
                                            currentItem.colors.border
                                        )}
                                    >
                                        <currentItem.icon
                                            className={`w-3.5 h-3.5 ${currentItem.colors.icon}`}
                                        />
                                        <span
                                            className={currentItem.colors.icon}
                                        >
                                            {selectedItem}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className={cn(
                            "absolute right-3 top-3 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 transform",
                            inputValue.trim()
                                ? "opacity-100 cursor-pointer hover:scale-110 active:scale-95"
                                : "opacity-30 cursor-not-allowed"
                        )}
                        disabled={!inputValue.trim()}
                    >
                        <Send className="w-5 h-5 dark:text-white" />
                    </button>
                </div>
            </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 max-w-xl mx-auto justify-start px-4">
                {actions.filter((item: ActionItem) => item.text !== selectedItem).map(
                    ({ text, icon: Icon, colors }: ActionItem) => (
                        <button
                            type="button"
                            key={text}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-full",
                                "border-2 transition-all duration-200",
                                "border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm",
                                "hover:scale-105 active:scale-95 hover:shadow-md",
                                "flex-shrink-0"
                            )}
                            onClick={() => toggleItem(text)}
                        >
                            <div className="flex items-center gap-2">
                                <Icon className={cn("h-4 w-4", colors.icon)} />
                                <span className="text-black/70 dark:text-white/70 whitespace-nowrap">
                                    {text}
                                </span>
                            </div>
                        </button>
                    )
                )}
            </div>
        </div>
    );
}
