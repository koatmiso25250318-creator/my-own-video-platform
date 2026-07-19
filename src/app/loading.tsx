export default function Loading() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="読み込み中">
      <div className="h-56 animate-pulse rounded-2xl bg-slate-200" />
      <div className="space-y-6">
        <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="aspect-video animate-pulse bg-slate-200" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
