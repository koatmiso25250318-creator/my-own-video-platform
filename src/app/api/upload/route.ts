import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { isAdmin } from "@/lib/auth";
import { validateImageFile } from "@/lib/validation";

// Blob SDK は Node.js ランタイムで動作させる
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // 認可: 管理者のみアップロード可能（無警告の公開アップロード口を作らない）
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "権限がありません。管理者としてログインしてください。" },
      { status: 401 }
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "画像ストレージが未設定です。管理者にお問い合わせください。" },
      { status: 500 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "画像ファイルが見つかりません。" }, { status: 400 });
  }

  // サーバー側でも MIME・サイズ・空ファイルを検証
  const validationError = validateImageFile({ type: file.type, size: file.size });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  // 衝突しにくい一意な pathname
  const pathname = `thumbnails/${crypto.randomUUID()}.${ext}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch {
    // 内部エラーの詳細（トークン・スタックトレース等）はクライアントへ返さない
    return NextResponse.json(
      { error: "画像のアップロードに失敗しました。時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }
}
