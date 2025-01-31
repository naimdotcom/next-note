import supabase from "@/utils/supebase/client";
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
  const { data: notes, error } = await supabase.from("notes").select("*");

  if (error) {
    return <p>Error loading notes: {error.message}</p>;
  }
  console.log("notes clients", notes);

  return <div>ShowNotes</div>;
}
