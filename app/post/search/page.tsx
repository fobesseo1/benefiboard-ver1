// app/post/search/page.tsx
import createSupabaseServerClient from '@/lib/supabse/server';
import SearchBar from '../_component/SearchBar';
import { getCurrentUser } from '@/lib/cookies';
import InfiniteScrollPosts from '../_component/InfiniteScrollPosts';
import FixedIconGroup from '../_component/FixedIconGroup';
import { PostType } from '../types';
import { CurrentUserType } from '@/app/page';

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

  return (
    <div className="pt-4">
      <SearchBar initialQuery={query} searchUrl="/post/search" />
      <div className="grid grid-cols-1 h-12 lg:w-[948px] mx-auto">
        <div className="bg-white border-b-[1px] border-gray-400 flex justify-center items-center ">
          <p className="font-bold text-center">Search Results</p>
        </div>
      </div>
      <div className="flex flex-col px-4 pt-4 ">
        <InfiniteScrollPosts
          initialPosts={initialPosts}
          userId={currentUser?.id ?? null}
          searchTerm={query}
        />
      </div>
      <FixedIconGroup />
    </div>
  );
}
