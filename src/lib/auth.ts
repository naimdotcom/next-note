import { toast } from "@/hooks/use-toast";
import supabase from "@/utils/supebase/client";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast({
      title: "something went wrong",
    });
  }

  if (data.session) {
    const users = JSON.parse(localStorage.getItem("s_RT_note_users") || "[]");
    users.push({ email, session: data.session });
    localStorage.setItem("users", JSON.stringify(users));
  }

  return {
    user: data.user && { user: data.user },
  };
}

export async function switchUser(email: string) {
  const users = JSON.parse(localStorage.getItem("s_RT_note_users") || "[]");
  const user = users.find((u: any) => u.email === email);

  if (user) {
    await supabase.auth.setSession(user.session);
    localStorage.setItem("RT_note_lastActiveUser", email);
    return user.email;
  }
  return null;
}

export async function lastLoggedInUser() {
  const lastUser = localStorage.getItem("RT_note_lastActiveUser");
  if (lastUser) {
    switchUser(lastUser); // Restore last active session
  }
}
