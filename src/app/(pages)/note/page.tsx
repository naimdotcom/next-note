"use client";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import React, { useState } from "react";
import { Content } from "@tiptap/react";
type Props = {};

export default function page({}: Props) {
  const [value, setValue] = useState<Content>("");

  console.log(value);

  return (
    <>
      <div>
        <h2 className="text-2xl font-medium pb-5 text-zinc-700">
          Write Your Notes
        </h2>
      </div>
      <div>
        <MinimalTiptapEditor
          value={value}
          onChange={setValue}
          className="w-full"
          editorContentClassName="p-5"
          output="html"
          placeholder="Type your description here..."
          autofocus={true}
          editable={true}
          editorClassName="focus:outline-none"
        />
      </div>
    </>
  );
}
