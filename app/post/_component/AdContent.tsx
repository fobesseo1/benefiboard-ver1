//app>post>_components>AdContent.tsx

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useDrag } from '@/hooks/useDrag';

interface AdContentCardProps {
  handleAdClick: () => void;
  handleAdClose: () => void;
}

export function AdContentCard({ handleAdClick, handleAdClose }: AdContentCardProps) {
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    getTransformStyle,
    isDragging,
  } = useDrag(handleAdClose);
  return (
    <Card
      className="w-[320px] lg:w-[400px] "
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CardHeader className="tracking-tighter">
        <CardDescription>[광고]좌우로 드래그하면 사라져요~</CardDescription>
        <CardTitle>클릭하면 빅보너스 포인트</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-square bg-red-200 " style={{ pointerEvents: 'none' }}>
          <img
            src="/ad-sample.jpg"
            alt="Ad"
            className="object-cover w-full h-full"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col  gap-4">
        <Button className="bg-red-600 w-full py-8 font-semibold text-lg" onClick={handleAdClick}>
          자세히 확인하고 포인트 받기
        </Button>
        <div className="flex w-full justify-start ">
          <Button variant="outline" onClick={handleAdClose}>
            광고닫기
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
