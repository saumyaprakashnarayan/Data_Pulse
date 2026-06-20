import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: 'sky' | 'emerald' | 'amber' | 'indigo';
}

const toneClasses = {
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
};

export const StatCard = ({ label, value, icon: Icon, tone }: StatCardProps) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      </div>
      <span className={`rounded-md p-2 ring-1 ${toneClasses[tone]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
    </div>
  </section>
);
