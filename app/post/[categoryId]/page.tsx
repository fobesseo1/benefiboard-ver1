//app>post>[catergoryId]\page.tsx
import { getCurrentUserInfo } from '@/lib/cookies';
import createSupabaseServerClient from '@/lib/supabse/server';
import { calculatePoints } from '../_action/adPoint';
import { findCategoryNameById } from '../_action/category';
import SearchBar from '../_component/SearchBar';
import InfiniteScrollPosts from '../_component/InfiniteScrollPosts';
import FixedIconGroup from '../_component/FixedIconGroup';

export default async function PostListPageByCategory({
  params,
}: {
  params: { categoryId: string };
}) {
  const { categoryId } = params;

  const supabase = await createSupabaseServerClient();
  const { data: posts, error } = await supabase
    .from('post')
    .select('*')
    .eq('parent_category_id', categoryId) // 카테고리 ID로 필터링
    .order('created_at', { ascending: false })
    .limit(10);

  const currentUser = getCurrentUserInfo();

  const postsData = posts || [];

  const initialPosts = await Promise.all(
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

  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

  // Fetching the round data
  let roundData;
  if (currentUser) {
    const { data, error: roundError } = await supabase
      .from('user_rounds')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (roundError) {
      console.log('Error fetching user round data:', roundError.message);
    } else {
      roundData = data;
    }
  } else {
    // 로그인하지 않은 사용자의 경우 임시 라운드 데이터를 생성
    roundData = {
      round_points: calculatePoints(),
      current_round_index: 0,
    };
  }

  // console.log('categoryInitial', initialPosts);
  // console.log('Category ID:', categoryId); // 카테고리 ID 로그 출력

  return (
    <div className="pt-4">
      <SearchBar />

      <div className="flex flex-col px-4 pt-4 ">
        <InfiniteScrollPosts
          initialPosts={initialPosts}
          userId={currentUser?.id ?? null}
          categoryId={categoryId} // 카테고리 ID 전달
        />
      </div>
      <FixedIconGroup />
    </div>
  );
}
