'use client';

import { useEffect, useState } from 'react';

export default function PointAnimationClick({
  points,
  onAnimationEnd,
}: {
  points: number;
  onAnimationEnd: (points: number) => void;
}) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      onAnimationEnd(points);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  if (!showAnimation) return null;

  return (
    <div
      className={`fixed flex flex-col justify-center items-center gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-move-up ${
        points >= 300 ? 'bg-blue-600' : 'bg-red-600'
      } rounded-full p-4 w-52 h-52 aspect-square`}
    >
      <p className="text-6xl font-bold text-white">{points}</p>
      <p className="text-2xl text-white text-center">포인트 적립</p>
    </div>
  );
}
