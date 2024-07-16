// app/post/search/page.tsx
import createSupabaseServerClient from '@/lib/supabse/server';
import SearchBar from '../_component/SearchBar';
import { getCurrentUser } from '@/lib/cookies';
import InfiniteScrollPosts from '../_component/InfiniteScrollPosts';
import FixedIconGroup from '../_component/FixedIconGroup';
import { CurrentUserType, PostType } from '../../../types/types';
import { getPostsData } from '../_action/postData';

export async function searchPosts(query: string): Promise<PostType[]> {
  const supabase = await createSupabaseServerClient();
  const result = await supabase
    .from('post')
    .select('*')
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  return result.data || [];
}

export default async function PostSearchPage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const query = searchParams.query || '';
  const initialPosts = await searchPosts(query);

  const currentUser: CurrentUserType | null = await getCurrentUser();
  // 검색 제안을 위한 데이터 가져오기
  const posts = await getPostsData();
  const suggestions: PostType[] = Array.isArray(posts) ? posts : [];
  const titleSuggestions = Array.from(
    new Set(
      suggestions.map((post) => post.title).filter((title): title is string => title !== undefined)
    )
  );

  return (
    <div className="pt-4">
      <SearchBar initialQuery={query} searchUrl="/post/search" suggestions={titleSuggestions} />
      <div className="grid grid-cols-1 h-12 lg:w-[948px] mx-auto">
        <div className="bg-white border-b-[1px] border-gray-400 flex justify-center items-center ">
          <p className="font-bold text-center">Search Results</p>
        </div>
      </div>
      <div className="flex flex-col px-4 pt-4 ">
        <InfiniteScrollPosts
          initialPosts={initialPosts}
          userId={currentUser?.id ?? null}
          currentUser={currentUser}
          searchTerm={query}
        />
      </div>
      <FixedIconGroup />
    </div>
  );
}
