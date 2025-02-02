import React from "react";
// import { notFound } from "next/navigation";

export default function page({ params }: { params: { noteId: string } }) {
  // if (!params.noteId) {
  //   console.log("interception2");
  //   return notFound();
  // }
  console.log("interception");

  return <div>intercepting</div>;
}
