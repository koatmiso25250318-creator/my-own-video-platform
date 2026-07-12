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
 * サムネイル画像を選択→即プレビュー→サーバー(/api/upload)へアップロードし、
 * 保存された公開URLを hidden input に格納する。
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
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function setUploadingState(v: boolean) {
    setUploading(v);
    onUploadingChange?.(v);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // クライアント側検証
    const validationError = validateImageFile({ type: file.type, size: file.size });
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    // 選択直後のローカルプレビュー
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

      <div className="max-w-md">
        <Thumbnail src={displayUrl} alt={altText || "サムネイルプレビュー"} />
        {uploading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            アップロード中…
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
