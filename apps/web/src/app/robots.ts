import { MetadataRoute } from 'next';
import { brand } from '@oheyra/config';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || brand.siteUrl;
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/saved/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
