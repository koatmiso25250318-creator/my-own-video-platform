"use client";

import { useRef, useState } from "react";
import {
  ACCEPT_ATTR,
  MAX_IMAGE_BYTES,
  validateImageFile,
} from "@/lib/validation";
import { Thumbnail } from "@/components/Thumbnail";

type Props = {
  name: string; // hidden input の name（フォーム送信で使う）
  initialUrl?: string | null;
  altText: string;
  onUploadingChange?: (uploading: boolean) => void;
};

/**
 * サムネイル画像を選択（クリック or ドラッグ&ドロップ）→即プレビュー→
 * サーバー(/api/upload)へアップロードし、保存された公開URLを hidden input に格納する。
 */
export function ThumbnailUploader({
  name,
  initialUrl,
  altText,
  onUploadingChange,
}: Props) {
  const [url, setUrl] = useState<string | null>(initialUrl ?? null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function setUploadingState(v: boolean) {
    setUploading(v);
    onUploadingChange?.(v);
  }

  async function processFile(file: File) {
    setError(null);

    const validationError = validateImageFile({ type: file.type, size: file.size });
    if (validationError) {
      setError(validationError);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploadingState(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        setError(data.error ?? "アップロードに失敗しました。");
        setPreviewUrl(null);
      } else {
        setUrl(data.url);
        setPreviewUrl(null);
      }
    } catch {
      setError("ネットワークエラーが発生しました。再度お試しください。");
      setPreviewUrl(null);
    } finally {
      URL.revokeObjectURL(localPreview);
      setUploadingState(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  }

  function handleRemove() {
    setUrl(null);
    setPreviewUrl(null);
    setError(null);
  }

  const displayUrl = previewUrl ?? url;
  const maxMb = Math.round(MAX_IMAGE_BYTES / (1024 * 1024));

  return (
    <div className="space-y-3">
      {/* フォーム送信用の hidden input（保存済み公開URL） */}
      <input type="hidden" name={name} value={url ?? ""} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !uploading) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label={url ? "サムネイル画像を差し替える" : "サムネイル画像を選択またはドロップ"}
        className={`relative max-w-md cursor-pointer rounded-lg border-2 border-dashed transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          dragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <Thumbnail
          src={displayUrl}
          alt={altText || "サムネイルプレビュー"}
          sizes="(max-width: 640px) 100vw, 28rem"
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
              アップロード中…
            </span>
          </div>
        )}
        {!displayUrl && !uploading && (
          <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs text-slate-400">
            クリック、またはここに画像をドロップ
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {url ? "画像を差し替える" : "画像を選択"}
        </button>
        {url && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm text-slate-500 underline hover:text-slate-700"
          >
            画像を外す
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-slate-500">
        JPEG・PNG・WebP／最大 {maxMb}MB。推奨比率 16:9。
      </p>

      {/* スクリーンリーダーへ状況を通知 */}
      <p aria-live="polite" className="sr-only">
        {uploading ? "画像をアップロード中です" : url ? "画像のアップロードが完了しました" : ""}
      </p>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
