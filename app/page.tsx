// app/page.tsx

import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/cookies';
import { fetchPosts, fetchBestReposts, fetchBasicReposts } from './actions/mainPageActions';
import LoadingSpinner from './_components/LoadingSpinner';
import { PublicHomeView } from './_components/PublicHomeView';
import OnboardingLogicWrapper from './_components/OnboardingLogicWrapper';
import { revalidatePath } from 'next/cache';
import Loading from './loading';

export const revalidate = 3600; // 1시간마다 재생성

export default async function Home() {
  const currentUser = await getCurrentUser();
  let posts = await fetchPosts();
  let bestReposts = await fetchBestReposts();
  let basicReposts = await fetchBasicReposts();

  //console.log('currenUser MainPage', currentUser);

  // 모든 데이터가 비어있는지 확인
  if (!posts.length && !bestReposts.length && !basicReposts.length) {
    revalidatePath('/');
    posts = await fetchPosts();
    bestReposts = await fetchBestReposts();
    basicReposts = await fetchBasicReposts();
  }

  return (
    <>
      {/* <Loading /> */}
      <Suspense fallback={<LoadingSpinner />}>
        {currentUser ? (
          <OnboardingLogicWrapper
            postsWithCategoryNames={posts}
            currentUser={currentUser}
            bestReposts={bestReposts}
            basicReposts={basicReposts}
          />
        ) : (
          <PublicHomeView
            postsWithCategoryNames={posts}
            bestReposts={bestReposts}
            basicReposts={basicReposts}
            currentUser={currentUser}
          />
        )}
      </Suspense>
    </>
  );
}
