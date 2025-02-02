import React from "react";
import { notFound } from "next/navigation";

export default function page({ params }: { params: { noteId: string } }) {
  // if (!params.noteId) {
  //   return notFound();
  // }
  return <div>intercepting</div>;
}
