import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCourseById } from "@/lib/courses";
import { isAdmin } from "@/lib/auth";
import { CourseForm } from "@/components/CourseForm";
import { updateCourse } from "@/app/courses/actions";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/courses/${course.id}`}
        className="text-sm text-slate-500 hover:text-slate-800"
      >
        ← 講座詳細へ戻る
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">講座を編集</h1>
      <div className="mt-6">
        <CourseForm
          action={updateCourse}
          submitLabel="変更を保存する"
          initial={{
            id: course.id,
            title: course.title,
            description: course.description,
            videoUrl: course.videoUrl,
            thumbnailUrl: course.thumbnailUrl,
          }}
        />
      </div>
    </div>
  );
}
