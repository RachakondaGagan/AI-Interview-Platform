"use server";
import { cookies } from "next/headers";

const MOCK_USER = {
  id: "user1",
  name: "Test User",
  email: "test@example.com"
};

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", "mock_session", { maxAge: 60 * 60 * 24 * 7, path: "/" });
}

export async function signUp(params: any) {
  return { success: true, message: "Account created successfully. Please sign in." };
}

export async function signIn(params: any) {
  const cookieStore = await cookies();
  cookieStore.set("session", "mock_session", { maxAge: 60 * 60 * 24 * 7, path: "/" });
  return { success: true };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getCurrentUser(): Promise<any | null> {
  const cookieStore = await cookies();
  if (cookieStore.get("session")) {
    return MOCK_USER;
  }
  return null;
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return !!cookieStore.get("session");
}
