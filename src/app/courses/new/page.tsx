import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { CourseForm } from "@/components/CourseForm";
import { createCourse } from "@/app/courses/actions";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
        ← 講座一覧へ戻る
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">講座を作成</h1>
      <div className="mt-6">
        <CourseForm action={createCourse} submitLabel="講座を作成する" />
      </div>
    </div>
  );
}
