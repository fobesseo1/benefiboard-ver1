// app/repost/search/page.tsx

import { getCurrentUser } from '@/lib/cookies';
import Repost_list from '../_component/repost_list';
import SearchBar from '@/app/post/_component/SearchBar';
import { fetchLatestBatches } from '../_actions/fetchRepostData';
import { RepostType } from '../_component/repost_list';
import { CurrentUserType } from '@/types/types';

export default async function RepostSearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  const query = searchParams.query || '';

  // 검색 제안을 위한 데이터 가져오기
  const { success, data: repostData } = await fetchLatestBatches();
  const suggestions: RepostType[] = success && Array.isArray(repostData) ? repostData : [];
  const titleSuggestions = Array.from(new Set(suggestions.map((post) => post.title)));

  return (
    <div className="pt-4">
      <div className="flex flex-col px-6 pt-2 lg:w-[984px] mx-auto">
        <h1 className="text-2xl font-semibold">Repost Search Results</h1>
        <SearchBar initialQuery={query} searchUrl="/repost/search" suggestions={titleSuggestions} />
        <Repost_list
          initialPosts={[]}
          currentUser={currentUser ?? null}
          isBestPosts={false}
          initialSearchTerm={query}
        />
      </div>
    </div>
  );
}
