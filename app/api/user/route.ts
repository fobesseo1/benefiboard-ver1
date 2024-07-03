// pages/api/user.ts 또는 app/api/user/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: userData, error } = await supabase
      .from('userdata')
      .select('id, username, avatar_url, email, current_points')
      .eq('id', user.id)
      .single();

    if (userData) {
      return new Response(JSON.stringify(userData), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'User data not found' }), { status: 404 });
    }
  } else {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
  }
}
