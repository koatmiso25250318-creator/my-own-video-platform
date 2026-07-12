import { z } from "zod";

// サムネイル画像の受け入れ条件（クライアント・サーバー双方で使用）
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPT_ATTR = ALLOWED_IMAGE_TYPES.join(",");

/** 画像ファイルを検証し、問題があれば日本語エラーメッセージを返す。問題なければ null。 */
export function validateImageFile(file: {
  type: string;
  size: number;
}): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "JPEG・PNG・WebP 形式の画像を選択してください。";
  }
  if (file.size === 0) {
    return "ファイルが空です。別の画像を選択してください。";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "画像サイズが大きすぎます（上限 4MB）。";
  }
  return null;
}

// 講座フォームの入力検証
const optionalUrl = z
  .string()
  .trim()
  .url("正しいURL（http:// または https://）を入力してください。")
  .max(2048)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

export const courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください。")
    .max(120, "タイトルは120文字以内で入力してください。"),
  description: z
    .string()
    .trim()
    .min(1, "説明を入力してください。")
    .max(4000, "説明は4000文字以内で入力してください。"),
  videoUrl: optionalUrl,
  thumbnailUrl: optionalUrl,
});

export type CourseInput = z.infer<typeof courseSchema>;
