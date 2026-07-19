import "server-only";
import crypto from "crypto";
import { list, put } from "@vercel/blob";
import type { CourseInput } from "@/lib/validation";
import { deleteThumbnail } from "@/lib/blob";

// 講座データは Vercel Blob 上の JSON ファイル1つで永続化する。
// （課題デモ用途・単一管理者前提。講座情報は公開情報のため公開 Blob で問題ない）

export type Course = {
  id: string;
  title: string;
  description: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
};

const DATA_PATHNAME = "data/courses.json";

async function findDataUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: DATA_PATHNAME, limit: 100 });
  const found = blobs.find((b) => b.pathname === DATA_PATHNAME);
  return found ? found.url : null;
}

/** 全講座を取得（新しい順）。データ未作成・取得失敗時は空配列。 */
export async function getAllCourses(): Promise<Course[]> {
  const url = await findDataUrl();
  if (!url) return [];
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  try {
    const data = (await res.json()) as Course[];
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

async function saveAllCourses(courses: Course[]): Promise<void> {
  await put(DATA_PATHNAME, JSON.stringify(courses), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    // 更新直後に古い内容がCDNから返らないよう常に再検証させる
    cacheControlMaxAge: 0,
  });
}

export async function getCourseById(id: string): Promise<Course | null> {
  const courses = await getAllCourses();
  return courses.find((c) => c.id === id) ?? null;
}

export async function insertCourse(input: CourseInput): Promise<Course> {
  const courses = await getAllCourses();
  const now = new Date().toISOString();
  const course: Course = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    videoUrl: input.videoUrl,
    thumbnailUrl: input.thumbnailUrl,
    createdAt: now,
    updatedAt: now,
  };
  courses.unshift(course);
  await saveAllCourses(courses);
  return course;
}

export async function patchCourse(
  id: string,
  input: CourseInput
): Promise<Course | null> {
  const courses = await getAllCourses();
  const idx = courses.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated: Course = {
    ...courses[idx],
    title: input.title,
    description: input.description,
    videoUrl: input.videoUrl,
    thumbnailUrl: input.thumbnailUrl,
    updatedAt: new Date().toISOString(),
  };
  courses[idx] = updated;
  await saveAllCourses(courses);
  return updated;
}

export async function removeCourse(id: string): Promise<void> {
  const courses = await getAllCourses();
  const next = courses.filter((c) => c.id !== id);
  if (next.length !== courses.length) {
    await saveAllCourses(next);
  }
}

/**
 * 指定したサムネイルURLが、どの講座からも参照されていなければ Blob を削除する。
 * 差し替え・削除後の孤立Blob掃除に使う（参照が残っていれば削除しない＝安全側）。
 * 呼び出し元では「新URLの保存が成功した後」に実行すること。
 */
export async function cleanupUnreferencedThumbnail(
  url: string | null | undefined
): Promise<void> {
  if (!url) return;
  const courses = await getAllCourses();
  if (courses.some((c) => c.thumbnailUrl === url)) return;
  await deleteThumbnail(url);
}
