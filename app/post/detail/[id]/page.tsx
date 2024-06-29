import { getCurrentUserInfo } from '@/lib/cookies';
import { Suspense, lazy } from 'react';
import Breadcrumbs from '../../_component/Breadcrumbs';
import createSupabaseServerClient from '@/lib/supabse/server';
import AdAlert from '../../_component/AdAlert';
import { calculatePoints } from '../../_action/adPoint';
import AdFixedPage from '@/app/_components/Ad_Bottom';

// 동적 로드할 컴포넌트
const PostHeader = lazy(() => import('../../_component/PostHeader'));
const PostContent = lazy(() => import('../../_component/PostContent'));
const ExternalLinks = lazy(() => import('../../_component/ExternalLinksComponent'));
const ClientPostDetail = lazy(() => import('../../_component/ClientPostDetail'));

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const pagePath = 'post/detail';
  const { id } = params;

  const supabase = await createSupabaseServerClient();
  const { data: post, error } = await supabase.from('post').select('*').eq('id', id).single();
  const currentUser = getCurrentUserInfo();
  console.log('currentUser[id]', currentUser);

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

  const animationExecuted =
    typeof window !== 'undefined' && localStorage.getItem(`post_${id}_animation_executed`);

  return (
    <div className="relative mx-4 lg:w-[948px] lg:mx-auto">
      <Breadcrumbs category={post?.category} />
      <Suspense fallback={<div>Loading Post Header...</div>}>
        <PostHeader
          title={post?.title}
          author_name={post?.author_name}
          author_email={post?.author_email}
          author_avatar_url={post?.author_avatar_url}
          author_id={post?.author_id}
          author={post?.author}
          views={post?.views}
          comments={post?.comments}
          created_at={post?.created_at}
          point={currentUser?.point ?? 0}
        />
      </Suspense>
      <AdFixedPage />
      {post?.images ? (
        <div className="flex flex-col gap-4">
          {post.images.map((image: string, index: number) => (
            <img key={index} src={image} alt={`Post Image ${index + 1}`} />
          ))}
        </div>
      ) : null}
      <Suspense fallback={<div>Loading Post Content...</div>}>
        <PostContent content={post?.content} contentType={post?.content_type} />
      </Suspense>
      <Suspense fallback={<div>Loading External Links...</div>}>
        <ExternalLinks linkUrl1={post?.linkUrl1} linkUrl2={post?.linkUrl2} />
      </Suspense>
      <Suspense fallback={<div>Loading Post Details...</div>}>
        <ClientPostDetail
          postId={id}
          initialUser={
            currentUser ? { ...currentUser, current_points: currentUser.point ?? 0 } : null
          }
          initialPost={post}
        />
      </Suspense>
      {/* AdAlert 컴포넌트를 추가 */}
      {roundData && !animationExecuted && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <AdAlert
            userId={currentUser?.id ?? null}
            postId={id}
            initialRoundData={roundData}
            author_id={post?.author_id}
            pagePath={pagePath}
          />
        </div>
      )}
    </div>
  );
}
