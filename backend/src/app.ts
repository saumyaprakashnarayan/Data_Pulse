import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { authMiddleware } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { authRouter } from './routes/auth.routes';
import { eventsRouter } from './routes/events.routes';
import { heatmapRouter } from './routes/heatmap.routes';
import { pagesRouter } from './routes/pages.routes';
import { registerRouter } from './routes/register.routes';
import { sessionsRouter } from './routes/sessions.routes';
import { summaryRouter } from './routes/summary.routes';

const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : allowedOrigins,
    credentials: env.CORS_ORIGIN !== '*',
  }),
);
app.use(express.json({ limit: '64kb' }));
app.use(morgan(env.LOG_FORMAT));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/register', registerRouter);
app.use('/api/events', eventsRouter);
app.use('/api/sessions', authMiddleware, sessionsRouter);
app.use('/api/heatmap', authMiddleware, heatmapRouter);
app.use('/api/pages', authMiddleware, pagesRouter);
app.use('/api/summary', authMiddleware, summaryRouter);

app.use(notFound);
app.use(errorHandler);
