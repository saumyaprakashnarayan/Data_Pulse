import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, FileText, MousePointerClick } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { SessionTimeline } from '../components/SessionTimeline';
import { StatCard } from '../components/StatCard';
import { useAsync } from '../hooks/useAsync';
import { analyticsService } from '../services/analytics.service';
import { compactNumber, formatDateTime } from '../utils/format';

export const SessionDetailPage = () => {
  const { sessionId = '' } = useParams();
  const loadEvents = useCallback(() => analyticsService.getSessionEvents(sessionId), [sessionId]);
  const state = useAsync(loadEvents);

  if (state.isLoading && !state.data) {
    return <LoadingState label="Loading journey" />;
  }

  if (state.error) {
    return <ErrorState message={state.error} onRetry={state.refetch} />;
  }

  const events = state.data ?? [];
  const clicks = events.filter((event) => event.eventType === 'click').length;
  const pageViews = events.filter((event) => event.eventType === 'page_view').length;

  return (
    <div className="space-y-6">
      <Link
        to="/sessions"
        className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Sessions
      </Link>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-medium text-slate-500">Session ID</p>
        <h2 className="mt-2 break-all font-mono text-xl font-semibold text-slate-950">
          {sessionId}
        </h2>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Events" value={compactNumber(events.length)} icon={Clock3} tone="sky" />
        <StatCard
          label="Page Views"
          value={compactNumber(pageViews)}
          icon={FileText}
          tone="emerald"
        />
        <StatCard
          label="Clicks"
          value={compactNumber(clicks)}
          icon={MousePointerClick}
          tone="amber"
        />
      </section>

      {events.length > 0 ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Journey timeline</h2>
            <p className="mt-1 text-sm text-slate-500">
              First event {formatDateTime(events[0]?.timestamp)}
            </p>
          </div>
          <SessionTimeline events={events} />
        </section>
      ) : (
        <EmptyState
          icon={Clock3}
          title="No events recorded"
          message="This session exists, but no events were returned by the API."
        />
      )}
    </div>
  );
};
