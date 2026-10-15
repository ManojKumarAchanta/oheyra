import { FastifyPluginAsync } from 'fastify';

const DEFAULT_VENUES = [
  {
    id: 'v1000000-0000-0000-0000-000000000001',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    neighborhood: 'Banjara Hills',
    name: 'Roastery Coffee House',
    slug: 'roastery-coffee-house',
    address: 'Road No. 14, Banjara Hills, Hyderabad',
    location: { lat: 17.4239, lng: 78.4358 },
    googleMapsUrl: 'https://maps.google.com/?q=Roastery+Coffee+House+Banjara+Hills',
    instagramHandle: '@roasterycoffeehousehyd',
  },
  {
    id: 'v1000000-0000-0000-0000-000000000002',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    neighborhood: 'Banjara Hills',
    name: 'Lamakaan',
    slug: 'lamakaan-cultural-space',
    address: 'Off Road No. 1, Banjara Hills, Hyderabad',
    location: { lat: 17.419, lng: 78.4498 },
    googleMapsUrl: 'https://maps.google.com/?q=Lamakaan+Hyderabad',
    instagramHandle: '@lamakaan_hyderabad',
  },
  {
    id: 'v1000000-0000-0000-0000-000000000004',
    cityId: 'a1b2c3d4-0000-0000-0000-000000000001',
    neighborhood: 'Jubilee Hills',
    name: 'Tabula Rasa - Café & Bar',
    slug: 'tabula-rasa-jubilee-hills',
    address: 'Road No. 67, Jubilee Hills, Hyderabad',
    location: { lat: 17.4284, lng: 78.397 },
    googleMapsUrl: 'https://maps.google.com/?q=Tabula+Rasa+Hyderabad',
    instagramHandle: '@tabularasacafebar',
  },
];

export const venueRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Params: { citySlug: string; slug: string } }>(
    '/api/v1/venues/:citySlug/:slug',
    async (request, reply) => {
      const { slug } = request.params;
      try {
        const { data, error } = await fastify.supabase
          .from('venues')
          .select('*, city:cities(*)')
          .eq('slug', slug)
          .single();

        if (error || !data) {
          const fallback = DEFAULT_VENUES.find((v) => v.slug === slug);
          if (!fallback) {
            return reply.status(404).send({
              success: false,
              error: { code: 'VENUE_NOT_FOUND', message: `Venue '${slug}' was not found.` },
            });
          }
          return reply.send({ success: true, data: fallback });
        }

        return reply.send({ success: true, data });
      } catch {
        const fallback = DEFAULT_VENUES.find((v) => v.slug === slug);
        if (!fallback) {
          return reply.status(404).send({
            success: false,
            error: { code: 'VENUE_NOT_FOUND', message: `Venue '${slug}' was not found.` },
          });
        }
        return reply.send({ success: true, data: fallback });
      }
    }
  );
};
