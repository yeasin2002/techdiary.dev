"use client";

import { HeadingIcon, FontBoldIcon, FontItalicIcon, Link2Icon, UploadIcon } from "@radix-ui/react-icons";
import React from "react";
import EditorCommandButton from "./EditorCommandButton";
import { useMarkdownEditor } from "./useMarkdownEditor";

interface MarkdownEditorContentProps {
  bodyRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
}

export function MarkdownEditorContent({ bodyRef, onChange }: MarkdownEditorContentProps) {
  const editor = useMarkdownEditor({
    ref: bodyRef,
    onChange,
  });

  const renderEditorToolbar = () => (
    <div className="flex w-full gap-6 p-2 my-2 bg-muted">
      <EditorCommandButton
        onClick={() => editor?.executeCommand("heading")}
        Icon={<HeadingIcon />}
        title="Heading (Ctrl/Cmd + H)"
      />
      <EditorCommandButton
        onClick={() => editor?.executeCommand("bold")}
        Icon={<FontBoldIcon />}
        title="Bold (Ctrl/Cmd + B)"
      />
      <EditorCommandButton
        onClick={() => editor?.executeCommand("italic")}
        Icon={<FontItalicIcon />}
        title="Italic (Ctrl/Cmd + I)"
      />
      <EditorCommandButton
        onClick={() => editor?.executeCommand("link")}
        Icon={<Link2Icon />}
        title="Link (Ctrl/Cmd + K)"
      />
      <EditorCommandButton
        onClick={() => editor?.executeCommand("upload-image")}
        Icon={<UploadIcon />}
        title="Upload Image (Ctrl/Cmd + U)"
      />
    </div>
  );

  return (
    <div className="flex flex-col justify-between md:items-center md:flex-row">
      {renderEditorToolbar()}
    </div>
  );
}