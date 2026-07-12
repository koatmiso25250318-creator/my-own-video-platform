"use client";

import { deleteCourse } from "@/app/courses/actions";

export function DeleteCourseButton({ id }: { id: string }) {
  return (
    <form
      action={deleteCourse}
      onSubmit={(e) => {
        if (!window.confirm("この講座を削除します。よろしいですか？")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        削除
      </button>
    </form>
  );
}
