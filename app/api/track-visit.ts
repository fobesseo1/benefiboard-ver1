import { NextResponse } from 'next/server';
import createSupabaseServerClient from '@/lib/supabse/server';

export async function POST(request) {
  const { userId, pagePath } = await request.json();
  const ip =
    request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('page_visits').insert([
    {
      user_id: userId,
      ip_address: ip,
      page_path: pagePath,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
