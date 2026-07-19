import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel Blob の公開ドメインのみを最小許可（任意ホストは許可しない）。
    // 例: https://<storeId>.public.blob.vercel-storage.com/thumbnails/<uuid>.png
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
