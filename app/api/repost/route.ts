/* // app/api/repost/route.ts

import { NextResponse } from 'next/server';
import createSupabaseServerClient from '@/lib/supabse/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 10;

  const supabase = await createSupabaseServerClient();

  let supabaseQuery = supabase.from('repost_data').select('*', { count: 'exact' });

  if (query) {
    // 검색어가 있는 경우
    const searchTerms = query.split(' ').filter((term) => term.length > 0);
    const searchConditions = searchTerms.map((term) => `title.ilike.%${term}%`);
    supabaseQuery = supabaseQuery.or(searchConditions.join(','));
  }

  const { data, error, count } = await supabaseQuery
    .order('batch', { ascending: false })
    .order('order', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error('Error fetching reposts:', error);
    return NextResponse.json({ error: 'Failed to fetch reposts' }, { status: 500 });
  }

  return NextResponse.json({ data, totalCount: count });
}
 */
