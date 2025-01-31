"use client";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
