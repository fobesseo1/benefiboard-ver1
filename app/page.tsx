// app/page.tsx
import { getcurrentUserFromCookies } from '@/lib/cookies';
import createSupabaseServerClient from '@/lib/supabse/server';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { DolphinBasic } from './_items/dolphin_item';
import { findCategoryNameById } from './post/_action/category';
import TopPosts from './_components/Topposts';
import AdFixedPage from './_components/Ad_Bottom';
import Link from 'next/link';

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function Home() {
  const currentUser = getcurrentUserFromCookies();

  const supabase = await createSupabaseServerClient();

  // 7일 전 날짜 계산
  const now = dayjs().tz('Asia/Seoul');
  const sevenDayAgo = now.subtract(7, 'day').tz('Asia/Seoul').format(); // 변경된 부분
  console.log('oneDat', sevenDayAgo);

  const result = await supabase
    .from('post')
    .select(
      `
      id, title, created_at, views, comments, author_id, author_name, author_email, author_avatar_url, 
      parent_category_id, child_category_id
    `
    )
    .gt('created_at', sevenDayAgo) // 최근 1일 동안의 게시물
    .order('views', { ascending: false }) // 조회수 기준으로 정렬
    .limit(5); // 상위 5개 게시물만 가져옴

  const postsData = result.data || [];

  const postsWithCategoryNames = await Promise.all(
    postsData.map(async (post) => {
      const parentCategoryName = await findCategoryNameById(post.parent_category_id);
      const childCategoryName = await findCategoryNameById(post.child_category_id);

      return {
        ...post,
        parent_category_name: parentCategoryName,
        child_category_name: childCategoryName,
      };
    })
  );

  return (
    <div className="flex flex-col items-center ">
      <h2 className="text-xl font-bold mt-4">행운을 뽑아보자</h2>
      <Link href="/goodluck">
        <div className="mx-auto w-80 h-24 flex flex-col relative border-[1px] border-red-200 p-1 mt-4  rounded-xl">
          <img src="/lotteryAd.png" alt="" />
        </div>
      </Link>
      <h2 className="text-xl font-bold mt-4">이번주 인기 게시물</h2>
      <TopPosts posts={postsWithCategoryNames} userId={currentUser?.id ?? null} />
      <div className="blank_gap w-full h-8" />
      <AdFixedPage />
      <h2 className="text-xl font-bold mt-8 ">All Posts</h2>
      <DolphinBasic width={100} color="text-red-300" />
      <DolphinBasic width={100} color="text-blue-300" />
      <DolphinBasic width={100} color="text-violet-300" />
    </div>
  );
}
