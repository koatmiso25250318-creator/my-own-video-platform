import Link from "next/link";
import { Thumbnail } from "@/components/Thumbnail";

type Props = {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string | null;
    createdAt?: string;
  };
  priority?: boolean;
};

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

export function CourseCard({ course, priority }: Props) {
  const date = formatDate(course.createdAt);
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="overflow-hidden">
        <div className="transition duration-300 group-hover:scale-[1.03]">
          <Thumbnail
            src={course.thumbnailUrl}
            alt={`${course.title} のサムネイル`}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-indigo-700">
          {course.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-500">{course.description}</p>
        {date && <p className="pt-1 text-xs text-slate-400">{date}</p>}
      </div>
    </Link>
  );
}
