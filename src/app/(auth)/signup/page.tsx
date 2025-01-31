import { SignupForm } from "@/components/signup-form";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="grid container mx-auto place-content-center h-screen">
      <SignupForm />
    </div>
  );
}
