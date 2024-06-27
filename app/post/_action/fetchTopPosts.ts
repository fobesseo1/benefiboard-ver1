// app/post/_action/fetchTopPosts.ts

import createSupabaseServerClient from '@/lib/supabse/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { findCategoryNameById } from './category';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function fetchTopPosts() {
  const supabase = await createSupabaseServerClient();

  // Calculate the date 7 days ago from now
  const now = dayjs().tz('Asia/Seoul');
  const sevenDaysAgo = now.subtract(7, 'day').tz('Asia/Seoul').format();

  // Fetch posts created in the last 7 days, sorted by views in descending order
  const { data, error } = await supabase
    .from('post')
    .select(
      `
      id, title, created_at, views, comments, author_id, author_name, author_email, author_avatar_url, 
      parent_category_id, child_category_id
    `
    )
    .gt('created_at', sevenDaysAgo)
    .order('views', { ascending: false });

  if (error) {
    console.error('Error fetching top posts:', error);
    return [];
  }

  // Fetch category names for each post
  const postsWithCategoryNames = await Promise.all(
    data.map(async (post) => {
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
