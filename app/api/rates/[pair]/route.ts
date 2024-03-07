import { type NextRequest, NextResponse } from 'next/server';

import { getUsers } from '@/lib/db/getUsers';
import getRate from '@/lib/kp/getRate';
import { type kpRatePair } from '@/lib/kp/types';

export async function GET(
  _: NextRequest,
  context: { params: { pair: kpRatePair } }
) {
  const { pair } = context.params;

  try {
    const rate = await getRate(pair, 'charge', 100);
    const users = await getUsers();

    return NextResponse.json({ pair, rate, users }, { status: 200 });
  } catch (error: any) {
    return new NextResponse(`${error.message}: ${error.statusText}`, {
      status: error.status,
    });
  }
}
