import { toast } from "@/hooks/use-toast";
import supabase from "@/utils/supebase/client";
import { redirect } from "next/navigation";

// Storage keys
const USERS_KEY = "s_RT_note_users";
const ACTIVE_USER_KEY = "RT_note_lastActiveUser";

/**
 * Sign in and store user session in localStorage.
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast({ title: "Something Went Wrong!!" });
    return null;
  }

  if (data.session) {
    let users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    // Check if user already exists
    const existingIndex = users.findIndex((u: any) => u.email === email);

    if (existingIndex !== -1) {
      users[existingIndex].session = data.session; // Update session
    } else {
      users.push({ email, session: data.session, isActive: false });
    }

    // Set the newly signed-in user as active
    users = users.map((u: any) => ({ ...u, isActive: u.email === email }));

    // Save to localStorage
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(ACTIVE_USER_KEY, email);

    return { user: data.user };
  }

  return null;
}

/**
 * Switch to another user by email.
 */
export async function switchUser(email: string) {
  let users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find((u: any) => u.email === email);

  if (user) {
    await supabase.auth.setSession(user.session);

    // Update active user flag
    users = users.map((u: any) => ({ ...u, isActive: u.email === email }));

    // Save updated users list
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(ACTIVE_USER_KEY, email);
    return user.email;
  }

  return null;
}

/**
 * Restore the last active user session.
 */
export async function restoreLastUser() {
  const lastUser = localStorage.getItem(ACTIVE_USER_KEY);
  if (lastUser) {
    return switchUser(lastUser); // Restore last active session
  }
  return null;
}

/**
 * Get the currently active user.
 */
export function getActiveUser() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  return users.find((u: any) => u.isActive) || null;
}

/**
 * Get all saved users.
 */
export function getAllUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

/**
 * get user index number from local storage
 *
 */
export function getLoggedinUserIndex(email: string | null) {
  const storageUser: [] = JSON.parse(
    localStorage.getItem("s_RT_note_users") || "[]"
  );
  return storageUser.findIndex((u: any) => u.email == email);
}
/**
 * Log out the active user.
 */
export async function logoutUser() {
  const activeUser = getActiveUser();
  if (!activeUser) return;

  let users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

  // Remove only the active user
  users = users.filter((u: any) => u.email !== activeUser.email);

  // Save updated users
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Remove active user flag
  localStorage.removeItem(ACTIVE_USER_KEY);

  // Logout from Supabase
  await supabase.auth.signOut();
  redirect("/signin");
}
