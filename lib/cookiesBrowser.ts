'use server';

import { getcurrentUserFromCookies } from '@/lib/cookies';

export async function getcurrentUserBrowserFromCookie() {
  return await getcurrentUserFromCookies();
}
