import type { Metadata } from 'next';
import '../styles/globals.css';
import { Navbar } from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'PULSE — Real-Time Local Discovery in Hyderabad',
  description: 'Your City. Your Vibe. Right Now. Discover live music, night pop-ups, artisan workshops, and food trails across Hyderabad.',
  keywords: ['Hyderabad events', 'Live music Hyderabad', 'Jubilee Hills nightlife', 'Banjara Hills workshops', 'Things to do tonight Hyderabad'],
  openGraph: {
    title: 'PULSE — Real-Time Local Discovery in Hyderabad',
    description: 'Find out what is happening around you right now, tonight, or this weekend in Hyderabad.',
    siteName: 'PULSE',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PULSE — Real-Time Local Discovery in Hyderabad',
    description: 'Your City. Your Vibe. Right Now.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-neutral-100 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
