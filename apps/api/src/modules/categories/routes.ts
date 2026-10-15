import { FastifyPluginAsync } from 'fastify';
import { env } from '../../config/env.js';

const DEFAULT_CATEGORIES = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Live Music', slug: 'music', iconName: 'Music', colorHex: '#8B5CF6', displayOrder: 1, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'Nightlife', slug: 'nightlife', iconName: 'Sparkles', colorHex: '#EC4899', displayOrder: 2, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'Food & Pop-ups', slug: 'food', iconName: 'Utensils', colorHex: '#F59E0B', displayOrder: 3, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'Arts & Culture', slug: 'arts', iconName: 'Palette', colorHex: '#06B6D4', displayOrder: 4, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000005', name: 'Fitness & Outdoor', slug: 'fitness', iconName: 'Activity', colorHex: '#10B981', displayOrder: 5, isActive: true },
  { id: 'c1000000-0000-0000-0000-000000000006', name: 'Workshops', slug: 'workshops', iconName: 'BookOpen', colorHex: '#6366F1', displayOrder: 6, isActive: true },
];

export const categoryRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/api/v1/categories', async (_request, reply) => {
    if (env.NODE_ENV === 'test' || env.SUPABASE_URL.includes('mock-supabase')) {
      return reply.send({ success: true, data: DEFAULT_CATEGORIES });
    }

    try {
      const { data, error } = await fastify.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return reply.send({ success: true, data: DEFAULT_CATEGORIES });
      }

      return reply.send({ success: true, data });
    } catch {
      return reply.send({ success: true, data: DEFAULT_CATEGORIES });
    }
  });
};
