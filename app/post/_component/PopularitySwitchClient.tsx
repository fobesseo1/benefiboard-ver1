'use client';

import { useState, useEffect } from 'react';
import InfiniteScrollPosts from './InfiniteScrollPosts';
import PopularitySwitch from './PopularitySwitch';
import { PostType } from '../types';

interface PopularitySwitchClientProps {
  initialPosts: PostType[];
  userId: string | null;
}

export default function PopularitySwitchClient({
  initialPosts,
  userId,
}: PopularitySwitchClientProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [orderBy, setOrderBy] = useState<'views' | 'created_at'>('created_at');

  useEffect(() => {
    const sortedPosts = [...initialPosts].sort((a, b) => {
      if (orderBy === 'views') {
        return (b.views || 0) - (a.views || 0);
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    setPosts(sortedPosts);
  }, [orderBy, initialPosts]);

  const handleSwitch = (orderBy: 'views' | 'created_at') => {
    setOrderBy(orderBy);
  };

  return (
    <>
      <PopularitySwitch onSwitch={handleSwitch} />
      <div className="flex flex-col px-4 pt-4 ">
        <InfiniteScrollPosts key={orderBy} initialPosts={posts} userId={userId} />
      </div>
    </>
  );
}
