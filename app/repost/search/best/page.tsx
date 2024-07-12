// app/repost/search/best/page.tsx

import { getCurrentUser } from '@/lib/cookies';
import { CurrentUserType } from '@/app/page';
import SearchBar from '@/app/post/_component/SearchBar';
import Repost_list from '../../_component/repost_list';

export default async function BestRepostSearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  const query = searchParams.query;

  return (
    <div className="pt-4">
      <div className="flex flex-col px-6 pt-2 lg:w-[984px] mx-auto">
        <h1 className="text-2xl font-semibold">Best Repost Search Results</h1>
        <SearchBar initialQuery={query} searchUrl="/repost/search/best" />
        <Repost_list
          initialPosts={[]}
          currentUser={currentUser ?? null}
          isBestPosts={true}
          initialSearchTerm={query}
        />
      </div>
    </div>
  );
}
