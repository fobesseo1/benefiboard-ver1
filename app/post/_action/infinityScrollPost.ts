'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { PostType } from '../types';
import { RepostType } from '@/app/repost/_component/repost_list';

export const fetchMorePosts = async (page: number, categoryId?: string) => {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from('post')
    .select('*')
    .order('created_at', { ascending: false })
    .range((page - 1) * 10, page * 10 - 1);

  if (categoryId) {
    query = query.eq('parent_category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data;
};

export async function fetchSearchPosts(searchTerm: string, page: number): Promise<PostType[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('post')
    .select('*')
    .ilike('title', `%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .range((page - 1) * 10, page * 10 - 1);

  if (error) {
    console.error('Error fetching search posts:', error);
    return [];
  }

  return data || [];
}

//리포스트리포스트 오더 순서대로

export const fetchMoreReposts = async (page: number): Promise<RepostType[]> => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('repost_data')
    .select('*')
    .order('batch', { ascending: false })
    .order('order', { ascending: true })
    .range((page - 1) * 10, page * 10 - 1);

  if (error) {
    console.error('Error fetching reposts:', error);
    return [];
  }

  return data as RepostType[]; // 수정된 부분
};

export async function fetchSearchReposts(
  searchTerm: string,
  page: number,
  siteFilter?: string
): Promise<RepostType[]> {
  const supabase = await createSupabaseServerClient();

  // 검색어를 공백으로 분리
  const searchTerms = searchTerm.split(' ').filter((term) => term.length > 0);

  let query = supabase.from('repost_data').select('id, link, title, site, created_at');

  // 각 검색어에 대해 ILIKE 조건 적용
  searchTerms.forEach((term) => {
    query = query.ilike('title', `%${term}%`);
  });

  // 사이트 필터 적용 (옵션)
  if (siteFilter) {
    query = query.eq('site', siteFilter);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * 10, page * 10 - 1);

  if (error) {
    console.error('Error fetching search posts:', error);
    return [];
  }

  return data as RepostType[];
}

// Fetch more reposts from repost_best_data table
export const fetchMoreBestReposts = async (page: number): Promise<RepostType[]> => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('repost_best_data')
    .select('*')
    .order('batch', { ascending: false })
    .order('order', { ascending: true })
    .range((page - 1) * 10, page * 10 - 1);

  if (error) {
    console.error('Error fetching reposts:', error);
    return [];
  }

  return data as RepostType[]; // 수정된 부분
};

export async function fetchSearchBestReposts(
  searchTerm: string,
  page: number
): Promise<RepostType[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('repost_best_data')
    .select('*')
    .ilike('title', `%${searchTerm}%`)
    .order('order', { ascending: true })
    .range((page - 1) * 10, page * 10 - 1);

  if (error) {
    console.error('Error fetching search posts:', error);
    return [];
  }

  return data as RepostType[]; // 수정된 부분
}
