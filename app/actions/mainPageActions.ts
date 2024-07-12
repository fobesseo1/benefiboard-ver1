// app/actions/mainPageActions.ts
import createSupabaseServerClient from '@/lib/supabse/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { findCategoryNameById } from '../post/_action/category';
import { fetchTop10Batches, fetchTop10BestBatches } from '../repost/_actions/fetchRepostData';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function fetchPosts() {
  const supabase = await createSupabaseServerClient();
  const now = dayjs().tz('Asia/Seoul');
  const sevenDayAgo = now.subtract(21, 'day').tz('Asia/Seoul').format();

  const result = await supabase
    .from('post')
    .select(
      'id, title, created_at, views, comments, author_id, author_name, author_email, author_avatar_url, parent_category_id, child_category_id, likes, dislikes'
    )
    .gt('created_at', sevenDayAgo)
    .order('views', { ascending: false })
    .limit(10);

  const postsData = result.data || [];

  const postsWithCategoryNames = await Promise.all(
    postsData.map(async (post) => {
      const parentCategoryName = await findCategoryNameById(post.parent_category_id);
      const childCategoryName = await findCategoryNameById(post.child_category_id);

      return {
        ...post,
        parent_category_name: parentCategoryName,
        child_category_name: childCategoryName,
      };
    })
  );

  return postsWithCategoryNames;
}

export async function fetchBestReposts() {
  const { success, data } = await fetchTop10BestBatches();
  return success ? data : [];
}

export async function fetchBasicReposts() {
  const { success, data } = await fetchTop10Batches();
  return success ? data : [];
}
