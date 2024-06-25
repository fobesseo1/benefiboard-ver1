'use client';

import { useEffect, useState, useCallback } from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog'; // shadcn alert 컴포넌트
import { addUserPoints } from '../_action/adPointSupabase';
import { PointAnimation } from './PointAnimation';
import { DolphinBasic } from '@/app/_items/dolphin_item';
import { BiMove } from 'react-icons/bi'; // 드래그 아이콘 추가

const SHOW_AD_FOR_READ_POSTS = true; // 설정 플래그 true이면 한번본 게시물도 광고 집행하면 포인트 재정립

export default function AdAlert({
  userId,
  postId,
  initialRoundData,
}: {
  userId: string | null;
  postId: string | null;
  initialRoundData: any;
}) {
  const [showAd, setShowAd] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationExecuted, setAnimationExecuted] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [mouseCurrentX, setMouseCurrentX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  useEffect(() => {
    console.log('useEffect called for postId:', postId);
    const animationExecuted = localStorage.getItem(`post_${postId}_animation_executed`);
    if (SHOW_AD_FOR_READ_POSTS || !animationExecuted) {
      setShowAnimation(true);
      setTimeout(() => {
        console.log('Setting animation executed in localStorage');
        localStorage.setItem(`post_${postId}_animation_executed`, 'true');
        setAnimationExecuted(true);
      }, 1500);
    }
  }, [postId]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const touchEndX = e.touches[0].clientX;
      setTouchCurrentX(touchEndX);

      if (Math.abs(touchStartX - touchEndX) > 100) {
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

      if (Math.abs(mouseStartX - mouseEndX) > 100) {
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
              className={`fixed top-1/2 left-1/2 p-4 w-80 h-80 bg-white z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ transform: getTransformStyle() }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">광고</h2>
                <BiMove size={24} className="text-gray-500" />
              </div>
              <p>이곳에 광고 내용을 넣으세요.</p>
              <DolphinBasic width={100} color="text-red-300" />
              <button onClick={() => (window.location.href = 'https://www.google.com')}>
                광고 클릭
              </button>
              <button onClick={handleAdClose}>닫기</button>
            </div>
          </AlertDialog>
        </>
      )}
    </>
  );
}
