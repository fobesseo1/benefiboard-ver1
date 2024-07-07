// repost/_actions/fetchRepostData.ts

import createSupabaseServerClient from '@/lib/supabse/server';
import { RepostType } from '../_component/repost_list_mainpage';

export async function fetchTop10BestBatches(): Promise<{ success: boolean; data: RepostType[] }> {
  const supabase = await createSupabaseServerClient();

  const { data: latestBatches, error: batchError } = await supabase
    .from('repost_best_data')
    .select('batch')
    .order('batch', { ascending: false })
    .limit(1);

  if (batchError) {
    console.error('Error fetching latest batches:', batchError);
    return { success: false, data: [] };
  }

  if (latestBatches.length === 0) {
    return { success: true, data: [] };
  }

  const batch = latestBatches[0].batch;

  const { data: posts, error: postsError } = await supabase
    .from('repost_best_data')
    .select('*')
    .eq('batch', batch)
    .order('order', { ascending: true })
    .limit(10);

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return { success: false, data: [] };
  }

  return { success: true, data: posts };
}

export async function fetchTop10Batches(): Promise<{ success: boolean; data: RepostType[] }> {
  const supabase = await createSupabaseServerClient();

  const { data: latestBatches, error: batchError } = await supabase
    .from('repost_data')
    .select('batch')
    .order('batch', { ascending: false })
    .limit(1);

  if (batchError) {
    console.error('Error fetching latest batches:', batchError);
    return { success: false, data: [] };
  }

  if (latestBatches.length === 0) {
    return { success: true, data: [] };
  }

  const batch = latestBatches[0].batch;

  const { data: posts, error: postsError } = await supabase
    .from('repost_data')
    .select('*')
    .eq('batch', batch)
    .order('order', { ascending: true })
    .limit(10);

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return { success: false, data: [] };
  }

  return { success: true, data: posts };
}
