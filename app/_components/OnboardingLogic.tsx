// app/_components/OnboardingLogic.tsx
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Onboarding from './Onboarding';
import TopPosts from './TopPosts';
import Link from 'next/link';
import { useOnboarding } from '../_context/OnboardingContext';
import { RepostType } from '../repost/_component/repost_list';
import Repost_list_mainpage from '../repost/_component/repost_list_mainpage';
import Ad_Rectangle_Updown from './Ad-Rectangle_Updown';
import { CurrentUserType, PostType } from '@/types/types';

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

  const checkOnboardingStatus = useCallback(() => {
    const onboardingCompleteTime = localStorage.getItem('onboardingCompleteTime');
    if (onboardingCompleteTime) {
      const timeElapsed = Date.now() - parseInt(onboardingCompleteTime, 10);
      if (timeElapsed < 21600000) {
        // 6시간 = 21,600,000 밀리초
        setOnboardingComplete(true);
        setIsOnboarding(false);
      }
    }
    setLoading(false);
  }, [setIsOnboarding]);

  useEffect(() => {
    setIsOnboarding(true);
    checkOnboardingStatus();
  }, [setIsOnboarding, checkOnboardingStatus]);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('onboardingCompleteTime', Date.now().toString());
    setOnboardingComplete(true);
    setIsOnboarding(false);
  }, [setIsOnboarding]);

  const repostSections = useMemo(
    () => (
      <div className="w-full flex flex-col grid-cols-2 gap-12 lg:gap-8 lg:grid">
        <RepostSection
          title="repost best 10"
          posts={bestReposts}
          currentUser={currentUser}
          linkPath="/repost/best"
        />
        <RepostSection
          title="repost basic 10"
          posts={basicReposts}
          currentUser={currentUser}
          linkPath="/repost"
        />
      </div>
    ),
    [bestReposts, basicReposts, currentUser]
  );

  if (loading) {
    return null;
  }

  if (!onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 lg:w-[948px] lg:mx-auto">
      <WelcomeBanner />
      {currentUser && <CurrentPoints points={currentUser.current_points} />}
      <hr className="mx-auto border-gray-200 w-full" />
      {repostSections}
      <hr className="mt-12 mb-4 mx-auto border-gray-200 w-full" />
      <PopularPosts posts={postsWithCategoryNames} currentUser={currentUser} />
      <hr className="my-4 mx-auto border-gray-200 w-full" />
      <CommunityHighlight />
      <hr className="my-4 mx-auto border-gray-200 w-full" />
      <Ad_Rectangle_Updown />
    </div>
  );
}

// 하위 컴포넌트들
const WelcomeBanner = () => (
  <div className="w-[calc(100%-32px)] mt-4 flex flex-col justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-xl text-white lg:w-full]">
    <h1 className="text-xl font-semibold lg:text-2xl">베네피보드에 오신 것을 환영합니다</h1>
    <p className="tracking-tighter text-sm lg:text-lg">
      ♡ 탐험하고, 소통하며, 다양한 보상을 받으세요 ♡
    </p>
  </div>
);

const CurrentPoints = ({ points }: { points: number }) => (
  <div className="w-full flex justify-end lg:hidden">
    <p className="font-semibold mr-4">현재 포인트: {points}</p>
  </div>
);

const RepostSection = ({
  title,
  posts,
  currentUser,
  linkPath,
}: {
  title: string;
  posts: RepostType[];
  currentUser: CurrentUserType | null;
  linkPath: string;
}) => (
  <div className="w-full px-4 lg:w-[466px] lg:border border-gray-200 rounded-2xl">
    <h2 className="text-xl font-semibold lg:my-4 my-2">{title}</h2>
    <Repost_list_mainpage initialPosts={posts} currentUser={currentUser} linkPath={linkPath} />
  </div>
);

const PopularPosts = ({
  posts,
  currentUser,
}: {
  posts: PostType[];
  currentUser: CurrentUserType | null;
}) => (
  <div className="w-full flex flex-col justify-center items-center">
    <h2 className="text-xl font-semibold lg:my-4 my-2">이번 주 인기 게시물</h2>
    <TopPosts posts={posts} userId={currentUser?.id ?? null} currentUser={currentUser} />
  </div>
);

const CommunityHighlight = () => (
  <div className="w-full flex flex-col justify-center items-center">
    <h2 className="text-xl font-bold lg:my-4 my-2">커뮤니티 하이라이트</h2>
    <Link href="/community-events">
      <div className="mx-auto w-80 h-24 flex flex-col relative border-[1px] border-blue-200 p-1 mt-4 rounded-xl">
        <img src="/communityEventsAd.jpg" alt="Community Events" />
      </div>
    </Link>
  </div>
);
