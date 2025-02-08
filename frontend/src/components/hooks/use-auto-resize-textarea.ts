import { useEffect, useRef } from "react";

export function useAutoResizeTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    
    // Set the height to match the content
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Initial resize
    adjustHeight();

    // Add event listeners
    const handleInput = () => adjustHeight();
    textarea.addEventListener("input", handleInput);

    // Cleanup
    return () => {
      textarea.removeEventListener("input", handleInput);
    };
  }, []);

  return { textareaRef, adjustHeight };
} 