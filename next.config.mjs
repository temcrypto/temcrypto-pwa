import nextPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iconic.dynamic-static-assets.com',
        port: '',
        pathname: '/icons/sprite.svg',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA(nextConfig);
