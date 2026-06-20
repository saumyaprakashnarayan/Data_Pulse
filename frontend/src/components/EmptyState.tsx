import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
}

export const EmptyState = ({ icon: Icon, title, message }: EmptyStateProps) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
    <Icon className="mx-auto h-9 w-9 text-slate-400" aria-hidden="true" />
    <h2 className="mt-4 text-sm font-semibold text-slate-950">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{message}</p>
  </div>
);
