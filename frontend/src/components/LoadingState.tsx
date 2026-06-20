export const LoadingState = ({ label = 'Loading' }: { label?: string }) => (
  <div className="flex min-h-48 items-center justify-center rounded-lg border border-slate-200 bg-white">
    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-500" />
      {label}
    </div>
  </div>
);
