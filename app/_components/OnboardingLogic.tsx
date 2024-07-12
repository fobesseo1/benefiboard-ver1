// app/_components/OnboardingLogic.tsx
'use client';

import { useEffect, useState } from 'react';
import Onboarding from './Onboarding';
import TopPosts from './Topposts';
import Link from 'next/link';
import AdFixedPage from './Ad_Bottom';
import { PostType } from '../post/types';
import { CurrentUserType } from '../page';
import { useOnboarding } from '../_context/OnboardingContext';
import { RepostType } from '../repost/_component/repost_list';
import Repost_list_mainpage from '../repost/_component/repost_list_mainpage';

interface OnboardingLogicProps {
  postsWithCategoryNames: PostType[];
  currentUser: CurrentUserType | null;
  bestReposts: RepostType[];
  basicReposts: RepostType[];
}

export default function OnboardingLogic({
  postsWithCategoryNames,
  currentUser,
  bestReposts,
  basicReposts,
}: OnboardingLogicProps) {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setIsOnboarding } = useOnboarding();

  useEffect(() => {
    // 온보딩 시작
    setIsOnboarding(true);

    // 로컬 스토리지에서 온보딩 완료 시간을 확인합니다.
    const onboardingCompleteTime = localStorage.getItem('onboardingCompleteTime');
    if (onboardingCompleteTime) {
      const timeElapsed = Date.now() - parseInt(onboardingCompleteTime, 10);
      if (timeElapsed < 21600000) {
        // 6시간 = 21,600,000 밀리초
        // 1분 = 60,000 밀리초
        setOnboardingComplete(true);
        setIsOnboarding(false);
      }
    }
    setLoading(false); // 로딩 상태를 해제합니다.
  }, [setIsOnboarding]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingCompleteTime', Date.now().toString());
    setOnboardingComplete(true);
    setIsOnboarding(false); // 온보딩 완료 시 상태 변경
  };

  if (loading) {
    return null; // 로딩 중일 때는 아무것도 렌더링하지 않습니다.
  }

  if (!onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!postsWithCategoryNames.length) {
    //window.location.reload();
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 lg:w-[948px] lg:mx-auto ">
      {/* 환영 배너 */}
      <div className="w-[calc(100%-32px)] mt-4 flex flex-col justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-xl text-white lg:w-full]">
        <h1 className="text-xl font-semibold lg:text-2xl">베네피보드에 오신 것을 환영합니다</h1>
        <p className="tracking-tighter text-sm lg:text-lg">
          ♡ 탐험하고, 소통하며, 다양한 보상을 받으세요 ♡
        </p>
      </div>

      {/* 현재 보유 포인트 */}
      {currentUser && (
        <div className="w-full flex justify-end lg:hidden">
          <p className="font-semibold mr-4 ">현재 포인트: {currentUser?.current_points}</p>
        </div>
      )}

      <hr className="mx-auto border-gray-200 w-full " />

      {/* Repost best & basic 10 */}
      <div className="w-full flex flex-col grid-cols-2 gap-12 lg:gap-8 lg:grid">
        <div className="w-full  px-4 lg:w-[466px] lg:border border-gray-200 rounded-2xl">
          <h2 className="text-xl font-semibold lg:my-4 my-2">repost best 10</h2>
          <Repost_list_mainpage
            initialPosts={bestReposts}
            currentUser={currentUser}
            linkPath="/repost/best"
          />
        </div>
        <div className="w-full px-4 lg:w-[466px] lg:border border-gray-200 rounded-2xl">
          <h2 className="text-xl font-semibold lg:my-4 my-2 basic-10">repost basic 10</h2>
          <Repost_list_mainpage
            initialPosts={basicReposts}
            currentUser={currentUser}
            linkPath="/repost"
          />
        </div>
      </div>

      <hr className="mt-12 mb-4 mx-auto border-gray-200 w-full" />

      {/* 추천 콘텐츠 */}
      <div className="w-full  flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold lg:my-4 my-2">이번 주 인기 게시물</h2>
        <TopPosts posts={postsWithCategoryNames} userId={currentUser?.id ?? null} />
      </div>

      <hr className="my-4 mx-auto border-gray-200 w-full" />

      {/* 커뮤니티 하이라이트 */}
      <div className="w-full flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold lg:my-4 my-2">커뮤니티 하이라이트</h2>
        <Link href="/community-events">
          <div className="mx-auto w-80 h-24 flex flex-col relative border-[1px] border-blue-200 p-1 mt-4 rounded-xl">
            <img src="/communityEventsAd.jpg" alt="Community Events" />
          </div>
        </Link>
      </div>

      <hr className="my-4 mx-auto border-gray-200 w-full" />
      {/* 광고배너 */}
      <div className="w-full">
        <AdFixedPage />
      </div>
    </div>
  );
}
