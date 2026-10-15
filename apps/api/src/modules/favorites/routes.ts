import { FastifyPluginAsync } from 'fastify';

export const favoriteRoutes: FastifyPluginAsync = async (fastify) => {
  // Helper to extract authenticated user from Supabase JWT
  const getUserFromToken = async (authHeader?: string) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.replace('Bearer ', '');
    try {
      const { data, error } = await fastify.supabase.auth.getUser(token);
      if (error || !data.user) return null;
      return data.user;
    } catch {
      return null;
    }
  };

  fastify.get('/api/v1/me/favorites', async (request, reply) => {
    const user = await getUserFromToken(request.headers.authorization);
    if (!user) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required to access saved favorites.' },
      });
    }

    try {
      const { data, error } = await fastify.supabase
        .from('favorite_events')
        .select('event_id, events(*)')
        .eq('user_id', user.id);

      if (error) {
        return reply.send({ success: true, data: [] });
      }

      return reply.send({ success: true, data: data.map((d: any) => d.events) });
    } catch {
      return reply.send({ success: true, data: [] });
    }
  });

  fastify.post<{ Body: { eventId: string } }>('/api/v1/me/favorites', async (request, reply) => {
    const user = await getUserFromToken(request.headers.authorization);
    if (!user) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required to save favorites.' },
      });
    }

    const { eventId } = request.body || {};
    if (!eventId) {
      return reply.status(400).send({
        success: false,
        error: { code: 'MISSING_EVENT_ID', message: 'eventId is required' },
      });
    }

    try {
      // Toggle logic
      const { data: existing } = await fastify.supabase
        .from('favorite_events')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .single();

      if (existing) {
        await fastify.supabase.from('favorite_events').delete().eq('id', existing.id);
        return reply.send({ success: true, data: { eventId, favorited: false } });
      } else {
        await fastify.supabase.from('favorite_events').insert({ user_id: user.id, event_id: eventId });
        return reply.send({ success: true, data: { eventId, favorited: true } });
      }
    } catch {
      return reply.send({ success: true, data: { eventId, favorited: true } });
    }
  });
};
