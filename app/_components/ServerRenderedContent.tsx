// app/_components/ServerRenderedContent.tsx
import { CurrentUserType, PostType } from '@/types/types';
import { RepostType } from '../repost/_component/repost_list';
import Link from 'next/link';
import Ad_Rectangle_Updown from './Ad-Rectangle_Updown';

interface ServerRenderedContentProps {
  postsWithCategoryNames: PostType[];
  currentUser: CurrentUserType | null;
  bestReposts: RepostType[];
  basicReposts: RepostType[];
}

export default function ServerRenderedContent({
  postsWithCategoryNames,
  currentUser,
  bestReposts,
  basicReposts,
}: ServerRenderedContentProps) {
  return (
    <div className="w-full flex flex-col items-center gap-4 lg:w-[948px] lg:mx-auto">
      <WelcomeBanner />
      {currentUser && <CurrentPoints points={currentUser.current_points} />}
      <hr className="mx-auto border-gray-200 w-full" />
      <StaticRepostSections bestReposts={bestReposts} basicReposts={basicReposts} />
      <hr className="mt-12 mb-4 mx-auto border-gray-200 w-full" />
      <StaticPopularPosts posts={postsWithCategoryNames} />
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

const StaticRepostSections = ({
  bestReposts,
  basicReposts,
}: {
  bestReposts: RepostType[];
  basicReposts: RepostType[];
}) => (
  <div className="w-full flex flex-col grid-cols-2 gap-12 lg:gap-8 lg:grid">
    <StaticRepostSection title="repost best 10" posts={bestReposts} linkPath="/repost/best" />
    <StaticRepostSection title="repost basic 10" posts={basicReposts} linkPath="/repost" />
  </div>
);

const StaticRepostSection = ({
  title,
  posts,
  linkPath,
}: {
  title: string;
  posts: RepostType[];
  linkPath: string;
}) => (
  <div className="w-full px-4 lg:w-[466px] lg:border border-gray-200 rounded-2xl">
    <h2 className="text-xl font-semibold lg:my-4 my-2">{title}</h2>
    <ul>
      {posts.map((post, index) => (
        <li key={post.id}>
          <Link href={`${linkPath}/${post.id}`}>
            {index + 1}. {post.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const StaticPopularPosts = ({ posts }: { posts: PostType[] }) => (
  <div className="w-full flex flex-col justify-center items-center">
    <h2 className="text-xl font-semibold lg:my-4 my-2">이번 주 인기 게시물</h2>
    <ul>
      {posts.slice(0, 5).map((post, index) => (
        <li key={post.id}>
          <Link href={`/post/${post.id}`}>
            {index + 1}. {post.title}
          </Link>
        </li>
      ))}
    </ul>
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
