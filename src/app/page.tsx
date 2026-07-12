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
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">講座一覧</h1>
          <p className="mt-1 text-sm text-slate-500">
            動画講座を探して学習しましょう。
          </p>
        </div>
        {admin && (
          <Link
            href="/courses/new"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            ＋ 講座を作成
          </Link>
        )}
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
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-slate-500">まだ講座がありません。</p>
          {admin && (
            <Link
              href="/courses/new"
              className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              最初の講座を作成する
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
