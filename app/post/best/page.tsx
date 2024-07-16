// app/post/best/page.tsx

import createSupabaseServerClient from '@/lib/supabse/server';
import { getCurrentUser } from '@/lib/cookies';
import { fetchTopPosts } from '../_action/fetchTopPosts';
import SearchBar from '../_component/SearchBar';
import InfiniteScrollPosts from '../_component/InfiniteScrollPosts';
import FixedIconGroup from '../_component/FixedIconGroup';
import { CurrentUserType } from '@/types/types';

export default async function PostBestPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch top posts in the last 7 days
  const topPosts = await fetchTopPosts();

  const currentUser: CurrentUserType | null = await getCurrentUser();
  // 검색 제안을 위해 제목 목록 생성
  const searchSuggestions = Array.from(new Set(topPosts.map((post) => post.title)));

  return (
    <div className="pt-4">
      <SearchBar searchUrl="/post/search" suggestions={searchSuggestions} />
      <div className="flex flex-col px-4 pt-4">
        <h2 className="text-xl font-bold my-4 mx-auto">이번주 인기 게시물</h2>
        <InfiniteScrollPosts
          initialPosts={topPosts}
          userId={currentUser?.id ?? null}
          currentUser={currentUser}
        />
      </div>
      <FixedIconGroup />
    </div>
  );
}
