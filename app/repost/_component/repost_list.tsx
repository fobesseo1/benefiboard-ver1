//app>repost>_components>repost_list.tsx

'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { listformatDate } from '@/lib/utils/formDate';
import RepostPopup from './RepostPopup';
import { useRouter } from 'next/navigation';
import { CurrentUserType } from '@/app/page';
import { Badge } from '@/components/ui/badge';
import classNames from 'classnames'; // classNames 라이브러리 임포트

export type RepostType = {
  id: number;
  link: string;
  title: string;
  site: string;
  created_at: string;
};

type RepostDataProps = {
  initialPosts: RepostType[];
  currentUser: CurrentUserType | null;
  searchTerm?: string;
  fetchMoreReposts: (page: number) => Promise<RepostType[]>; // 수정된 부분
  fetchSearchReposts: (searchTerm: string, page: number) => Promise<RepostType[]>; // 추가된 부분
};

// 사이트와 색상 매핑 객체
const siteColors: { [key: string]: string } = {
  웃대: 'red',
  펨코: 'orange',
  인벤: 'amber',
  엠팍: 'green',
  루리: 'emerald',
  오유: 'teal',
  SLR: 'cyan',
  '82쿡': 'sky',
  클리앙: 'indigo',
  인티: 'violet',
  보배: 'purple',
  더쿠: 'fuchsia',
  디씨: 'stone',
  유머픽: 'lime',
  뽐뿌: 'rose',
};

export default function Repost_list({
  initialPosts,
  currentUser,
  fetchMoreReposts, // 수정된 부분
  fetchSearchReposts, // 추가된 부분
  searchTerm,
}: RepostDataProps) {
  const [posts, setPosts] = useState<RepostType[]>(initialPosts);
  const [currentUserState, setCurrentUserState] = useState<CurrentUserType | null>(currentUser);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [readPosts, setReadPosts] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RepostType | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userId = currentUser?.id;

  useEffect(() => {
    setPosts(initialPosts);
    setCurrentUserState(currentUser);
  }, [initialPosts, currentUser]);

  useEffect(() => {
    const clearLocalStorageDaily = () => {
      const lastClear = localStorage.getItem('lastClear');
      const now = new Date().getTime();

      if (!lastClear || now - parseInt(lastClear) > 24 * 60 * 60 * 1000) {
        localStorage.setItem('lastClear', now.toString());
        localStorage.removeItem('roundsData');
        localStorage.removeItem(`readPosts`);
        if (userId) {
          localStorage.removeItem(`readPosts_${userId}`);
        }
      }
    };

    clearLocalStorageDaily();
  }, [userId]);

  useEffect(() => {
    const readPostsKey = userId ? `readPosts_${userId}` : 'readPosts';
    const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');
    setReadPosts(storedReadPosts);
  }, [userId]);

  const handleObserver = async (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && hasMore) {
      setLoading(true);
      const newPosts = searchTerm
        ? await fetchSearchReposts(searchTerm, page)
        : await fetchMoreReposts(page); // 수정된 부분
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

  const handlePostClick = (post: RepostType) => {
    const readPostsKey = userId ? `readPosts_${userId}` : 'readPosts';
    const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');

    // 중복 항목 제거 및 새로운 포스트 ID 추가
    const updatedReadPosts = Array.from(new Set([...storedReadPosts, post.id.toString()]));

    setReadPosts(updatedReadPosts);
    localStorage.setItem(readPostsKey, JSON.stringify(updatedReadPosts));

    // 페이지 이동 추가
    setSelectedPost(post);
    setShowPopup(true);
  };

  const isPostRead = (postId: string) => {
    return readPosts.includes(postId);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPost(null);
  };

  const getBadgeColor = (site: string) => {
    return siteColors[site] || 'gray'; // 사이트에 해당하는 색상을 찾거나 기본 색상인 gray를 반환
  };

  return (
    <div>
      {posts.length ? (
        posts.map((post) => (
          <div key={post.id}>
            <div className="flex flex-col py-2 bg-white border-b-[1px] border-gray-200 lg:w-[948px] mx-auto ">
              <div className="flex justify-between items-center">
                <div className="categoryCreatorComments flex gap-2 flex-1 overflow-hidden items-center">
                  <div className="flex items-center">
                    <Badge className={classNames(`bg-${getBadgeColor(post.site)}-500`)}>
                      {post.site || '아무거나'}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  {listformatDate(post.created_at) || 'No time'}
                </p>
              </div>
              <div
                className="flex-1 pt-2 pb-2 cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <p
                  className={`font-semibold line-clamp-1 leading-tight tracking-tighter ${
                    isPostRead(post.id.toString()) ? 'text-gray-400' : ''
                  }`}
                >
                  {post.title}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="hover:text-red-200 text-blue-400">No posts</p>
      )}
      {loading && <p>Loading...</p>}
      <div ref={ref} />
      {showPopup && selectedPost && (
        <RepostPopup post={selectedPost} currentUser={currentUserState} onClose={closePopup} />
      )}
    </div>
  );
}
