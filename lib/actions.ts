'use server';

import { cookies } from 'next/headers';

export async function setUserCookie(userData: any) {
  cookies().set('currentUser', JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
  });
}

export async function getUserFromCookie() {
  const userCookie = cookies().get('currentUser');
  if (userCookie) {
    return JSON.parse(userCookie.value);
  }
  return null;
}
