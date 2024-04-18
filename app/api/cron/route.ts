import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('authentication failed', { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
