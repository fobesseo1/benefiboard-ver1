// app/post/page.tsx

import createSupabaseServerClient from '@/lib/supabse/server';
import { CurrentUser, getCurrentUserInfo } from '@/lib/cookies';
import { fetchTopPosts } from '../_action/fetchTopPosts';
import SearchBar from '../_component/SearchBar';
import InfiniteScrollPosts from '../_component/InfiniteScrollPosts';
import FixedIconGroup from '../_component/FixedIconGroup';

export default async function PostPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch top posts in the last 7 days
  const topPosts = await fetchTopPosts();

  const currentUser: CurrentUser | null = getCurrentUserInfo();

  return (
    <div className="pt-4">
      <SearchBar />
      <div className="flex flex-col px-4 pt-4">
        <h2 className="text-xl font-bold my-4 mx-auto">이번주 인기 게시물</h2>
        <InfiniteScrollPosts initialPosts={topPosts} userId={currentUser?.id ?? null} />
      </div>
      <FixedIconGroup />
    </div>
  );
}
