'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SlBubble, SlEye, SlHeart } from 'react-icons/sl';
import { listformatDate } from '@/lib/utils/formDate';
import { fetchMorePosts, fetchSearchPosts } from '../_action/infinityScrollPost';
import { PostType } from '../types';
import { addWritingPoints } from '../_action/adPointSupabase';

type InfiniteScrollPostsProps = {
  initialPosts: PostType[];
  userId?: string | null;
  searchTerm?: string;
  categoryId?: string; // 카테고리 ID를 선택적으로 받음
};

export default function InfiniteScrollPosts({
  initialPosts,
  userId,
  searchTerm,
  categoryId, // 카테고리 ID를 선택적으로 받음
}: InfiniteScrollPostsProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [readPosts, setReadPosts] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  //console.log('post writerId', posts[0].author_id);

  useEffect(() => {
    const clearLocalStorageDaily = () => {
      const lastClear = localStorage.getItem('lastClear');
      const now = new Date().getTime();

      if (!lastClear || now - parseInt(lastClear) > 24 * 60 * 60 * 1000) {
        localStorage.setItem('lastClear', now.toString());
        localStorage.removeItem('roundsData');
        if (userId) {
          localStorage.removeItem(`readPosts_${userId}`);
        }
      }
    };

    clearLocalStorageDaily();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const readPostsKey = `readPosts_${userId}`;
      const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');
      setReadPosts(storedReadPosts);
    }
  }, [userId]);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleObserver = async (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && hasMore) {
      setLoading(true);
      const newPosts = searchTerm
        ? await fetchSearchPosts(searchTerm, page)
        : await fetchMorePosts(page, categoryId); // categoryId를 전달하여 필터링
      if (newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    });

    if (ref.current && hasMore) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [loading, hasMore]);

  const prefetchPostDetail = async (postId: string) => {
    const targetUrl = `/post/detail/${postId}`;
    router.prefetch(targetUrl);
  };

  const handlePostClick = async (postId: string) => {
    const post = posts.find((p) => p.id === postId); // 클릭한 포스트 찾기
    if (post) {
      await addWritingPoints(post.author_id, 5); // 포스트 작성자에게 5포인트 추가
    }

    const readPostsKey = `readPosts_${userId}`;
    const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');

    // 중복 항목 제거 및 새로운 포스트 ID 추가
    const updatedReadPosts = Array.from(new Set([...storedReadPosts, postId]));

    setReadPosts(updatedReadPosts);
    localStorage.setItem(readPostsKey, JSON.stringify(updatedReadPosts));

    // 페이지 이동 추가
    const detailUrl = `/post/detail/${postId}`;
    router.push(detailUrl);
  };

  const isPostRead = (postId: string) => {
    return readPosts.includes(postId);
  };

  return (
    <div>
      {posts.length ? (
        posts.map((post) => {
          const profileUrl = {
            pathname: `/profile/${post.author_id}`,
          };

          return (
            <div key={post.id}>
              {/* Default view */}
              <div
                className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 lg:hidden"
                onClick={() => prefetchPostDetail(post.id)}
              >
                {/* 카테고리와 작성시간 */}
                <div className="flex justify-between items-center">
                  <div className="categoryCreatorComments flex gap-2 flex-1 overflow-hidden items-center">
                    <div className="flex">
                      <p className="text-xs leading-tight tracking-tight text-gray-600">
                        {post.parent_category_name || '아무거나'} &gt;
                      </p>
                      <p className="text-xs leading-tight tracking-tight text-gray-600 ml-1">
                        {post.child_category_name || '프리토크'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {listformatDate(post.created_at) || 'No time'}
                  </p>
                </div>
                {/* 포스트 제목 */}
                <div
                  className="flex-1 pt-2 pb-2 cursor-pointer"
                  onClick={() => handlePostClick(post.id)}
                >
                  <p
                    className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
                      isPostRead(post.id) ? 'text-gray-400' : ''
                    }`}
                  >
                    {post.title}
                  </p>
                </div>
                {/* 작성자와 여러가지 */}
                <div className="flex gap-4 items-center overflow-hidden">
                  <Link href={profileUrl} className="overflow-hidden flex-1">
                    <p
                      className={`text-xs font-semibold leading-tight tracking-tight
                     truncate ${isPostRead(post.id) ? 'text-gray-400' : ''}`}
                    >
                      {post.author_name || post.author_email || 'unknown'}
                    </p>
                  </Link>
                  <div className="flex gap-1">
                    <div className="flex items-center gap-[2px]">
                      <SlHeart size={12} color="gray" />
                      <p className="text-xs leading-tight tracking-tight text-gray-600">
                        {post.views || '0'}
                      </p>
                    </div>
                    <div className="flex items-center gap-[2px]">
                      <SlEye size={14} color="gray" />
                      <p className="text-xs leading-tight tracking-tight text-gray-600">
                        {post.views || '0'}
                      </p>
                    </div>
                    <div className="flex items-center gap-[2px]">
                      <SlBubble size={12} color="gray" />
                      <p className="text-xs leading-tight tracking-tight text-gray-600">
                        {post.comments || '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* lg view */}
              <div
                className="hidden lg:flex w-[948px] mx-auto gap-4 items-center justify-between py-2 bg-white border-b-[1px] border-gray-200"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="flex items-center w-[140px]">
                  <div className="flex">
                    <p className="text-xs leading-tight tracking-tight text-gray-600">
                      {post.parent_category_name || '아무거나'} &gt;
                    </p>
                    <p className="text-xs leading-tight tracking-tight text-gray-600 ml-1">
                      {post.child_category_name || '프리토크'}
                    </p>
                  </div>
                </div>
                <div className="w-[540px] py-1 cursor-pointer">
                  <p
                    className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
                      isPostRead(post.id) ? 'text-gray-400' : ''
                    }`}
                  >
                    {post.title}
                  </p>
                </div>

                <Link href={profileUrl} className="overflow-hidden w-[120px]">
                  <p className="text-sm leading-tight tracking-tight text-gray-600 truncate">
                    {post.author_name || post.author_email || 'unknown'}
                  </p>
                </Link>
                <div className="flex gap-1 w-[100px]">
                  <div className="flex items-center gap-[2px]">
                    <SlHeart size={12} color="gray" />
                    <p className="text-xs leading-tight tracking-tight text-gray-600">
                      {post.views || '0'}
                    </p>
                  </div>
                  <div className="flex items-center gap-[2px]">
                    <SlEye size={14} color="gray" />
                    <p className="text-xs leading-tight tracking-tight text-gray-600">
                      {post.views || '0'}
                    </p>
                  </div>
                  <div className="flex items-center gap-[2px]">
                    <SlBubble size={12} color="gray" />
                    <p className="text-xs leading-tight tracking-tight text-gray-600">
                      {post.comments || '0'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 lg:block w-[48px]">
                  {listformatDate(post.created_at) || 'No time'}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="hover:text-red-200 text-blue-400">No posts</p>
      )}

      {loading && <p>Loading...</p>}
      <div ref={ref} />
    </div>
  );
}
