import React, { useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { MinimalTiptapEditor } from "../minimal-tiptap";
import { Button } from "../ui/button";
import { Content } from "@tiptap/react";
import { useRouter } from "next/router";
import { toast } from "@/hooks/use-toast";
import { getActiveUser, getLoggedinUserIndex } from "@/lib/auth";
import supabase from "@/utils/supebase/client";

type Props = {};

export default function EditNote({}: Props) {
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<Content>("");
  const router = useRouter();
  const handleChangeOfTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmitNote = async () => {
    if (!title || !note) {
      toast({
        title: "title and note required",
        description: "",
      });
      return;
    }
    const activeUser = getActiveUser();
    const userId = activeUser.session.user.id;
    const { data, error } = await supabase.from("notes").insert([
      {
        title: title,
        note: note,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    if (error) {
      toast({
        title: "something went wrong",
      });
      return;
    }
    const index = getLoggedinUserIndex(activeUser.email);
    router.push(`/u/${index}`);
  };
  return (
    <div>
      <div className="space-y-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message">Title</Label>
          <Textarea
            placeholder="Type your message here."
            id="message"
            value={title}
            onChange={handleChangeOfTitle}
          />
        </div>

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
        <Button variant="outline" className="w-full" onClick={handleSubmitNote}>
          Save
        </Button>
      </div>
    </div>
  );
}
