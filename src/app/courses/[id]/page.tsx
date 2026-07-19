import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseById } from "@/lib/courses";
import { isAdmin } from "@/lib/auth";
import { Thumbnail } from "@/components/Thumbnail";
import { DeleteCourseButton } from "@/components/DeleteCourseButton";
import { toYouTubeEmbed } from "@/lib/video";

export const dynamic = "force-dynamic";

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

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
  const created = formatDate(course.createdAt);

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {/* breadcrumb */}
      <nav aria-label="パンくず" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="rounded hover:text-slate-800 hover:underline">
              講座一覧
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="line-clamp-1 font-medium text-slate-700">{course.title}</li>
        </ol>
      </nav>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Thumbnail
          src={course.thumbnailUrl}
          alt={`${course.title} のサムネイル`}
          priority
          sizes="(max-width: 768px) 100vw, 48rem"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
          {created && <p className="text-sm text-slate-400">公開日: {created}</p>}
        </div>
        <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
          {course.description}
        </p>

        {course.videoUrl && (
          <div className="space-y-2 pt-2">
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
                className="inline-block text-sm text-indigo-600 underline hover:text-indigo-800"
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
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            編集
          </Link>
          <DeleteCourseButton id={course.id} />
        </div>
      )}
    </article>
  );
}
