import { useCallback, useEffect } from "react";
import { useMarkdownEditorContext } from "./MarkdownEditorProvider";

type MarkdownCommand =
  | "heading"
  | "bold"
  | "italic"
  | "link"
  | "bold"
  | "code"
  | "upload-image";

interface Options {
  value?: string;
  ref?: React.RefObject<HTMLTextAreaElement | null>;
  onChange?: (value: string) => void;
}

export function useMarkdownEditor(options?: Options) {
  const textareaRef = options?.ref;
  const editorContext = useMarkdownEditorContext();

  const executeCommand = useCallback((command: MarkdownCommand) => {
    if (!textareaRef?.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    const selectedText = textareaRef.current.value.substring(
      selectionStart,
      selectionEnd
    );
    let updatedValue = textareaRef.current.value;
    let newCursorPos = selectionStart;

    switch (command) {
      case "heading":
        const headingText = `## ${selectedText}`;
        updatedValue =
          updatedValue.substring(0, selectionStart) +
          headingText +
          updatedValue.substring(selectionEnd);
        newCursorPos = selectionStart + headingText.length;
        break;
      case "bold":
        const boldText = `**${selectedText}**`;
        updatedValue =
          updatedValue.substring(0, selectionStart) +
          boldText +
          updatedValue.substring(selectionEnd);
        newCursorPos = selectionStart + (selectedText ? boldText.length : 2);
        break;
      case "italic":
        const italicText = `*${selectedText}*`;
        updatedValue =
          updatedValue.substring(0, selectionStart) +
          italicText +
          updatedValue.substring(selectionEnd);
        newCursorPos = selectionStart + (selectedText ? italicText.length : 1);
        break;
      case "link":
        const linkText = selectedText
          ? `[${selectedText}](url)`
          : `[link text](url)`;
        updatedValue =
          updatedValue.substring(0, selectionStart) +
          linkText +
          updatedValue.substring(selectionEnd);
        newCursorPos = selectionStart + linkText.length;
        break;
      case "upload-image":
        // Open the image uploader modal at current cursor position
        editorContext.openImageUploader(selectionStart);
        return; // Don't update text immediately, wait for upload
    }

    if (options?.onChange) {
      options.onChange(updatedValue);
    }

    // Use setTimeout to ensure the value is updated before setting cursor position
    setTimeout(() => {
      if (textareaRef?.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [textareaRef, editorContext, options]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !textareaRef?.current ||
        document.activeElement !== textareaRef.current
      )
        return;

      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            executeCommand("bold");
            break;
          case "i":
            e.preventDefault();
            executeCommand("italic");
            break;
          case "h":
            e.preventDefault();
            executeCommand("heading");
            break;
          case "k":
            e.preventDefault();
            executeCommand("link");
            break;
          case "u":
            e.preventDefault();
            executeCommand("upload-image");
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [executeCommand, textareaRef]);

  if (!textareaRef) return;

  return { executeCommand };
}
