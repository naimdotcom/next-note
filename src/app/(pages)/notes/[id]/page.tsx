import React from "react";

type Props = {
  params: { id: string };
};

export default async function page({ params }: Props) {
  const { id } = await params;
  console.log(id);

  return <div>notes: {id}</div>;
}
