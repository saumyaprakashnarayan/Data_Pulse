import { z } from 'zod';

const clickCoordinatesSchema = z.object({
  x: z.coerce.number().finite().nonnegative(),
  y: z.coerce.number().finite().nonnegative(),
});

export const createEventSchema = z
  .object({
    sessionId: z.string().trim().min(1).max(128),
    eventType: z.enum(['page_view', 'click']),
    pageUrl: z.string().trim().min(1).max(2048),
    timestamp: z.coerce.date().optional(),
    customerId: z.string().trim().min(1).max(128).optional(),
    x: z.coerce.number().finite().nonnegative().optional(),
    y: z.coerce.number().finite().nonnegative().optional(),
    clickData: clickCoordinatesSchema.optional(),
  })
  .superRefine((event, context) => {
    if (event.eventType !== 'click') {
      return;
    }

    const hasNestedCoordinates = event.clickData !== undefined;
    const hasTopLevelCoordinates = event.x !== undefined && event.y !== undefined;

    if (!hasNestedCoordinates && !hasTopLevelCoordinates) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Click events require x and y coordinates',
        path: ['clickData'],
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(1),
});

export const sessionIdParamSchema = z.object({
  sessionId: z.string().trim().min(1).max(128),
});

export const heatmapQuerySchema = z.object({
  pageUrl: z.string().trim().min(1).max(2048),
  customerId: z.string().trim().min(1).max(128).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
