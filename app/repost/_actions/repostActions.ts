// app/repost/_actions/repostActions.ts

'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { RepostType } from '../_component/repost_list';

function buildSearchQuery(query: string | null) {
  if (!query) return null;

  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) return null;

  return trimmedQuery;
}

export async function fetchReposts(
  query: string | null,
  page: number = 1,
  pageSize: number = 10,
  sites: string[] = []
) {
  const supabase = await createSupabaseServerClient();

  let supabaseQuery = supabase.from('repost_data').select('*', { count: 'exact' });

  const searchTerm = buildSearchQuery(query);
  if (searchTerm) {
    supabaseQuery = supabaseQuery.filter('title', 'ilike', `%${searchTerm}%`);
  }

  if (sites.length > 0) {
    supabaseQuery = supabaseQuery.in('site', sites);
  }

  const { data, error, count } = await supabaseQuery
    .order('batch', { ascending: false })
    .order('order', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error('Error fetching reposts:', error);
    throw new Error('Failed to fetch reposts');
  }

  return { data: data as RepostType[], totalCount: count };
}

export async function fetchBestReposts(
  query: string | null,
  page: number = 1,
  pageSize: number = 10
) {
  const supabase = await createSupabaseServerClient();

  let supabaseQuery = supabase.from('repost_best_data').select('*', { count: 'exact' });

  const searchTerm = buildSearchQuery(query);
  if (searchTerm) {
    supabaseQuery = supabaseQuery.filter('title', 'ilike', `%${searchTerm}%`);
  }

  const { data, error, count } = await supabaseQuery
    .order('batch', { ascending: false })
    .order('order', { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.error('Error fetching best reposts:', error);
    throw new Error('Failed to fetch best reposts');
  }

  return { data: data as RepostType[], totalCount: count };
}
