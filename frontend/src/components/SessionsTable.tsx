import { Link } from 'react-router-dom';
import { Clock, MousePointerClick } from 'lucide-react';
import type { SessionSummary } from '../types/analytics';
import { formatDateTime, formatDuration } from '../utils/format';

interface SessionsTableProps {
  sessions: SessionSummary[];
}

export const SessionsTable = ({ sessions }: SessionsTableProps) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Session
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Events
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              First Visit
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Last Activity
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Duration
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sessions.map((session) => (
            <tr key={session.sessionId} className="transition hover:bg-slate-50">
              <td className="px-4 py-4">
                <Link
                  to={`/sessions/${encodeURIComponent(session.sessionId)}`}
                  className="font-mono text-sm font-semibold text-slate-950 hover:text-sky-700"
                >
                  {session.sessionId}
                </Link>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {session.totalEvents}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" />
                    {session.clicks}
                  </span>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                {formatDateTime(session.firstVisit)}
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                {formatDateTime(session.lastActivity)}
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                {formatDuration(session.durationMs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
