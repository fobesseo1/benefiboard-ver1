// PointAnimation.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { calculatePoints } from '../_action/adPoint';
import { saveUserRoundData } from '../_action/adPointSupabase';
import AnimatedPointCounter from '@/app/_components/PointSlotAnimation';

interface PointAnimationProps {
  userId: string | null;
  initialRoundData: any;
  initialPoints: number;
  onAnimationEnd?: (points: number) => void;
}

export function PointAnimation({
  userId,
  initialRoundData,
  initialPoints,
  onAnimationEnd,
}: PointAnimationProps) {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [roundData, setRoundData] = useState(initialRoundData);
  const [totalPoints, setTotalPoints] = useState(initialPoints);
  const animationExecutedRef = useRef(false);

  const initializeRound = useCallback(async () => {
    if (animationExecutedRef.current) return;
    animationExecutedRef.current = true;

    let roundPoints: number[] = roundData.round_points;
    let currentRoundIndex = roundData.current_round_index;

    if (!roundPoints.length) {
      roundPoints = calculatePoints();
      if (userId) {
        await saveUserRoundData(userId, currentRoundIndex, roundPoints);
      }
      setRoundData({ round_points: roundPoints, current_round_index: currentRoundIndex });
    }

    const number = roundPoints[currentRoundIndex];
    setRandomNumber(number);

    currentRoundIndex += 1;
    if (userId) {
      await saveUserRoundData(userId, currentRoundIndex, roundPoints);
    }

    if (currentRoundIndex >= roundPoints.length) {
      if (userId) {
        await saveUserRoundData(userId, 0, calculatePoints());
      }
    }

    setTimeout(() => {
      setRandomNumber(null);
      const newTotalPoints = totalPoints + number;
      setTotalPoints(newTotalPoints);
      if (onAnimationEnd) {
        onAnimationEnd(number);
      }
    }, 2000);
  }, [userId, roundData, totalPoints, onAnimationEnd]);

  useEffect(() => {
    initializeRound();
  }, []);

  const handleAnimationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <>
      {randomNumber !== null && (
        <div
          className={`animate-move-up fixed flex flex-col justify-center items-center gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${
            randomNumber === 0 ? 'bg-gray-400' : randomNumber >= 10 ? 'bg-blue-600' : 'bg-red-600'
          } rounded-full p-2 w-56 h-56 aspect-square`}
          onClick={handleAnimationClick}
        >
          <p className="text-6xl font-bold text-white">
            <span className="text-4xl">+</span>
            {randomNumber}
          </p>
          <p className="text-2xl text-white text-center">
            {randomNumber === 0 ? '이번엔 꽝' : randomNumber >= 10 ? '빅포인트!!' : '포인트 적립'}
          </p>
          {userId ? (
            <p className="text-lg font-semibold text-center text-white leading-tight">
              포인트가 <br /> 적립되었습니다!
            </p>
          ) : (
            <p className="text-lg font-semibold text-center text-white leading-tight">
              로그인하면 <br /> 포인트가 <br /> 적립될텐데...
            </p>
          )}
        </div>
      )}
      <div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center z-[1005]"
        onClick={handleAnimationClick}
      >
        <AnimatedPointCounter
          currentPoints={totalPoints}
          addedPoints={randomNumber || 0}
          onAnimationComplete={() => {}}
          isLoggedIn={!!userId}
        />
      </div>
    </>
  );
}
