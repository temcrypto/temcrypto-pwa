import { type Metadata, type Viewport } from 'next';
import { Nunito } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import Header from '@/components/Header';
import { SendPixProvider } from '@/context/SendPixContext';

import './globals.css';

const nunito = Nunito({ weight: ['800', '900'], subsets: ['latin'] });

// Set metadata
const SITE_NAME = 'TEMCRYPTO';
const APP_URL = 'https://app.temcrypto.com';

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1e293b' }, // INFO: tailwindcss color slate-800
    // { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: light)', color: '#1e293b' },
  ],
};

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: 'Pay and get paid to Pix using crypto.',
  applicationName: SITE_NAME,
  metadataBase: new URL(APP_URL),
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    siteName: SITE_NAME,
    // locale: 'en_US',
    type: 'website',
    url: APP_URL,
  },
  twitter: {
    card: 'summary',
    // card: 'summary_large_image',
    creator: '@temcrypto',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scrollbar-hide">
      <body className={`${nunito.className} scrollbar-hide`}>
        <section
          id="layout-app"
          className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 scrollbar-hide"
        >
          <div className="flex h-screen flex-col justify-between">
            <Header />
            <main className="mb-auto py-8">
              <SendPixProvider>{children}</SendPixProvider>
            </main>
            <Toaster />
          </div>
        </section>
      </body>
    </html>
  );
}
