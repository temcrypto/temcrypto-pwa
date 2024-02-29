import { type NextRequest, NextResponse } from 'next/server';
import getRate from '@/libs/kp/getRate';
import getToken from '@/libs/kp/getToken';
import { type kpRatePair } from '@/libs/kp/types';

export async function GET(
  _: NextRequest,
  context: { params: { pair: kpRatePair } }
) {
  const { pair } = context.params;

  try {
    const kpToken = await getToken();
    console.log('🚀 ~ kpToken:', kpToken);
    const rate = await getRate(pair, 'charge', 100);

    return NextResponse.json({ pair, rate }, { status: 200 });
  } catch (error: any) {
    return new NextResponse(`${error.message}: ${error.statusText}`, {
      status: error.status,
    });
  }
}
