import supabase from "@/utils/supebase/client";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  if (data.session) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({ email, session: data.session });
    localStorage.setItem("users", JSON.stringify(users));
  }

  return data.user;
}

export async function switchUser(email: string) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u: any) => u.email === email);

  if (user) {
    await supabase.auth.setSession(user.session);
    localStorage.setItem("RT_note_lastActiveUser", email);
    return user.email;
  }
  return null;
}

export async function lastLoggedInUser() {
  const lastUser = localStorage.getItem("lastActiveUser");
  if (lastUser) {
    switchUser(lastUser); // Restore last active session
  }
}
