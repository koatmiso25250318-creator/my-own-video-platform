import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { isAdmin } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "My Video Platform — 動画講座プラットフォーム",
  description: "動画講座を作成・公開・学習できるプラットフォーム",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();

  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-md text-lg font-bold text-slate-900"
              >
                <span aria-hidden="true">🎬</span>
                <span>
                  My Video<span className="text-indigo-600">Platform</span>
                </span>
              </Link>
              <nav className="flex items-center gap-3 text-sm">
                {admin ? (
                  <>
                    <span className="hidden rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 sm:inline">
                      管理者
                    </span>
                    <Link
                      href="/courses/new"
                      className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white shadow-sm transition hover:bg-indigo-700"
                    >
                      ＋ 講座を作成
                    </Link>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="rounded-md px-2 py-1.5 text-slate-500 transition hover:text-slate-800"
                      >
                        ログアウト
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/admin/login"
                    className="rounded-md px-2 py-1.5 text-slate-500 transition hover:text-slate-800"
                  >
                    管理者ログイン
                  </Link>
                )}
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row">
              <span>🎬 My Video Platform</span>
              <span>ClaudeCodeマスターゼミ 課題（EP35–EP38）</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
