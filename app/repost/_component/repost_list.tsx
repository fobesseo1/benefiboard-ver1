'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { listformatDate } from '@/lib/utils/formDate';
import RepostPopup from './RepostPopup';
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import classNames from 'classnames';
import { fetchReposts, fetchBestReposts } from '../_actions/repostActions';
import SiteFilter, { siteColors } from './SiteFilter';
import { addDonationPoints } from '@/app/post/_action/adPointSupabase';
import { CurrentUserType } from '@/types/types';

export type RepostType = {
  id: number;
  link: string;
  title: string;
  site: string;
  created_at: string;
  batch: number;
  order: number;
};

type RepostDataProps = {
  initialPosts: RepostType[];
  currentUser: CurrentUserType | null;
  isBestPosts?: boolean;
  initialSearchTerm?: string;
  searchTerm?: string;
};

export default function Repost_list({
  initialPosts,
  currentUser,
  isBestPosts = false,
  initialSearchTerm = '',
  searchTerm: propSearchTerm = '',
}: RepostDataProps) {
  const [posts, setPosts] = useState<RepostType[]>(initialPosts);
  const [allPosts, setAllPosts] = useState<RepostType[]>(initialPosts);
  const [currentUserState, setCurrentUserState] = useState<CurrentUserType | null>(currentUser);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [readPosts, setReadPosts] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RepostType | null>(null);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = currentUser?.id;

  const urlSearchTerm = useSearchParams().get('query');
  const effectiveSearchTerm = propSearchTerm || urlSearchTerm || initialSearchTerm;

  useEffect(() => {
    setPosts(initialPosts);
    setAllPosts(initialPosts);
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

  useEffect(() => {
    const fetchInitialPosts = async () => {
      setLoading(true);
      try {
        const { data: newPosts, totalCount } = isBestPosts
          ? await fetchBestReposts(effectiveSearchTerm, 1)
          : await fetchReposts(effectiveSearchTerm, 1);

        setAllPosts(newPosts);
        setPosts(newPosts);
        setPage(2);
        setHasMore(newPosts.length < (totalCount ?? 0));
      } catch (error) {
        console.error('Error fetching initial posts:', error);
        setAllPosts([]);
        setPosts([]);
        setHasMore(false);
      }
      setLoading(false);
    };

    fetchInitialPosts();
  }, [effectiveSearchTerm, isBestPosts]);

  const fetchMorePosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data: newPosts, totalCount } = isBestPosts
        ? await fetchBestReposts(effectiveSearchTerm, page)
        : await fetchReposts(effectiveSearchTerm, page);

      if (newPosts.length > 0) {
        const uniquePosts = Array.from(
          new Set([...allPosts, ...newPosts].map((post) => JSON.stringify(post)))
        ).map((post) => JSON.parse(post));
        setAllPosts(uniquePosts);
        setPage((prev) => prev + 1);
        setHasMore(uniquePosts.length < (totalCount ?? 0));

        // 필터링된 포스트 업데이트
        updateFilteredPosts(uniquePosts, selectedSites);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
      setHasMore(false);
    }
    setLoading(false);
  };

  const updateFilteredPosts = (allPosts: RepostType[], sites: string[]) => {
    if (sites.length === 0) {
      setPosts(allPosts);
    } else {
      setPosts(allPosts.filter((post) => sites.includes(post.site)));
    }
  };

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && hasMore) {
      fetchMorePosts();
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

  const handlePostClick = async (post: RepostType) => {
    const readPostsKey = userId ? `readPosts_${userId}` : 'readPosts';
    const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');

    const updatedReadPosts = Array.from(new Set([...storedReadPosts, post.id.toString()]));

    setReadPosts(updatedReadPosts);
    localStorage.setItem(readPostsKey, JSON.stringify(updatedReadPosts));

    // 기부 포인트 추가 로직
    if (currentUserState && currentUserState.donation_id) {
      try {
        const donationResult = await addDonationPoints(
          currentUserState.id,
          currentUserState.donation_id,
          5 // 기부 포인트 금액, 필요에 따라 조정 가능
        );
        if (donationResult) {
          console.log(
            `Added 5 donation points from ${currentUserState.id} to ${currentUserState.donation_id}`
          );
        } else {
          console.error(
            `Failed to add donation points from ${currentUserState.id} to ${currentUserState.donation_id}`
          );
        }
      } catch (error) {
        console.error('Error adding donation points:', error);
      }
    }

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
    return siteColors[site] || 'gray';
  };

  const handleSiteToggle = (site: string) => {
    let newSelectedSites: string[];
    if (site === '전체') {
      newSelectedSites = [];
    } else {
      newSelectedSites = selectedSites.includes(site)
        ? selectedSites.filter((s) => s !== site)
        : [...selectedSites, site];
    }
    setSelectedSites(newSelectedSites);
    updateFilteredPosts(allPosts, newSelectedSites);
  };

  return (
    <div>
      <SiteFilter selectedSites={selectedSites} onSiteToggle={handleSiteToggle} />
      {posts.length ? (
        posts.map((post) => (
          <div key={`${post.id}-${post.site}`}>
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
