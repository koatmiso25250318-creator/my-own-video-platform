import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseById } from "@/lib/courses";
import { isAdmin } from "@/lib/auth";
import { Thumbnail } from "@/components/Thumbnail";
import { DeleteCourseButton } from "@/components/DeleteCourseButton";
import { toYouTubeEmbed } from "@/lib/video";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) {
    notFound();
  }

  const admin = await isAdmin();
  const embedUrl = course.videoUrl ? toYouTubeEmbed(course.videoUrl) : null;

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
        ← 講座一覧へ戻る
      </Link>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Thumbnail
          src={course.thumbnailUrl}
          alt={`${course.title} のサムネイル`}
          priority
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
        <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
          {course.description}
        </p>

        {course.videoUrl && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">動画</h2>
            {embedUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                <iframe
                  src={embedUrl}
                  title={`${course.title} の動画`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <a
                href={course.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-blue-600 underline hover:text-blue-800"
              >
                動画を開く
              </a>
            )}
          </div>
        )}
      </div>

      {admin && (
        <div className="flex items-center gap-3 border-t border-slate-200 pt-6">
          <Link
            href={`/courses/${course.id}/edit`}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            編集
          </Link>
          <DeleteCourseButton id={course.id} />
        </div>
      )}
    </article>
  );
}
