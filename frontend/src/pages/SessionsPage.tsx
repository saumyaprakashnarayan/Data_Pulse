import { useCallback, useMemo, useState } from 'react';
import { Activity, Clock3, Files, Search, Users } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { SessionsTable } from '../components/SessionsTable';
import { StatCard } from '../components/StatCard';
import { useAsync } from '../hooks/useAsync';
import { analyticsService } from '../services/analytics.service';
import { compactNumber, formatDateTime } from '../utils/format';

export const SessionsPage = () => {
  const [query, setQuery] = useState('');
  const loadSessions = useCallback(async () => {
    const [summary, sessions] = await Promise.all([
      analyticsService.getSummary(),
      analyticsService.getSessions(),
    ]);

    return { summary, sessions };
  }, []);
  const state = useAsync(loadSessions);

  const filteredSessions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!state.data?.sessions || normalizedQuery.length === 0) {
      return state.data?.sessions ?? [];
    }

    return state.data.sessions.filter((session) =>
      session.sessionId.toLowerCase().includes(normalizedQuery),
    );
  }, [query, state.data?.sessions]);

  if (state.isLoading && !state.data) {
    return <LoadingState label="Loading sessions" />;
  }

  if (state.error) {
    return <ErrorState message={state.error} onRetry={state.refetch} />;
  }

  const summary = state.data?.summary;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Sessions"
          value={compactNumber(summary?.totalSessions ?? 0)}
          icon={Users}
          tone="sky"
        />
        <StatCard
          label="Total Events"
          value={compactNumber(summary?.totalEvents ?? 0)}
          icon={Activity}
          tone="emerald"
        />
        <StatCard
          label="Tracked Pages"
          value={compactNumber(summary?.trackedPages ?? 0)}
          icon={Files}
          tone="amber"
        />
        <StatCard
          label="Recent Activity"
          value={formatDateTime(summary?.recentActivity)}
          icon={Clock3}
          tone="indigo"
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Session activity</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredSessions.length} of {state.data?.sessions.length ?? 0} sessions
            </p>
          </div>
          <label className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search session ID"
              className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>
        </div>

        {filteredSessions.length > 0 ? (
          <SessionsTable sessions={filteredSessions} />
        ) : (
          <EmptyState
            icon={Users}
            title="No sessions found"
            message="Open the demo site and interact with the pages once the API is connected."
          />
        )}
      </section>
    </div>
  );
};
