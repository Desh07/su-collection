import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Swarna Herathi\'s Su Collection × UVA VEC | Free Workshop',
  description: 'Join the Free Tailoring & Business Growth Workshop on 19 September 2026. Discover your path — Technical Tailoring Mentorship, DIY Business Growth, or expert consultation.',
  keywords: 'tailoring workshop, sinhala, su collection, UVA VEC, business growth, free workshop',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="si-LK">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
