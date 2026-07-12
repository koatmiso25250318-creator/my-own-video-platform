import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

// 課題デモ用の簡易管理者ゲート。
// ADMIN_PASSWORD 環境変数と一致した場合のみ、講座の作成・編集・画像アップロードを許可する。
// セッションは httpOnly Cookie に「パスワードのハッシュ」を保存して判定する（実値は保存しない）。

const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 8; // 8時間

function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHash("sha256").update(`admin:${pw}`).digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const store = await cookies();
  const current = store.get(COOKIE_NAME)?.value;
  if (!current) return false;
  // タイミング攻撃を避けるため timingSafeEqual で比較
  const a = Buffer.from(current);
  const b = Buffer.from(token);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function login(password: string): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  const token = expectedToken();
  if (!pw || !token || password !== pw) return false;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("UNAUTHORIZED");
  }
}
