import type { Metadata, Viewport } from 'next';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-retro',
});

export const metadata: Metadata = {
  title: 'ENERVIT x Jizerská 50 - Výživový závod',
  description:
    'Virtuální závod Jizerské 50. Zvládni 50 km a nauč se správnou výživovou strategii s produkty ENERVIT!',
  keywords: [
    'Jizerská 50',
    'ENERVIT',
    'běžky',
    'výživa',
    'sport',
    'hra',
    'závod',
  ],
  authors: [{ name: 'ENERVIT' }],
  openGraph: {
    title: 'ENERVIT x Jizerská 50 - Výživový závod',
    description:
      'Zvládni virtuálních 50 km a nauč se správnou výživovou strategii!',
    type: 'website',
    locale: 'cs_CZ',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ENERVIT x Jizerská 50',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ENERVIT x Jizerská 50 - Výživový závod',
    description:
      'Zvládni virtuálních 50 km a nauč se správnou výživovou strategii!',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ff6600',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${pressStart2P.variable} antialiased bg-gray-900 text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
