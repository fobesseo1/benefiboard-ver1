import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import {
  addUserClickPoints,
  addUserPoints,
  addWritingClickPoints,
} from '../_action/adPointSupabase';
import { PointAnimation } from './PointAnimation';
import PointAnimationClick from './PointAnimationClick';
import { AdContentCard } from './AdContent';
import { useDrag } from '@/hooks/useDrag';

const AD_URL = 'https://www.google.com';

export default function AdAlert({
  userId,
  postId,
  initialRoundData,
  author_id,
  initialPoints,
}: {
  userId: string | null;
  postId: string | null;
  initialRoundData: any;
  author_id: string | null;
  initialPoints: number;
}) {
  const [showAd, setShowAd] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [points, setPoints] = useState(initialPoints);
  const [adClickPoints, setAdClickPoints] = useState(0);
  const [showPointAnimationClick, setShowPointAnimationClick] = useState(false);
  const [animationPoints, setAnimationPoints] = useState(0);
  const animationExecutedRef = useRef(false);

  const handleAdClose = useCallback(() => {
    setShowAd(false);
  }, []);

  const { getTransformStyle, isDragging } = useDrag(handleAdClose);

  const handleAnimationEnd = useCallback((newPoints: number) => {
    if (animationExecutedRef.current) return;
    animationExecutedRef.current = true;
    setAnimationPoints(newPoints);
  }, []);

  useEffect(() => {
    if (animationPoints > 0) {
      setPoints((prevPoints) => prevPoints + animationPoints);
      if (userId) {
        addUserPoints(userId, animationPoints);
      }
      if (animationPoints >= 3) {
        setShowAd(true);
      }
    }
  }, [animationPoints, userId]);

  const handleAdClick = useCallback(async () => {
    const readerClickPoints = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    setAdClickPoints(readerClickPoints);

    if (userId) {
      await addUserClickPoints(userId, readerClickPoints);
    }

    setShowPointAnimationClick(true);

    if (author_id) {
      const writerPoints = 500;
      await addWritingClickPoints(author_id);
    }

    setTimeout(() => {
      window.open(AD_URL, '_blank');
      setShowAd(false);
    }, 500);
  }, [userId, author_id]);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <>
      {showAnimation && (
        <PointAnimation
          userId={userId}
          initialRoundData={initialRoundData}
          initialPoints={initialPoints}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
      {showAd && (
        <>
          <div className="w-screen h-screen bg-black bg-opacity-75 z-80 relative" />
          <AlertDialog open={showAd} onOpenChange={handleAdClose}>
            <div
              className={`fixed inset-0 flex items-center justify-center z-50 ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative" style={{ transform: getTransformStyle() }}>
                <AdContentCard handleAdClick={handleAdClick} handleAdClose={handleAdClose} />
              </div>
            </div>
          </AlertDialog>
        </>
      )}
      {showPointAnimationClick && (
        <PointAnimationClick
          userId={userId}
          points={adClickPoints}
          onAnimationEnd={(clickPoints: number) =>
            setPoints((prevPoints) => prevPoints + clickPoints)
          }
        />
      )}
    </>
  );
}
