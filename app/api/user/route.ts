import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const currentUserCookie = cookieStore.get('currentUser');

  if (currentUserCookie) {
    const currentUser = JSON.parse(currentUserCookie.value);
    return NextResponse.json(currentUser);
  }

  return NextResponse.json(null);
}
