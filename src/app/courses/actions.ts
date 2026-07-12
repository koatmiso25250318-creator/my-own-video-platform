"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { courseSchema } from "@/lib/validation";

export type CourseFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"title" | "description" | "videoUrl" | "thumbnailUrl", string>>;
};

function parseForm(formData: FormData) {
  return courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    videoUrl: formData.get("videoUrl") ?? "",
    thumbnailUrl: formData.get("thumbnailUrl") ?? "",
  });
}

function toFieldErrors(
  issues: { path: (string | number)[]; message: string }[]
): CourseFormState["fieldErrors"] {
  const fe: CourseFormState["fieldErrors"] = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (key === "title" || key === "description" || key === "videoUrl" || key === "thumbnailUrl") {
      fe[key] = issue.message;
    }
  }
  return fe;
}

export async function createCourse(
  _prev: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  if (!(await isAdmin())) {
    return { error: "権限がありません。管理者としてログインしてください。" };
  }
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "入力内容を確認してください。", fieldErrors: toFieldErrors(parsed.error.issues) };
  }
  const course = await prisma.course.create({ data: parsed.data });
  revalidatePath("/");
  redirect(`/courses/${course.id}`);
}

export async function updateCourse(
  _prev: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  if (!(await isAdmin())) {
    return { error: "権限がありません。管理者としてログインしてください。" };
  }
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { error: "対象の講座が特定できませんでした。" };
  }
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "入力内容を確認してください。", fieldErrors: toFieldErrors(parsed.error.issues) };
  }
  await prisma.course.update({ where: { id }, data: parsed.data });
  revalidatePath("/");
  revalidatePath(`/courses/${id}`);
  redirect(`/courses/${id}`);
}

export async function deleteCourse(formData: FormData): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("UNAUTHORIZED");
  }
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.course.delete({ where: { id } });
    revalidatePath("/");
  }
  redirect("/");
}
