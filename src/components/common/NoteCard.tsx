"use client";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef, useState, useEffect } from "react";

interface CardProps {
  title: string;
  note: string;
  id: string;
}

const NoteCard: React.FC<CardProps> = ({ title, note, id }) => {
  const [truncatedNote, setTruncatedNote] = useState<string>(note);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();

  useEffect(() => {
    const truncateText = () => {
      if (noteRef.current) {
        const maxChars = 350; // Adjust this value as needed
        if (note.length > maxChars) {
          setTruncatedNote(note.slice(0, maxChars) + "...");
        } else {
          setTruncatedNote(note);
        }
      }
    };

    truncateText();
    window.addEventListener("resize", truncateText);
    return () => window.removeEventListener("resize", truncateText);
  }, [note]);

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 overflow-hidden my-4"
      onClick={() => {
        router.push(`/note/${id}`);
      }}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p
        ref={noteRef}
        className="text-gray-600 truncated"
        dangerouslySetInnerHTML={{ __html: truncatedNote }}
      >
        {/* {truncatedNote} */}
      </p>
    </div>
  );
};

export default NoteCard;
