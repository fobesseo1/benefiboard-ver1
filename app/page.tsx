// app/page.tsx
import { getcurrentUserFromCookies } from '@/lib/cookies';
import createSupabaseServerClient from '@/lib/supabse/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { findCategoryNameById } from './post/_action/category';
import dynamic from 'next/dynamic';
import { OnboardingContainer } from './_components/OnboardingContainer';

// 클라이언트 컴포넌트를 동적으로 로드합니다.

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function Home() {
  const currentUser = getcurrentUserFromCookies();
  console.log('currentUser', currentUser);

  const supabase = await createSupabaseServerClient();

  // 7일 전 날짜 계산
  const now = dayjs().tz('Asia/Seoul');
  const sevenDayAgo = now.subtract(7, 'day').tz('Asia/Seoul').format();

  const result = await supabase
    .from('post')
    .select(
      `
      id, title, created_at, views, comments, author_id, author_name, author_email, author_avatar_url, 
      parent_category_id, child_category_id,likes,dislikes
    `
    )
    .gt('created_at', sevenDayAgo) // 최근 7일 동안의 게시물
    .order('views', { ascending: false }) // 조회수 기준으로 정렬
    .limit(10); // 상위 10개 게시물만 가져옴

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
    <div>
      <OnboardingContainer
        postsWithCategoryNames={postsWithCategoryNames}
        currentUser={currentUser}
      />
    </div>
  );
}
