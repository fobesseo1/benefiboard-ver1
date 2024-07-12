//app>post.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import LoadingSpinner from './_components/LoadingSpinner';
import { PublicHomeView } from './_components/PublicHomeView';
import OnboardingContainer from './_components/OnboardingContainer';
import { revalidatePath } from 'next/cache';

export type CurrentUserType = {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_points: number;
};

export const revalidate = 3600; // 1시간마다 재생성

export default async function Home() {
  const currentUser = await getCurrentUser();
  let posts = await fetchPosts();
  let bestReposts = await fetchBestReposts();
  let basicReposts = await fetchBasicReposts();

  // 모든 데이터가 비어있는지 확인
  if (!posts.length && !bestReposts.length && !basicReposts.length) {
    // 모든 데이터가 비어있으면 페이지를 새로고침
    revalidatePath('/');
    // 새로고침 후에도 데이터를 표시해야 하므로, 다시 한 번 데이터를 가져옵니다.
    posts = await fetchPosts();
    bestReposts = await fetchBestReposts();
    basicReposts = await fetchBasicReposts();
  }

  if (currentUser) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <OnboardingContainer
          postsWithCategoryNames={posts}
          currentUser={currentUser}
          bestReposts={bestReposts}
          basicReposts={basicReposts}
        />
      </Suspense>
    );
  } else {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <PublicHomeView
          postsWithCategoryNames={posts}
          bestReposts={bestReposts}
          basicReposts={basicReposts}
        />
      </Suspense>
    );
  }
}

/* export type CurrentUserType = {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_points: number;
};

export default function Home() {
  return <div>Hello, World!</div>;
} */
