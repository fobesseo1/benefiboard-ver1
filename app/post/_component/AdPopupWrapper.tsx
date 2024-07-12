'use client';

import React, { useState, useEffect } from 'react';
import InPageAdPopup from './InPageAdPopup';
import { CurrentUserType } from '@/app/page';

interface AdPopupWrapperProps {
  currentUser: CurrentUserType | null;
  postId: string;
  authorId: string;
}

export default function AdPopupWrapper({ currentUser, postId, authorId }: AdPopupWrapperProps) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 항상 팝업을 표시합니다.
    setShowPopup(true);
  }, [postId]); // postId가 변경될 때마다 (즉, 새 포스트를 볼 때마다) 실행됩니다.

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <InPageAdPopup
      currentUser={currentUser}
      postId={postId}
      authorId={authorId}
      onClose={handleClose}
    />
  );
}
