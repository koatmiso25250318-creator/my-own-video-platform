"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * 16:9 のアスペクト比を確保してレイアウトシフトを抑えたサムネイル表示。
 * - 恒久URL(https)は next/image で最適化表示（remotePatterns で許可済み）
 * - ローカルプレビュー(blob:/data:)は最適化を無効化してそのまま表示
 * - 画像が未設定 or 読み込み失敗時はプレースホルダー（onError の無限ループを防止）
 */
export function Thumbnail({ src, alt, className, priority, sizes }: Props) {
  const [failed, setFailed] = useState(false);

  // src が差し替わったらエラー状態をリセット（新しい画像を再評価する）
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = Boolean(src) && !failed;
  const isLocalPreview =
    typeof src === "string" && (src.startsWith("blob:") || src.startsWith("data:"));

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden bg-slate-100 ${className ?? ""}`}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className="object-cover"
          priority={priority}
          unoptimized={isLocalPreview}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-10 w-10"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="text-xs">サムネイル未設定</span>
        </div>
      )}
    </div>
  );
}
