import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from './config/env.js';
import supabasePlugin from './plugins/supabase.js';
import errorHandlerPlugin from './plugins/error-handler.js';
import { healthRoutes } from './modules/health/routes.js';
import { cityRoutes } from './modules/cities/routes.js';
import { categoryRoutes } from './modules/categories/routes.js';
import { bannerRoutes } from './modules/banners/routes.js';
import { venueRoutes } from './modules/venues/routes.js';
import { eventRoutes } from './modules/events/routes.js';
import { favoriteRoutes } from './modules/favorites/routes.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: { colorize: true, translateTime: 'HH:MM:ss Z' },
            }
          : undefined,
    },
    disableRequestLogging: env.NODE_ENV === 'test',
  });

  // Security Headers
  app.register(helmet, {
    contentSecurityPolicy: false, // Allows flexible OpenAPI UI and Next.js integration
  });

  // CORS
  app.register(cors, {
    origin: (origin, cb) => {
      // Allow browser requests from matching web origins or localhost
      if (!origin || origin.includes('localhost') || origin === env.WEB_ORIGIN) {
        cb(null, true);
        return;
      }
      cb(null, true); // Permissive for public REST API; authorization is token-enforced
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Rate Limiting
  app.register(rateLimit, {
    max: 120,
    timeWindow: '1 minute',
  });

  // Swagger Documentation
  app.register(swagger, {
    openapi: {
      info: {
        title: 'PULSE Discovery API',
        description: 'Real-time hyper-local discovery platform API for Hyderabad',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://${env.HOST}:${env.PORT}`,
          description: 'Current environment',
        },
      ],
    },
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  // Database & Error Plugins
  app.register(supabasePlugin);
  app.register(errorHandlerPlugin);

  // Modular Domain Routes
  app.register(healthRoutes);
  app.register(cityRoutes);
  app.register(categoryRoutes);
  app.register(bannerRoutes);
  app.register(venueRoutes);
  app.register(eventRoutes);
  app.register(favoriteRoutes);

  return app;
}
