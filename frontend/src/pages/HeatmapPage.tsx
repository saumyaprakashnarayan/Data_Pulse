import { useCallback, useEffect, useState } from 'react';
import { Flame, MousePointerClick } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { HeatmapPlot } from '../components/HeatmapPlot';
import { LoadingState } from '../components/LoadingState';
import { useAsync } from '../hooks/useAsync';
import { analyticsService } from '../services/analytics.service';

export const HeatmapPage = () => {
  const [selectedPage, setSelectedPage] = useState('');
  const loadPages = useCallback(() => analyticsService.getPages(), []);
  const loadHeatmap = useCallback(
    () => (selectedPage ? analyticsService.getHeatmap(selectedPage) : Promise.resolve([])),
    [selectedPage],
  );
  const pagesState = useAsync(loadPages);
  const heatmapState = useAsync(loadHeatmap);

  useEffect(() => {
    if (!selectedPage && pagesState.data && pagesState.data.length > 0) {
      setSelectedPage(pagesState.data[0]);
    }
  }, [pagesState.data, selectedPage]);

  if (pagesState.isLoading && !pagesState.data) {
    return <LoadingState label="Loading pages" />;
  }

  if (pagesState.error) {
    return <ErrorState message={pagesState.error} onRetry={pagesState.refetch} />;
  }

  const pages = pagesState.data ?? [];

  if (pages.length === 0) {
    return (
      <EmptyState
        icon={Flame}
        title="No tracked pages"
        message="Open the demo site and click around once the API is connected."
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Heatmap</h2>
          <p className="mt-1 text-sm text-slate-500">{pages.length} tracked pages</p>
        </div>
        <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700 sm:max-w-sm">
          Page URL
          <select
            value={selectedPage}
            onChange={(event) => setSelectedPage(event.target.value)}
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          >
            {pages.map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </label>
      </section>

      {heatmapState.error ? (
        <ErrorState message={heatmapState.error} onRetry={heatmapState.refetch} />
      ) : heatmapState.isLoading ? (
        <LoadingState label="Loading clicks" />
      ) : heatmapState.data && heatmapState.data.length > 0 ? (
        <HeatmapPlot points={heatmapState.data} pageUrl={selectedPage} />
      ) : (
        <EmptyState
          icon={MousePointerClick}
          title="No clicks on this page"
          message="Choose another page or interact with the selected demo route."
        />
      )}
    </div>
  );
};
