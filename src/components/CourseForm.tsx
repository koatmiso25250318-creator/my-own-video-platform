"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { CourseFormState } from "@/app/courses/actions";
import { ThumbnailUploader } from "@/components/ThumbnailUploader";

type CourseValues = {
  id?: string;
  title?: string | null;
  description?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
};

type Props = {
  action: (prev: CourseFormState, formData: FormData) => Promise<CourseFormState>;
  initial?: CourseValues;
  submitLabel: string;
};

function SubmitButton({ label, disabled }: { label: string; disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "保存中…" : disabled ? "アップロード完了までお待ちください" : label}
    </button>
  );
}

export function CourseForm({ action, initial, submitLabel }: Props) {
  const [state, formAction] = useActionState<CourseFormState, FormData>(action, {});
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");

  const fieldError = (key: keyof NonNullable<CourseFormState["fieldErrors"]>) =>
    state.fieldErrors?.[key];

  return (
    <form action={formAction} className="space-y-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      {state.error && (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
          講座タイトル <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          placeholder="例: はじめての Next.js 入門"
        />
        {fieldError("title") && (
          <p className="text-sm text-red-600">{fieldError("title")}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          講座の説明 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={4000}
          defaultValue={initial?.description ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          placeholder="この講座で学べる内容を入力してください。"
        />
        {fieldError("description") && (
          <p className="text-sm text-red-600">{fieldError("description")}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="videoUrl" className="block text-sm font-medium text-slate-700">
          動画URL（任意）
        </label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          defaultValue={initial?.videoUrl ?? ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {fieldError("videoUrl") && (
          <p className="text-sm text-red-600">{fieldError("videoUrl")}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <span className="block text-sm font-medium text-slate-700">サムネイル画像</span>
        <ThumbnailUploader
          name="thumbnailUrl"
          initialUrl={initial?.thumbnailUrl}
          altText={title ? `${title} のサムネイル` : "サムネイル"}
          onUploadingChange={setUploading}
        />
      </div>

      <div className="flex items-center gap-4 border-t border-slate-200 pt-6">
        <SubmitButton label={submitLabel} disabled={uploading} />
      </div>
    </form>
  );
}
