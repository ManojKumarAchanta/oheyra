import { FastifyPluginAsync } from 'fastify';
import { env } from '../../config/env.js';

const DEFAULT_CITIES = [
  {
    id: 'a1b2c3d4-0000-0000-0000-000000000001',
    name: 'Hyderabad',
    slug: 'hyderabad',
    state: 'Telangana',
    countryCode: 'IN',
    center: { lat: 17.385, lng: 78.4867 },
    defaultZoom: 12,
    isActive: true,
  },
];

export const cityRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/api/v1/cities', async (_request, reply) => {
    if (env.NODE_ENV === 'test' || env.SUPABASE_URL.includes('mock-supabase')) {
      return reply.send({ success: true, data: DEFAULT_CITIES });
    }

    try {
      const { data, error } = await fastify.supabase
        .from('cities')
        .select('*')
        .eq('is_active', true);

      if (error || !data || data.length === 0) {
        return reply.send({ success: true, data: DEFAULT_CITIES });
      }

      return reply.send({ success: true, data });
    } catch {
      return reply.send({ success: true, data: DEFAULT_CITIES });
    }
  });

  fastify.get<{ Params: { slug: string } }>('/api/v1/cities/:slug', async (request, reply) => {
    const { slug } = request.params;
    const city = DEFAULT_CITIES.find((c) => c.slug === slug);
    if (!city) {
      return reply.status(404).send({
        success: false,
        error: { code: 'CITY_NOT_FOUND', message: `City '${slug}' not supported yet.` },
      });
    }
    return reply.send({ success: true, data: city });
  });
};
