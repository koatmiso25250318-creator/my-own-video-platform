import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getAllCourses, type Course } from "@/lib/courses";
import { CourseCard } from "@/components/CourseCard";

// 保存済みデータを参照するため常に動的レンダリング（ビルド時に外部接続しない）
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const admin = await isAdmin();

  let courses: Course[] = [];
  let dbError = false;

  try {
    courses = await getAllCourses();
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-12 text-white sm:px-10 sm:py-16">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-medium text-indigo-200">動画講座プラットフォーム</p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            学びたいときに、動画で学ぶ。
          </h1>
          <p className="text-indigo-100">
            興味のある講座を選んで、いつでも視聴できます。サムネイルから内容がひと目でわかります。
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#courses"
              className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
            >
              講座を見る
            </a>
            {admin && (
              <Link
                href="/courses/new"
                className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                ＋ 講座を作成
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 講座一覧 */}
      <section id="courses" className="scroll-mt-20 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">講座一覧</h2>
            <p className="mt-1 text-sm text-slate-500">
              {dbError ? " " : `${courses.length} 件の講座`}
            </p>
          </div>
        </div>

        {dbError ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            <p className="font-semibold">講座データを読み込めませんでした。</p>
            <p className="mt-1">
              画像・データストレージ（環境変数 BLOB_READ_WRITE_TOKEN）の設定を
              確認してください。README を参照してください。
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">まだ講座がありません。</p>
            {admin && (
              <Link
                href="/courses/new"
                className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                最初の講座を作成する
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} priority={i < 3} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
