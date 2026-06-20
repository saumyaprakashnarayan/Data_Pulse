import { MousePointerClick } from 'lucide-react';
import type { HeatmapPoint } from '../types/analytics';

interface HeatmapPlotProps {
  points: HeatmapPoint[];
  pageUrl: string;
}

export const HeatmapPlot = ({ points, pageUrl }: HeatmapPlotProps) => {
  const maxX = Math.max(1200, ...points.map((point) => point.x));
  const maxY = Math.max(800, ...points.map((point) => point.y));

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="flex flex-col gap-2 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Click activity</h2>
          <p className="mt-1 break-all text-sm text-slate-500">{pageUrl}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          <MousePointerClick className="h-4 w-4" aria-hidden="true" />
          {points.length}
        </span>
      </div>
      <div className="p-4">
        <div className="relative aspect-[16/10] min-h-72 overflow-hidden rounded-md border border-slate-200 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px]">
          <div className="absolute inset-x-0 top-0 h-10 border-b border-slate-200 bg-white/75 px-3 py-2 text-xs font-medium text-slate-500">
            {Math.round(maxX)} x {Math.round(maxY)} observed coordinate space
          </div>
          {points.map((point, index) => {
            const left = `${Math.min(98, Math.max(2, (point.x / maxX) * 100))}%`;
            const top = `${Math.min(96, Math.max(6, (point.y / maxY) * 100))}%`;
            const size = 18 + Math.min(24, index % 5);

            return (
              <span
                key={`${point.x}-${point.y}-${index}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/30 ring-2 ring-sky-600/35"
                style={{
                  left,
                  top,
                  width: size,
                  height: size,
                }}
                title={`x ${Math.round(point.x)}, y ${Math.round(point.y)}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
