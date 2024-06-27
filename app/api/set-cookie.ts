// /app/api/set-cookie.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: any) {
          res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; Secure; Max-Age=${options.maxAge}`);
        },
        remove(name: string, options: any) {
          res.setHeader('Set-Cookie', `${name}=; Path=/; HttpOnly; Secure; Max-Age=0`);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: currentUser, error } = await supabase
      .from('userdata')
      .select('id, username, avatar_url, email, current_points')
      .eq('id', user.id)
      .single();

    if (currentUser) {
      res.setHeader('Set-Cookie', `currentUser=${JSON.stringify(currentUser)}; Path=/; HttpOnly; Secure; Max-Age=604800`);
      res.status(200).json({ message: 'Cookie set successfully' });
    } else {
      console.error('Error fetching currentUser:', error);
      res.status(500).json({ message: 'Error fetching user data' });
    }
  } else {
    res.status(200).json({ message: 'No user found' });
  }
}
