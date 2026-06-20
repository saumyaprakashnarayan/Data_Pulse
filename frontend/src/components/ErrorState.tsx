import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-rose-950">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold">Unable to load data</h2>
          <p className="mt-1 text-sm text-rose-800">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-9 items-center justify-center rounded-md bg-rose-900 px-3 text-sm font-semibold text-white transition hover:bg-rose-800"
        >
          Retry
        </button>
      ) : null}
    </div>
  </div>
);
