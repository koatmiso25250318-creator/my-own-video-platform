import Link from "next/link";
import { Thumbnail } from "@/components/Thumbnail";

type Props = {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string | null;
  };
};

export function CourseCard({ course }: Props) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500"
    >
      <Thumbnail src={course.thumbnailUrl} alt={`${course.title} のサムネイル`} />
      <div className="space-y-1 p-4">
        <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-slate-700">
          {course.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-500">{course.description}</p>
      </div>
    </Link>
  );
}
