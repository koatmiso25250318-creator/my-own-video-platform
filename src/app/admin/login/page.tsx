import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) {
    redirect("/");
  }
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-xl font-bold text-slate-900">管理者ログイン</h1>
      <p className="mt-1 text-sm text-slate-500">
        講座の作成・編集・画像アップロードには管理者パスワードが必要です。
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
