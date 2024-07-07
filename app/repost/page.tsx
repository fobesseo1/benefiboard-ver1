//app>repost>page.tsx

import createSupabaseServerClient from '@/lib/supabse/server';
import Repost_list from './_component/repost_list';
import { getCurrentUser } from '@/lib/cookies';
import { fetchMoreReposts, fetchSearchReposts } from '@/app/post/_action/infinityScrollPost';
import { CurrentUserType } from '../page';
import SearchBar from '../post/_component/SearchBar';

export async function fetchLatestBatches(limit = 3) {
  const supabase = await createSupabaseServerClient();

  // 최신 회차를 가져오기
  const { data: latestBatches, error: batchError } = await supabase
    .from('repost_data')
    .select('batch')
    .order('batch', { ascending: false })
    .limit(limit);

  if (batchError) {
    console.error('Error fetching latest batches:', batchError);
    return { success: false, error: batchError };
  }

  if (latestBatches.length === 0) {
    return { success: true, data: [] };
  }

  const batches = latestBatches.map((batch) => batch.batch);

  // 최신 회차의 데이터 가져오기
  const { data: posts, error: postsError } = await supabase
    .from('repost_data')
    .select('*')
    .in('batch', batches)
    .order('batch', { ascending: false })
    .order('order', { ascending: true });

  if (postsError) {
    console.error('Error fetching posts:', postsError);
    return { success: false, error: postsError };
  }

  return { success: true, data: posts };
}

export default async function RepostPage() {
  const { success, data: repostData, error } = await fetchLatestBatches();

  if (!success || !repostData) {
    console.error('Failed to fetch data:', error);
    return <div>Loading...</div>;
  }

  if (repostData.length === 0) {
    return <div>No posts available</div>;
  }

  const currentUser: CurrentUserType | null = await getCurrentUser();

  return (
    <div className="pt-4">
      <div className="flex flex-col px-6 pt-2 lg:w-[984px] mx-auto">
        <h1 className="text-2xl font-semibold">Repost</h1>
        <SearchBar searchUrl="/repost/search" />
        <Repost_list
          initialPosts={repostData}
          currentUser={currentUser ?? null}
          fetchMoreReposts={fetchMoreReposts} // 수정된 부분
          fetchSearchReposts={fetchSearchReposts} // 추가된 부분
        />
      </div>
    </div>
  );
}
