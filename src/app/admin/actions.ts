"use server";

import { redirect } from "next/navigation";
import { login, logout } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!password) {
    return { error: "パスワードを入力してください。" };
  }
  const ok = await login(password);
  if (!ok) {
    return { error: "パスワードが正しくありません。" };
  }
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect("/");
}
