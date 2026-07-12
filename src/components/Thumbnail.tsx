"use client";

import { useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * 16:9 のアスペクト比を確保してレイアウトシフトを抑えたサムネイル表示。
 * 画像が未設定、または読み込み失敗時はプレースホルダーを表示する。
 */
export function Thumbnail({ src, alt, className, priority }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden bg-slate-100 ${className ?? ""}`}
    >
      {showImage ? (
        // next/image ではなく <img> を使用（Blob ドメイン設定不要・onError でフォールバック可能）
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src as string}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
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
