import { type Metadata, type Viewport } from 'next';
import { Nunito } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import Header from '@/components/Header';
import { PixPaymentProvider } from '@/context/PixPaymentContext';

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
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
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
    // statusBarStyle: 'black-translucent',
    statusBarStyle: 'default',
    // statusBarColor: '#1e293b',
  },
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    url: APP_URL,
  },
  twitter: {
    card: 'summary',
    creator: '@TemCryptoApp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="splashscreens/iphone5_splash.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens/iphone6_splash.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens/iphoneplus_splash.png"
          media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens/iphonex_splash.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens/iphonexr_splash.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens/iphonexsmax_splash.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens/ipad_splash.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens/ipadpro1_splash.png"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens/ipadpro3_splash.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens/ipadpro2_splash.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
      </head>
      <body className={`${nunito.className}`}>
        <main id="layout-app" className="min-h-screen h-auto max-h-screen">
          <Header />

          <div className="safe-top safe-left safe-right safe-bottom m-6">
            <PixPaymentProvider>{children}</PixPaymentProvider>
          </div>
        </main>

        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
