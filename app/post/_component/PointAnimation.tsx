'use client';

import { useEffect, useState } from 'react';
import { calculatePoints } from '../_action/adPoint';
import { saveUserRoundData } from '../_action/adPointSupabase';

interface PointAnimationProps {
  userId: string | null;
  initialRoundData: any;
  onAnimationEnd?: (points: number) => void; // 선택적 프로퍼티로 변경
}

export function PointAnimation({ userId, initialRoundData, onAnimationEnd }: PointAnimationProps) {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [bonusNumber, setBonusNumber] = useState<number | null>(null);
  const [roundData, setRoundData] = useState(initialRoundData);
  const [animationExecuted, setAnimationExecuted] = useState(false); // 추가된 부분

  useEffect(() => {
    async function initializeRound() {
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

      const timer = setTimeout(() => {
        setRandomNumber(null);
        if (!animationExecuted) {
          setAnimationExecuted(true);
          if (onAnimationEnd) {
            onAnimationEnd(number);
          }
        }
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (!animationExecuted) {
      initializeRound();
    }
  }, [userId, roundData, animationExecuted]);

  return (
    <>
      {randomNumber !== null && (
        <div
          className={`fixed flex flex-col justify-center items-center gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-move-up ${
            randomNumber === 0 ? 'bg-gray-400' : randomNumber >= 10 ? 'bg-blue-600' : 'bg-red-600'
          } rounded-full p-2 w-56 h-56 aspect-square`}
        >
          <p className="text-6xl font-bold text-white">{randomNumber}</p>
          <p className="text-2xl text-white text-center">
            {randomNumber === 0 ? (
              <>
                이번엔 꽝
                {/* <br />
                다음기회를 */}
              </>
            ) : randomNumber >= 10 ? (
              '빅포인트!!'
            ) : (
              '포인트 적립'
            )}
          </p>
          {userId ? (
            <article className="text-pretty">
              <p className="text-lg font-semibold text-center text-white leading-tight">
                포인트가 <br /> 적립되었습니다!
              </p>
            </article>
          ) : (
            <article className="text-pretty ">
              <p className="text-lg font-semibold text-center text-white leading-tight">
                로그인하면 <br /> 포인트가 <br /> 적립될텐데...
              </p>
            </article>
          )}
        </div>
      )}
      {bonusNumber !== null && (
        <div className="fixed flex flex-col justify-center items-center gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-move-up bg-blue-600 rounded-full p-4 w-52 h-52 aspect-square">
          <p className="text-6xl font-bold text-white">{bonusNumber}</p>
          <p className="text-2xl text-white">보너스 포인트</p>
        </div>
      )}
    </>
  );
}
