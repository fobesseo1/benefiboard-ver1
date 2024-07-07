//app>post>detaail>[id]>page.tsx

import { getCurrentUser } from '@/lib/cookies';
import { Suspense, lazy } from 'react';
import Breadcrumbs from '../../_component/Breadcrumbs';
import createSupabaseServerClient from '@/lib/supabse/server';
import AdAlert from '../../_component/AdAlert';
import { calculatePoints } from '../../_action/adPoint';
import AdFixedPage from '@/app/_components/Ad_Bottom';
import Ad_Handler from '@/app/_components/Ad_Handler';
import { CurrentUserType } from '@/app/page';

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
  const currentUser: CurrentUserType | null = await getCurrentUser();

  //console.log('currentUser[id]', currentUser);
  //console.log('postDetail', post);

  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

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
          point={currentUser?.current_points ?? 0}
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
            currentUser ? { ...currentUser, current_points: currentUser.current_points ?? 0 } : null
          }
          initialPost={post}
        />
      </Suspense>
      {/* Ad 추가 */}
      <Ad_Handler
        currentUser={currentUser}
        postId={id}
        authorId={post?.author_id}
        pagePath={pagePath}
      />
    </div>
  );
}
