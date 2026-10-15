import { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  const handler = async () => {
    return {
      success: true,
      data: {
        status: 'healthy',
        service: 'pulse-api',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
    };
  };

  fastify.get('/health', handler);
  fastify.get('/api/v1/health', handler);
};
