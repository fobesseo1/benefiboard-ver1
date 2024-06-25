'use client';

import createSupabaseBrowserClient from '../supabse/client';

export default async function readUserSessionBrowser() {
  const supabase = await createSupabaseBrowserClient();

  return supabase.auth.getSession();
}
