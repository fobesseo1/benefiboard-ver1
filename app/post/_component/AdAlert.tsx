'use client';

import { useEffect, useState, useCallback } from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog'; // shadcn alert 컴포넌트
import {
  addUserClickPoints,
  addUserPoints,
  addWritingClickPoints,
} from '../_action/adPointSupabase';
import { PointAnimation } from './PointAnimation';
import { BiMove } from 'react-icons/bi'; // 드래그 아이콘 추가
import PointAnimationClick from './PointAnimationClick';
import { AdContentCard } from './AdContent';

const SHOW_AD_FOR_READ_POSTS = false; // 설정 플래그 true이면 한번본 게시물도 광고 집행하면 포인트 재정립
const AD_REPEAT_INTERVAL = 60 * 1000; // 광고 재실행 간격 (예: 1분)
const AD_URL = 'https://www.google.com'; // 광고 페이지

// 한국 시간으로 현재 시간을 계산하는 함수
const getKoreanTimeNow = () => {
  const now = new Date();
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
  const koreanTimeOffset = 9 * 60 * 60 * 1000; // 한국 시간대는 UTC+9
  return new Date(utcNow + koreanTimeOffset).getTime();
};

export default function AdAlert({
  userId,
  postId,
  initialRoundData,
  author_id,
  pagePath,
}: {
  userId: string | null;
  postId: string | null;
  initialRoundData: any;
  author_id: string | null;
  pagePath: string | null;
}) {
  const [showAd, setShowAd] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationExecuted, setAnimationExecuted] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [mouseCurrentX, setMouseCurrentX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [adClickPoints, setAdClickPoints] = useState(0);
  const [showPointAnimationClick, setShowPointAnimationClick] = useState(false);

  const handleAdClose = () => setShowAd(false);

  const handleAnimationEnd = useCallback(
    (points: number) => {
      console.log('handleAnimationEnd called with points:', points);
      if (points > 0 && !animationExecuted) {
        setShowAd(true);
        setAnimationExecuted(true);
        if (userId) {
          addUserPoints(userId, points);
          console.log('Adding points client:', points);
        }
      }
    },
    [animationExecuted, userId]
  );

  const handleAdClick = useCallback(async () => {
    if (userId) {
      const readerClickPoints = Math.floor(Math.random() * (600 - 300 + 1)) + 300; // 300~600 사이의 랜덤
      setAdClickPoints(readerClickPoints);
      await addUserClickPoints(userId, readerClickPoints);
      setShowPointAnimationClick(true);
    }
    if (author_id) {
      const writerPoints = 500; // 작성자에게 500 포인트 추가
      await addWritingClickPoints(author_id);
    }
    setTimeout(() => {
      window.open(AD_URL, '_blank'); // 새 창에서 링크 열기
      setShowAd(false); // 광고 닫기
    }, 500); // 0.5초 지연
  }, [userId, author_id]);

  useEffect(() => {
    console.log('useEffect called for postId:', postId);
    const lastAdTime = localStorage.getItem(`post_${postId}_animation_executed_time`);
    const now = getKoreanTimeNow();
    console.log('lastAdTime:', lastAdTime);
    console.log('now:', now);

    if (
      SHOW_AD_FOR_READ_POSTS ||
      !lastAdTime ||
      now - parseInt(lastAdTime, 10) > AD_REPEAT_INTERVAL
    ) {
      setShowAnimation(true);
      setTimeout(() => {
        console.log('Setting animation executed in localStorage');
        localStorage.setItem(`post_${postId}_animation_executed_time`, now.toString());
        setAnimationExecuted(true);
      }, 1500);
    }
  }, [postId, userId]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const touchEndX = e.touches[0].clientX;
      setTouchCurrentX(touchEndX);

      if (Math.abs(touchStartX - touchEndX) > 36) {
        handleAdClose();
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
    setTouchCurrentX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && mouseStartX !== null) {
      const mouseEndX = e.clientX;
      setMouseCurrentX(mouseEndX);

      if (Math.abs(mouseStartX - mouseEndX) > 36) {
        handleAdClose();
      }
    }
  };

  const handleMouseUp = () => {
    setMouseStartX(null);
    setMouseCurrentX(null);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setMouseStartX(null);
    setMouseCurrentX(null);
    setIsDragging(false);
  };

  const getTransformStyle = () => {
    let transformX = 0;

    if (touchStartX !== null && touchCurrentX !== null) {
      transformX = touchCurrentX - touchStartX;
    } else if (mouseStartX !== null && mouseCurrentX !== null) {
      transformX = mouseCurrentX - mouseStartX;
    }

    return `translate(-50%, -50%) translateX(${transformX}px)`;
  };

  return (
    <>
      {showAnimation && (
        <PointAnimation
          userId={userId}
          initialRoundData={initialRoundData}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
      {showAd && (
        <>
          <div className="w-screen h-screen bg-black bg-opacity-50 z-40 relative" />
          <AlertDialog open={showAd} onOpenChange={handleAdClose}>
            <div
              className={`fixed top-1/2 left-1/2 bg-white z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ transform: getTransformStyle() }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {/* 광고내용 컨탠츠 */}
              <AdContentCard
                handleAdClick={handleAdClick}
                handleAdClose={handleAdClose}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          </AlertDialog>
          {/* 광고 포인트 애니메이션 */}
          {showPointAnimationClick && (
            <PointAnimationClick
              points={adClickPoints}
              onAnimationEnd={(points: number) => handleAnimationEnd(points)}
            />
          )}
        </>
      )}
    </>
  );
}
