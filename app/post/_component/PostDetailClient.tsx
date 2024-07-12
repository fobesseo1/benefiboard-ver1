'use client';

import { useState, useEffect } from 'react';

import { CurrentUserType } from '@/app/page';
import RepostPopup from '@/app/repost/_component/RepostPopup';

type PostType = {
  id: string;
  title: string;
  link?: string;
  site?: string;
  created_at: string;
};

interface PostDetailClientProps {
  post: PostType;
  currentUser: CurrentUserType | null;
}

export default function PostDetailClient({ post, currentUser }: PostDetailClientProps) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <RepostPopup
          post={{
            id: parseInt(post.id),
            link: post.link || '',
            title: post.title,
            site: post.site || '',
            created_at: post.created_at,
          }}
          currentUser={currentUser}
          onClose={closePopup}
          isPostDetailPage={true}
        />
      )}
    </>
  );
}
