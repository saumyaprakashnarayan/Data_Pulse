import { Schema, model, type HydratedDocument } from 'mongoose';

export type EventType = 'page_view' | 'click';

export interface ClickData {
  x: number;
  y: number;
}

export interface AnalyticsEvent {
  sessionId: string;
  eventType: EventType;
  pageUrl: string;
  timestamp: Date;
  customerId?: string;
  clickData?: ClickData;
}

export type AnalyticsEventDocument = HydratedDocument<AnalyticsEvent>;

const clickDataSchema = new Schema<ClickData>(
  {
    x: { type: Number, required: true, min: 0 },
    y: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const eventSchema = new Schema<AnalyticsEvent>(
  {
    sessionId: { type: String, required: true, index: true, trim: true },
    eventType: { type: String, enum: ['page_view', 'click'], required: true },
    pageUrl: { type: String, required: true, index: true, trim: true },
    timestamp: { type: Date, required: true, default: Date.now, index: true },
    customerId: { type: String, required: false, index: true, trim: true },
    clickData: { type: clickDataSchema, required: false },
  },
  {
    collection: 'events',
    versionKey: false,
  },
);

eventSchema.index({ sessionId: 1, timestamp: 1 });
eventSchema.index({ pageUrl: 1, eventType: 1, timestamp: -1 });
eventSchema.index({ customerId: 1, timestamp: -1 });
eventSchema.index({ timestamp: -1 });

export const EventModel = model<AnalyticsEvent>('Event', eventSchema);
