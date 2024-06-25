'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { PostType } from '../types';

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
