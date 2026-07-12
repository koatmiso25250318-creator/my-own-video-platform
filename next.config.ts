import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // サムネイルは <img> + object-fit で表示し、レイアウトシフトを抑えるため
  // 画像最適化ドメイン設定は不要。将来 next/image を使う場合はここに
  // images.remotePatterns で Vercel Blob ドメインを追加する。
};

export default nextConfig;
