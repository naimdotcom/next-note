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
import React, { useState } from "react";
import supabase from "@/utils/supebase/client";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { isObject } from "util";

interface signupT {
  username: string;
  email: string;
  password: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [signupData, setSignupData] = useState<signupT>({
    username: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    if (!signupData.email || !signupData.password || !signupData.username) {
      toast({
        title: "All fields require",
        description: "Check if there any fields that you haven't fullfilled",
      });
      console.log("clicked");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: { data: { username: signupData.username } },
    });
    if (error) {
      toast({
        title: `Something went wrong`,
        variant: "destructive",
      });
    }

    if (typeof data == "object") {
      redirect("/signin");
    }
    console.log("data and error", data, error);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to sign up to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="jackson"
                  onChange={handleInputChange}
                  //   required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={handleInputChange}
                  //   required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={handleInputChange}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={(e) => handleSignUp(e)}
              >
                Sign up
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/signin" className="underline underline-offset-4">
                Sign In
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
