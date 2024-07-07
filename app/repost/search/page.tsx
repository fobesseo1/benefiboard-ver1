//app>repost>search>page.tsx

import createSupabaseServerClient from '@/lib/supabse/server';
import { getCurrentUser } from '@/lib/cookies';
import { CurrentUserType } from '@/app/page';
import Repost_list, { RepostType } from '../_component/repost_list';
import SearchBar from '@/app/post/_component/SearchBar';
import { fetchMoreReposts, fetchSearchReposts } from '@/app/post/_action/infinityScrollPost';

export async function searchRePost(query: string): Promise<RepostType[]> {
  const supabase = await createSupabaseServerClient();
  const result = await supabase
    .from('repost_data')
    .select('*')
    .ilike('title', `%${query}%`)
    .order('order', { ascending: false })
    .limit(10);

  return result.data || [];
}

export default async function RepostSearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const query = searchParams.query || '';
  const initialPosts = await searchRePost(query);

  const currentUser: CurrentUserType | null = await getCurrentUser();

  return (
    <div className="pt-4">
      <SearchBar initialQuery={query} searchUrl="/repost/search" />
      <div className="grid grid-cols-1 h-12 lg:w-[948px] mx-auto">
        <div className="bg-white border-b-[1px] border-gray-400 flex justify-center items-center ">
          <p className="font-bold text-center">Search Results</p>
        </div>
      </div>
      <div className="flex flex-col px-4 pt-4 ">
        <Repost_list
          initialPosts={initialPosts}
          currentUser={currentUser ?? null}
          fetchMoreReposts={fetchMoreReposts} // 수정된 부분
          fetchSearchReposts={fetchSearchReposts} // 추가된 부분
          searchTerm={query}
        />
      </div>
    </div>
  );
}
