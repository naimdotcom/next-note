import { getNoteById, getUserUID } from "@/utils/supebase/server";

import React, { use } from "react";

type Props = { params: Promise<{ noteId: string }> };

export default async function page({ params }: Props) {
  const { noteId } = await params;
  const userId = await getUserUID();

  const { note, error } = await getNoteById(noteId, userId && userId);
  if (error) {
    <p>{error.message}</p>;
  }

  // console.log(noteId, note);
  return <div>ok</div>;
}
