// app/repost/page.tsx
import Repost_list, { RepostType } from './_component/repost_list';
import { getCurrentUser } from '@/lib/cookies';
import { CurrentUserType } from '../page';
import SearchBar from '../post/_component/SearchBar';
import { fetchLatestBatches } from './_actions/fetchRepostData';

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
        <Repost_list initialPosts={repostData} currentUser={currentUser ?? null} />
      </div>
    </div>
  );
}
