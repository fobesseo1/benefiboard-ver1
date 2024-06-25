import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  let ip = forwarded ? forwarded.split(/, /)[0] : request.ip || 'Unknown IP';

  // IPv4 주소가 IPv6 형식으로 표현된 경우 처리
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  console.log('ip', ip);
  return NextResponse.json({ ip });
}
