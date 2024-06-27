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

interface AdContentCardProps {
  handleAdClick: () => void;
  handleAdClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export function AdContentCard({
  handleAdClick,
  handleAdClose,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}: AdContentCardProps) {
  return (
    <Card
      className="w-[320px] lg:w-[600px]"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
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
          <Button variant="outline">광고닫기</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
