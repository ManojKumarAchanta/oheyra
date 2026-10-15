import type { Metadata } from 'next';
import '../styles/globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { brand } from '@oheyra/config';

export const metadata: Metadata = {
  title: `${brand.name} — Discover Things to Do in Your City`,
  description: `${brand.tagline} Discover local events, cafés, pop-ups, workshops, sports screenings, and things to do around ${brand.launchCity} with ${brand.name}.`,
  keywords: [
    'Hyderabad events',
    'Things to do in Hyderabad',
    'Oheyra',
    'Live music Hyderabad',
    'Jubilee Hills nightlife',
    'Banjara Hills workshops',
    'Weekend pop-ups Hyderabad',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || brand.siteUrl),
  openGraph: {
    title: `${brand.name} — Discover Things to Do in Your City`,
    description: `${brand.tagline} Discover local events, cafés, pop-ups, workshops, and nightlife across ${brand.launchCity}.`,
    siteName: brand.name,
    locale: brand.defaultLocale,
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || brand.siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brand.name} — Discover Things to Do in Your City`,
    description: `${brand.tagline} Discover local events, cafés, and nightlife in ${brand.launchCity}.`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full h-full bg-background text-neutral-100 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
      </body>
    </html>
  );
}
