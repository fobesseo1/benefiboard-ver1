'use server';

import createSupabaseServerClient from '../supabse/server';

export default async function readUserSessionServer() {
  const supabase = await createSupabaseServerClient();

  return supabase.auth.getSession();
}
