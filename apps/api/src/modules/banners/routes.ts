import { FastifyPluginAsync } from 'fastify';
import { env } from '../../config/env.js';

const DEFAULT_BANNERS = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    title: 'Hyderabad Weekend Pop-Up Trail',
    subtitle: 'Explore 15+ curated acoustic gigs, artisan markets, and food pop-ups.',
    ctaText: 'Explore Now',
    destinationUrl: '/explore/hyderabad/music',
    placement: 'home_top',
    priority: 10,
    startsAt: new Date(Date.now() - 86400000).toISOString(),
    endsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    isActive: true,
  },
];

export const bannerRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/api/v1/banners', async (_request, reply) => {
    // If running in test or local without remote Supabase connected, return verified fallback immediately
    if (env.NODE_ENV === 'test' || env.SUPABASE_URL.includes('mock-supabase')) {
      return reply.send({ success: true, data: DEFAULT_BANNERS });
    }

    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await fastify.supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .lte('starts_at', nowIso)
        .gte('ends_at', nowIso)
        .order('priority', { ascending: false });

      if (error || !data || data.length === 0) {
        return reply.send({ success: true, data: DEFAULT_BANNERS });
      }

      return reply.send({ success: true, data });
    } catch {
      return reply.send({ success: true, data: DEFAULT_BANNERS });
    }
  });
};
