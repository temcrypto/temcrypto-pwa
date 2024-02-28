import nextPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
};

const withPWA = nextPWA({
  dest: 'public',
});

export default withPWA(nextConfig);
