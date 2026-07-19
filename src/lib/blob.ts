import "server-only";
import { del } from "@vercel/blob";

const BLOB_HOST_MARKER = ".public.blob.vercel-storage.com";

/** URL が自プロジェクトの Vercel Blob 上のサムネイルかどうか。 */
export function isManagedThumbnailUrl(url: string | null | undefined): boolean {
  return Boolean(url) && url!.includes(BLOB_HOST_MARKER) && url!.includes("/thumbnails/");
}

/**
 * 孤立したサムネイル Blob を安全に削除する。
 * - 管理対象（自Blobのthumbnails配下）以外は無視する
 * - 削除失敗は握りつぶし（呼び出し元の保存処理を失敗させない）、孤立Blobとして警告ログのみ
 */
export async function deleteThumbnail(url: string | null | undefined): Promise<void> {
  if (!isManagedThumbnailUrl(url)) return;
  try {
    await del(url as string);
  } catch {
    console.warn("[blob] 旧サムネイルの削除に失敗（孤立Blobの可能性）:", (url as string).split("/").pop());
  }
}
