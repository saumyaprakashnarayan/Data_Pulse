import { api } from './api';
import type {
  AnalyticsEvent,
  AnalyticsSummary,
  HeatmapPoint,
  SessionSummary,
} from '../types/analytics';

export const analyticsService = {
  async getSummary() {
    const { data } = await api.get<AnalyticsSummary>('/summary');
    return data;
  },

  async getSessions() {
    const { data } = await api.get<SessionSummary[]>('/sessions');
    return data;
  },

  async getSessionEvents(sessionId: string) {
    const { data } = await api.get<AnalyticsEvent[]>(`/sessions/${encodeURIComponent(sessionId)}`);
    return data;
  },

  async getPages() {
    const { data } = await api.get<string[]>('/pages');
    return data;
  },

  async getHeatmap(pageUrl: string) {
    const { data } = await api.get<HeatmapPoint[]>('/heatmap', {
      params: { pageUrl },
    });
    return data;
  },
};
