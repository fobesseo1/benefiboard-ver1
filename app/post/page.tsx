// app/post/page.tsx

import createSupabaseServerClient from '@/lib/supabse/server';
import SearchBar from './_component/SearchBar';
import { getCurrentUser } from '@/lib/cookies';
import FixedIconGroup from './_component/FixedIconGroup';
import { findCategoryNameById } from './_action/category';
import InfiniteScrollPosts from './_component/InfiniteScrollPosts';
import { CurrentUserType } from '../page';

export default async function PostPage() {
  const supabase = await createSupabaseServerClient();
  const result = await supabase
    .from('post')
    .select(
      `
    id, title, created_at, views, comments, author_id, author_name, author_email, author_avatar_url, 
    parent_category_id, child_category_id
  `
    )
    .order('created_at', { ascending: false })
    .limit(10);

  const postsData = result.data || [];
  console.log('result: postPage', result);

  const initialPosts = postsData.map((post) => {
    return {
      ...post,
      parent_category_name: findCategoryNameById(post.parent_category_id),
      child_category_name: findCategoryNameById(post.child_category_id),
    };
  });

  const currentUser: CurrentUserType | null = await getCurrentUser();

  return (
    <div className="pt-4">
      <SearchBar searchUrl="/post/search" />
      {/* <PopularitySwitchClient initialPosts={initialPosts} userId={currentUser?.id ?? null} /> */}
      <div className="flex flex-col px-4 pt-4 ">
        <InfiniteScrollPosts initialPosts={initialPosts} userId={currentUser?.id ?? null} />
      </div>
      <FixedIconGroup />
    </div>
  );
}
