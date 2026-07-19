import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-6xl font-bold text-indigo-600">404</p>
      <h1 className="mt-4 text-xl font-bold text-slate-900">
        ページが見つかりませんでした
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        お探しの講座は削除されたか、URLが正しくない可能性があります。
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        講座一覧へ戻る
      </Link>
    </div>
  );
}
