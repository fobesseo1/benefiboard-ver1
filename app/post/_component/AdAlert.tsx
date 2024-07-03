//app>post>_components>AdAlert.tsx
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
import { useDrag } from '@/hooks/useDrag';

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
  const [isDragging, setIsDragging] = useState(false);
  const [adClickPoints, setAdClickPoints] = useState(0);
  const [showPointAnimationClick, setShowPointAnimationClick] = useState(false);

  const handleAdClose = () => setShowAd(false);

  const handleAnimationEnd = useCallback(
    (points: number) => {
      console.log('handleAnimationEnd called with points:', points);
      if (points >= 3 && !animationExecuted) {
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
    const readerClickPoints = Math.floor(Math.random() * (600 - 300 + 1)) + 300; // 300~600 사이의 랜덤
    setAdClickPoints(readerClickPoints);

    if (userId) {
      await addUserClickPoints(userId, readerClickPoints);
    }

    setShowPointAnimationClick(true);

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

  const { getTransformStyle } = useDrag(handleAdClose);

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
          <div className="w-screen h-screen bg-black bg-opacity-75 z-80 relative" />
          <AlertDialog open={showAd} onOpenChange={handleAdClose}>
            <div
              className={`fixed top-1/2 left-1/2 bg-white z-80 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ transform: getTransformStyle() }}
            >
              {/* 광고내용 컨탠츠 */}
              <AdContentCard handleAdClick={handleAdClick} handleAdClose={handleAdClose} />
            </div>
          </AlertDialog>
          {/* 광고 클릭 포인트 애니메이션 */}
          {showPointAnimationClick && (
            <PointAnimationClick
              userId={userId}
              points={adClickPoints}
              onAnimationEnd={(points: number) => handleAnimationEnd(points)}
            />
          )}
        </>
      )}
    </>
  );
}
