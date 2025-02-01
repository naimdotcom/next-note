"use client";
import supabase from "@/utils/supebase/client";
import type React from "react";
import Masonry from "react-masonry-css";

interface MasonryLayoutProps {
  children: React.ReactNode;
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ children }) => {
  const noteCount = supabase.from("notes").select("*", { count: "exact" });
  const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 2,
    500: 1,
  };
  console.log("noteCount", noteCount);

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto -ml-4"
      columnClassName="pl-4 bg-clip-padding"
    >
      {children}
    </Masonry>
  );
};

export default MasonryLayout;
