import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulse.city';

  const staticRoutes = [
    '',
    '/qr',
    '/submit',
    '/explore/hyderabad/music',
    '/explore/hyderabad/nightlife',
    '/explore/hyderabad/food',
    '/explore/hyderabad/arts',
    '/explore/hyderabad/fitness',
    '/explore/hyderabad/workshops',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const seedSlugs = [
    'acoustic-sunset-indie-roots',
    'lamakaan-open-mic-spoken-word',
    'artisanal-coffee-tasting-pour-over-lab',
    'twilight-old-city-photowalk',
    'deep-house-synthwave-night',
  ];

  const eventRoutes = seedSlugs.map((slug) => ({
    url: `${siteUrl}/events/hyderabad/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...eventRoutes];
}
