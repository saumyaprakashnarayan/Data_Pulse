import { EventModel } from '../models/Event';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getCustomerScope = (req: AuthenticatedRequest) => {
  const customerId = req.user?.customerId;
  return customerId ? { sessionId: customerId } : {};
};

export const getCustomerAnalyticsSummary = async (req: AuthenticatedRequest) => {
  const filter = getCustomerScope(req);
  const [totalEvents, sessions, pages, pageViews, clicks, recentEvent] = await Promise.all([
    EventModel.countDocuments(filter),
    EventModel.distinct('sessionId', filter),
    EventModel.distinct('pageUrl', filter),
    EventModel.countDocuments({ ...filter, eventType: 'page_view' }),
    EventModel.countDocuments({ ...filter, eventType: 'click' }),
    EventModel.findOne(filter).sort({ timestamp: -1 }).select({ timestamp: 1 }).lean(),
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
