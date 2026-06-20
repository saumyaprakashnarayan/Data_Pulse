export type EventType = 'page_view' | 'click';

export interface SessionSummary {
  sessionId: string;
  totalEvents: number;
  firstVisit: string;
  lastActivity: string;
  durationMs: number;
  pageViews: number;
  clicks: number;
}

export interface AnalyticsEvent {
  _id: string;
  sessionId: string;
  eventType: EventType;
  pageUrl: string;
  timestamp: string;
  clickData?: {
    x: number;
    y: number;
  };
}

export interface HeatmapPoint {
  x: number;
  y: number;
}

export interface AnalyticsSummary {
  totalSessions: number;
  totalEvents: number;
  trackedPages: number;
  pageViews: number;
  clicks: number;
  recentActivity?: string;
}
