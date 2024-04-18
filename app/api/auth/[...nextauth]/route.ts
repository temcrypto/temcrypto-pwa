export { GET, POST } from '@/auth';

export const runtime =
  process.env.NODE_ENV === 'development' ? 'nodejs' : 'edge';
