import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { isAdmin } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "My Video Platform — 講座プラットフォーム",
  description: "動画講座を作成・公開できる学習プラットフォーム",
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
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-bold text-slate-900">
                🎬 My Video Platform
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                {admin ? (
                  <>
                    <Link
                      href="/courses/new"
                      className="rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-700"
                    >
                      ＋ 講座を作成
                    </Link>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="text-slate-500 hover:text-slate-800"
                      >
                        ログアウト
                      </button>
                    </form>
                  </>
                ) : (
                  <Link href="/admin/login" className="text-slate-500 hover:text-slate-800">
                    管理者ログイン
                  </Link>
                )}
              </nav>
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-slate-400">
              My Video Platform — ClaudeCodeマスターゼミ 課題 (EP35 / EP36)
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
