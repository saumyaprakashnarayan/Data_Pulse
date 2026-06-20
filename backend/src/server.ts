import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { app } from './app';
import { seedDefaultUsers } from './services/auth.service';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    await connectDatabase();
    await seedDefaultUsers();

    const server = app.listen(env.PORT, () => {
      logger.info(`API server listening on port ${env.PORT}`);
    });

    const shutdown = async (signal: NodeJS.Signals) => {
      logger.info(`Received ${signal}; closing server`);
      server.close(() => {
        void disconnectDatabase().finally(() => {
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start API server', error);
    process.exit(1);
  }
};

void startServer();
