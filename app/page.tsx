import { getCurrentUser } from '@/lib/cookies';
import createSupabaseServerClient from '@/lib/supabse/server';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { findCategoryNameById } from './post/_action/category';
import { OnboardingContainer } from './_components/OnboardingContainer';
import { PublicHomeView } from './_components/PublicHomeView';
import { fetchTop10Batches, fetchTop10BestBatches } from './repost/_actions/fetchRepostData';

export type CurrentUserType = {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_points: number;
};

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function Home() {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  console.log('currentUser main:', currentUser);
  const supabase = await createSupabaseServerClient();
  const now = dayjs().tz('Asia/Seoul');
  const sevenDayAgo = now.subtract(21, 'day').tz('Asia/Seoul').format();

  const result = await supabase
    .from('post')
    .select(
      'id, title, created_at, views, comments, author_id, author_name, author_email, author_avatar_url, parent_category_id, child_category_id, likes, dislikes'
    )
    .gt('created_at', sevenDayAgo)
    .order('views', { ascending: false })
    .limit(10);

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

  const { success: bestSuccess, data: bestReposts } = await fetchTop10BestBatches();
  const { success: basicSuccess, data: basicReposts } = await fetchTop10Batches();

  if (currentUser) {
    return (
      <div>
        <OnboardingContainer
          postsWithCategoryNames={postsWithCategoryNames}
          currentUser={currentUser}
          bestReposts={bestSuccess ? bestReposts : []}
          basicReposts={basicSuccess ? basicReposts : []}
        />
      </div>
    );
  } else {
    return (
      <div>
        <PublicHomeView
          postsWithCategoryNames={postsWithCategoryNames}
          bestReposts={bestSuccess ? bestReposts : []}
          basicReposts={basicSuccess ? basicReposts : []}
        />
      </div>
    );
  }
}
