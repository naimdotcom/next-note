import supabase from "@/utils/supebase/client";
import MasonryLayout from "./Masonry";
import NoteCard from "./NoteCard";
import { getUserUID } from "@/utils/supebase/server";

type Note = {
  id: number;
  title: string;
  note: string;
  created_at: string;
  updated_at: string;
  userId: string;
};

type Props = {
  notes?: Note[];
};

export default async function ShowNotes({}: Props) {
  const data = await getUserUID();

  const { data: notes, error } = await supabase.from("notes").select("*");

  if (error) {
    return <p>Error loading notes: {error.message}</p>;
  }

  console.log(data);

  return (
    <div>
      <MasonryLayout>
        {notes.map((item, i) => (
          <div key={item.id}>
            <NoteCard title={item.title} note={item.note} />
          </div>
        ))}
      </MasonryLayout>
    </div>
  );
}
