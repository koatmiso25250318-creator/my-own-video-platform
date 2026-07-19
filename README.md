# My Video Platform（講座プラットフォーム）

動画講座を作成・公開できる学習プラットフォームです。
ClaudeCodeマスターゼミ 第1期の課題（EP35 / EP36）として作成しました。

- 🌐 **公開サイト（Production）**: https://my-own-video-platform-sepia.vercel.app
- 📦 **GitHub リポジトリ**: https://github.com/koatmiso25250318-creator/my-own-video-platform

## 更新内容（EP37 / EP38）

- **EP37: Vercel Blob 連携の整備**
  - 既存の公開 Blob store（重複作成なし）を再利用し、サムネイル画像と講座データ(JSON)を保存。
  - `BLOB_READ_WRITE_TOKEN` はサーバー側のみで使用し、クライアントへ露出しない。
  - Production / Preview / Development すべてに環境変数を設定済み。
  - **孤立 Blob の掃除**: 画像の差し替え・講座削除時に、どの講座からも参照されなくなった旧サムネイルを安全に削除（参照が残る場合は削除しない）。
- **EP38: 画像表示の堅牢化とデザイン改善**
  - サムネイル表示を **next/image** に移行し、`remotePatterns` で Vercel Blob ドメインのみを最小許可。16:9・`object-fit: cover`・`fill`＋`sizes` でレイアウトシフトを抑制し最適化。
  - 画像未設定・読み込み失敗時は安全なプレースホルダーへフォールバック（`onError` の無限ループを防止）。差し替えは常に新しい URL のため、CDN キャッシュに古い画像が残らない。
  - Hero セクション、ブランドアクセントカラー、カード/詳細（パンくず・公開日）、ドラッグ&ドロップ対応のアップロードUI、ローディング/404 状態、フォーカス可視化・`aria-live` などの UI/UX・アクセシビリティ改善。

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
- **データ保存**: Vercel Blob（講座データを JSON、サムネイル画像をファイルとして保存）
- **入力検証**: zod
- **認証**: 管理者パスワードによる簡易ゲート（Cookieセッション）
- **ホスティング**: Vercel
- **パッケージマネージャー**: npm

## データモデル

講座データは Vercel Blob 上の `data/courses.json`（`Course[]`）として永続化します。

| フィールド | 型 | 説明 |
| --- | --- | --- |
| id | string (uuid) | 主キー |
| title | string | 講座タイトル |
| description | string | 講座の説明 |
| videoUrl | string \| null | 動画URL（任意。YouTubeは埋め込み表示） |
| thumbnailUrl | string \| null | サムネイル画像URL（EP35で追加。未設定でもフォールバック表示） |
| createdAt | string (ISO8601) | 作成日時 |
| updatedAt | string (ISO8601) | 更新日時 |

> サムネイル画像は Vercel Blob の `thumbnails/<uuid>.<ext>` に公開ファイルとして保存されます。

## 必要な環境変数（変数名のみ）

`.env.example` を参照してください。ローカルでは `.env.local` に実値を設定します。

| 変数名 | 用途 |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | 講座データ(JSON)とサムネイル画像の保存（サーバー側のみ使用） |
| `ADMIN_PASSWORD` | 講座の作成・編集・アップロードを保護する管理者パスワード |

> ⚠️ 実値（トークン・パスワード）は、コード・README・Git に含めないでください。

## ローカル起動

```bash
# 1. 依存関係をインストール
npm install

# 2. 環境変数を用意（Vercel に link 済みなら CLI で取得できる）
npx vercel env pull .env.local
#    もしくは .env.example をコピーして手動で値を設定

# 3. 開発サーバー起動
npm run dev
# http://localhost:3000
```

管理操作（作成・編集・アップロード）を行うには、`/admin/login` で `ADMIN_PASSWORD` を入力してログインします。

## 検証コマンド

```bash
npm run lint       # ESLint
npm run typecheck  # 型チェック
npm run build      # 本番ビルド
```

## Vercel への公開（EP36）

このプロジェクトは Vercel CLI でデプロイしています。

```bash
# 初回のみ: プロジェクトを link
npx vercel link

# Blob ストアを作成・接続（環境変数 BLOB_READ_WRITE_TOKEN が自動設定される）
npx vercel blob create-store <store-name> --access public --yes

# 管理者パスワードを設定
npx vercel env add ADMIN_PASSWORD production --value <パスワード>

# 本番公開
npx vercel deploy --prod
```

環境変数を変更した場合は、反映のため再デプロイが必要です。

## セキュリティ上の注意

- 秘密情報（トークン・パスワード）は絶対にコミットしないでください（`.gitignore` 済み）。
- 画像アップロードは管理者ログイン必須です（無認証の公開アップロード口は作っていません）。
- 本アプリの認証は課題デモ用の簡易パスワード方式です。実運用では正式な認証基盤の導入を検討してください。
- 講座データは公開 Blob に保存されるため、機微な情報は登録しないでください。
