import { FileText, MousePointerClick } from 'lucide-react';
import type { AnalyticsEvent } from '../types/analytics';
import { formatTime } from '../utils/format';

interface SessionTimelineProps {
  events: AnalyticsEvent[];
}

export const SessionTimeline = ({ events }: SessionTimelineProps) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
    <ol className="relative space-y-6 border-l border-slate-200 pl-6">
      {events.map((event) => {
        const isClick = event.eventType === 'click';
        const Icon = isClick ? MousePointerClick : FileText;

        return (
          <li key={event._id} className="relative">
            <span className="absolute -left-[35px] flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {isClick ? 'Click' : 'Page view'}
                </p>
                <p className="mt-1 break-all text-sm text-slate-600">{event.pageUrl}</p>
              </div>
              <time className="text-sm font-medium text-slate-500">
                {formatTime(event.timestamp)}
              </time>
            </div>
            {event.clickData ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                  x {Math.round(event.clickData.x)}
                </span>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  y {Math.round(event.clickData.y)}
                </span>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  </div>
);
