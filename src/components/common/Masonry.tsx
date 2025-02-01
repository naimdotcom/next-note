"use client";
import supabase from "@/utils/supebase/client";
import type React from "react";
import Masonry from "react-masonry-css";

interface MasonryLayoutProps {
  children: React.ReactNode;
  length: number;
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ children, length }) => {
  const noteCount = supabase.from("notes").select("*", { count: "exact" });
  const breakpointColumnsObj = {
    default: length < 3 ? length : 3,
    1100: 3,
    700: 2,
    450: 1,
  };
  console.log("noteCount", noteCount);

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex -ml-4 "
      columnClassName="pl-4 bg-clip-paddin"
    >
      {children}
    </Masonry>
  );
};

export default MasonryLayout;
