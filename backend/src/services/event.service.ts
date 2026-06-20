import { EventModel, type AnalyticsEvent } from '../models/Event';
import type { CreateEventInput } from '../utils/validators';

interface EventQueryFilter {
  customerId?: string;
}

export interface SessionSummary {
  sessionId: string;
  totalEvents: number;
  firstVisit: Date;
  lastActivity: Date;
  durationMs: number;
  pageViews: number;
  clicks: number;
}

export interface AnalyticsSummary {
  totalSessions: number;
  totalEvents: number;
  trackedPages: number;
  pageViews: number;
  clicks: number;
  recentActivity?: Date;
}

const toClickData = (input: CreateEventInput) => {
  if (input.eventType !== 'click') {
    return undefined;
  }

  if (input.clickData) {
    return input.clickData;
  }

  return { x: input.x as number, y: input.y as number };
};

export const createEvent = async (input: CreateEventInput) => {
  const event: AnalyticsEvent = {
    sessionId: input.sessionId,
    eventType: input.eventType,
    pageUrl: input.pageUrl,
    timestamp: input.timestamp ?? new Date(),
    customerId: input.customerId,
    clickData: toClickData(input),
  };

  await EventModel.create(event);
};

export const getSessionSummaries = async (
  filter: EventQueryFilter = {},
): Promise<SessionSummary[]> => {
  const match = filter.customerId ? { customerId: filter.customerId } : {};

  return EventModel.aggregate<SessionSummary>([
    { $match: match },
    {
      $group: {
        _id: '$sessionId',
        totalEvents: { $sum: 1 },
        firstVisit: { $min: '$timestamp' },
        lastActivity: { $max: '$timestamp' },
        pageViews: {
          $sum: { $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0] },
        },
        clicks: {
          $sum: { $cond: [{ $eq: ['$eventType', 'click'] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        sessionId: '$_id',
        totalEvents: 1,
        firstVisit: 1,
        lastActivity: 1,
        durationMs: { $subtract: ['$lastActivity', '$firstVisit'] },
        pageViews: 1,
        clicks: 1,
      },
    },
    { $sort: { lastActivity: -1 } },
  ]);
};

export const getEventsBySessionId = async (sessionId: string, filter: EventQueryFilter = {}) => {
  const query = filter.customerId ? { sessionId, customerId: filter.customerId } : { sessionId };

  return EventModel.find(query)
    .sort({ timestamp: 1 })
    .select({ _id: 1, sessionId: 1, eventType: 1, pageUrl: 1, timestamp: 1, clickData: 1 })
    .lean();
};

export const getClickCoordinatesByPage = async (
  pageUrl: string,
  filter: EventQueryFilter = {},
) => {
  const match = {
    pageUrl,
    eventType: 'click',
    'clickData.x': { $type: 'number' },
    'clickData.y': { $type: 'number' },
    ...(filter.customerId ? { customerId: filter.customerId } : {}),
  };

  return EventModel.aggregate<{ x: number; y: number }>([
    {
      $match: match,
    },
    { $sort: { timestamp: -1 } },
    {
      $project: {
        _id: 0,
        x: '$clickData.x',
        y: '$clickData.y',
      },
    },
  ]);
};

export const getTrackedPages = async (filter: EventQueryFilter = {}) => {
  const query = filter.customerId ? { customerId: filter.customerId } : {};
  const pages = await EventModel.distinct('pageUrl', query);
  return pages.sort((a, b) => a.localeCompare(b));
};

export const getAnalyticsSummary = async (
  filter: EventQueryFilter = {},
): Promise<AnalyticsSummary> => {
  const query = filter.customerId ? { customerId: filter.customerId } : {};
  const [totalEvents, sessions, pages, pageViews, clicks, recentEvent] = await Promise.all([
    EventModel.countDocuments(query),
    EventModel.distinct('sessionId', query),
    EventModel.distinct('pageUrl', query),
    EventModel.countDocuments({ ...query, eventType: 'page_view' }),
    EventModel.countDocuments({ ...query, eventType: 'click' }),
    EventModel.findOne(query).sort({ timestamp: -1 }).select({ timestamp: 1 }).lean(),
  ]);

  return {
    totalSessions: sessions.length,
    totalEvents,
    trackedPages: pages.length,
    pageViews,
    clicks,
    recentActivity: recentEvent?.timestamp,
  };
};
