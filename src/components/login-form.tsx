"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import supabase from "@/utils/supebase/client";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

interface signinT {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [signinData, setSigninData] = useState<signinT>({
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSigninData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSignIn = async (e: any) => {
    e.preventDefault();

    if (!signinData.email || !signinData.password) {
      toast({
        title: "All fields require",
        description: "Check if there any fields that you haven't fullfilled",
      });
      console.log("clicked");
      return;
    }
    const { user } = await signIn(signinData.email, signinData.password);

    // if (typeof data == "object") {
    //   redirect("/");
    // }
    console.log("data and error", user);
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign-in</CardTitle>
          <CardDescription>
            Enter your email below to sign-in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    // href="#"
                    onClick={() => {
                      toast({
                        title: "Not Available now....",
                        description: "forget password functionality not added.",
                        variant: "destructive",
                      });
                    }}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit" className="w-full">
                Signin
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
