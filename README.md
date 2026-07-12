# My Video Platform（講座プラットフォーム）

動画講座を作成・公開できる学習プラットフォームです。
ClaudeCodeマスターゼミ 第1期の課題（EP35 / EP36）として作成しました。

## 機能

- 講座の一覧表示（サムネイル付きカードグリッド）
- 講座の詳細表示（サムネイル・説明・YouTube等の動画埋め込み）
- 講座の作成・編集・削除（管理者のみ）
- **サムネイル画像アップロード（EP35で追加）**
  - PCから画像を選択し、選択直後にプレビュー表示
  - 対応形式: JPEG / PNG / WebP
  - サイズ上限: **4MB**
  - 不正な形式・空ファイル・上限超過は日本語エラーで通知
  - アップロード中はボタンを無効化（二重送信防止）
  - 保存した画像URLを講座データに関連付け、一覧・詳細で表示
  - 画像未設定・取得失敗時はプレースホルダーを表示（16:9 / object-fit: cover）
  - 既存画像の差し替えに対応

## 技術スタック

- **フレームワーク**: Next.js 15（App Router）
- **言語**: TypeScript
- **UI/CSS**: Tailwind CSS
- **データベース**: Vercel Postgres（Neon）
- **ORM**: Prisma
- **画像ストレージ**: Vercel Blob（サーバー経由アップロード）
- **入力検証**: zod
- **パッケージマネージャー**: npm

## データモデル

`Course`（`prisma/schema.prisma`）

| フィールド | 型 | 説明 |
| --- | --- | --- |
| id | String (cuid) | 主キー |
| title | String | 講座タイトル |
| description | String | 講座の説明 |
| videoUrl | String? | 動画URL（任意） |
| thumbnailUrl | String? | サムネイル画像URL（EP35で追加。未設定でも表示可能） |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

## 必要な環境変数（変数名のみ）

`.env.example` を参照してください。ローカルでは `.env.local` に実値を設定します。

| 変数名 | 用途 |
| --- | --- |
| `POSTGRES_PRISMA_URL` | 講座データ用DB接続（Prisma 経由 / プール接続） |
| `POSTGRES_URL_NON_POOLING` | マイグレーション用の直接接続 |
| `BLOB_READ_WRITE_TOKEN` | サムネイル画像の保存（サーバー側のみ使用） |
| `ADMIN_PASSWORD` | 講座の作成・編集・アップロードを保護する管理者パスワード |

> ⚠️ 実値（トークン・パスワード・接続文字列）は、コード・README・Git に含めないでください。

## ローカル起動

```bash
# 1. 依存関係をインストール
npm install

# 2. 環境変数を用意（Vercel でストレージ作成後に取得するのが簡単）
#    Vercel プロジェクトに link 済みなら:
npx vercel env pull .env.local
#    もしくは .env.example をコピーして手動で値を設定:
#    cp .env.example .env.local

# 3. データベースにスキーマを適用（初回のみ）
npx prisma migrate deploy   # 既存のマイグレーションを適用
#    もしくは開発中にスキーマを直接反映:
#    npm run db:push

# 4. 開発サーバー起動
npm run dev
# http://localhost:3000
```

管理操作（作成・編集・アップロード）を行うには、`/admin/login` で `ADMIN_PASSWORD` を入力してログインします。

## データベースマイグレーション手順

スキーマ定義は `prisma/schema.prisma`、マイグレーションは `prisma/migrations/` にあります。

- 本番/プレビューへの適用: `npx prisma migrate deploy`
  （本アプリの `build` スクリプトに含まれており、Vercel デプロイ時に自動適用されます）
- スキーマを変更した場合: `npx prisma migrate dev --name <変更名>` でマイグレーションを追加

既存講座は `thumbnailUrl` 未設定でもプレースホルダーで正常表示されます（後方互換）。

## Vercel への公開

1. GitHub リポジトリに push
2. Vercel でプロジェクトを import（または `npx vercel link`）
3. Vercel Dashboard の **Storage** で以下を作成・接続
   - **Postgres**（→ `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` が自動設定）
   - **Blob**（→ `BLOB_READ_WRITE_TOKEN` が自動設定）
4. **Settings → Environment Variables** で `ADMIN_PASSWORD` を設定
5. Preview デプロイ: `npx vercel`
6. 動作確認後、Production デプロイ: `npx vercel --prod`

`build` スクリプトが `prisma migrate deploy` を実行するため、デプロイ時にDBスキーマが自動適用されます。

## セキュリティ上の注意

- 秘密情報（トークン・パスワード・接続文字列）は絶対にコミットしないでください。
- 画像アップロードは管理者ログイン必須です（無認証の公開アップロード口は作っていません）。
- 本アプリの認証は課題デモ用の簡易パスワード方式です。実運用では正式な認証基盤の導入を検討してください。

## Production URL / GitHub リポジトリ

- Production URL: （公開後に記載）
- GitHub リポジトリ: （作成後に記載）
