"use client";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Content } from "@tiptap/react";
import { getNoteById, getUserUID } from "@/utils/supebase/server";
import supabase from "@/utils/supebase/client";
import { getActiveUser } from "@/lib/auth";
export default function page({ params }: { params: { noteId: string } }) {
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<Content>("");
  const route = useRouter();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const noteId = pathname.split("/")[2];

  const fetch = async () => {
    const { session } = getActiveUser();
    const userId = session.user.id;
    if (!userId) return;
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .eq("user_id", userId)
      .single();

    if (error) {
      <p>{error.message}</p>;
    }

    setNote(() => data.note); // Ensure correct state update
    setTitle(() => data.title);
  };
  const handleChangeOfTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };
  const updateNote = async () => {
    const { session } = getActiveUser();
    const userId = session.user.id;
    if (!userId) return;

    const { error } = await supabase
      .from("notes")
      .update({ note, title })
      .eq("id", noteId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating note:", error.message);
    }
  };

  useEffect(() => {
    fetch();
  }, [noteId]);

  useEffect(() => {
    const channel = supabase
      .channel(`notes-${noteId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notes",
          filter: `id=eq.${noteId}`,
        },
        (payload) => {
          console.log("Note updated:", payload);
          setNote(payload.new.note); // Update the note in real time
          setTitle(payload.new.title);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [note, title]);
  // Function to close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        route.back();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // intercepting solved...

  return (
    <div className="fixed -left-0 -top-0 w-[100vw] h-[100vh] bg-black/35 z-50">
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70vw] "
      >
        <div className="bg-white p-4 rounded-xl w-full ">
          <div className="space-y-4 w-full ">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Title</Label>
              <Textarea
                placeholder="Type your message here."
                id="message"
                value={title}
                onChange={handleChangeOfTitle}
              />
            </div>

            <div className="max-h-[80vh] overflow-y-auto">
              {note && (
                <MinimalTiptapEditor
                  value={note}
                  onChange={setNote}
                  className="w-full"
                  editorContentClassName="p-5"
                  output="html"
                  placeholder="Type your description here..."
                  autofocus={true}
                  editable={true}
                  editorClassName="focus:outline-none"
                />
              )}
            </div>
            <Button variant="outline" className="w-full" onClick={updateNote}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
