'use client';

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

type PointsArray = number[];

const calculatePoints = (): PointsArray => {
  const rounds = 7 + Math.floor(Math.random() * 3); // 7 ~ 9 사이의 숫자
  const points: PointsArray = new Array(rounds).fill(0);
  let sum = 0;
  let bigPointIndex = Math.floor(Math.random() * rounds);

  for (let i = 0; i < rounds; i++) {
    if (i === bigPointIndex) {
      points[i] = 17 + Math.floor(Math.random() * 19); // 17 ~ 35 사이의 숫자
    } else {
      points[i] = Math.floor(Math.random() * 4); // 0 ~ 3 사이의 숫자
    }
    sum += points[i];
  }

  // 총합이 35가 아니면 다시 계산
  while (sum !== 35) {
    sum = 0;
    bigPointIndex = Math.floor(Math.random() * rounds);
    for (let i = 0; i < rounds; i++) {
      if (i === bigPointIndex) {
        points[i] = 17 + Math.floor(Math.random() * 19);
      } else {
        points[i] = Math.floor(Math.random() * 4);
      }
      sum += points[i];
    }
  }

  return points;
};

const PointTester2 = () => {
  const [points, setPoints] = useState<PointsArray>([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [history, setHistory] = useState<PointsArray[]>([]);

  const handleClick = () => {
    const newPoints = calculatePoints();
    console.log(newPoints);
    setPoints(newPoints);
    setHistory([...history, newPoints]); // 포인트 히스토리 유지
    setCurrentPointIndex(0); // 인덱스를 초기화하여 첫 번째 포인트부터 표시
  };

  return (
    <div>
      <h1>Point Tester</h1>
      <Button onClick={handleClick}>Generate Points</Button>
      {points.length > 0 && <p>Current Point: {points[currentPointIndex]}</p>}
      <div>
        {points.map((point, index) => (
          <div key={index}>
            <p>
              Round {index + 1}: {point}
            </p>
          </div>
        ))}
      </div>
      <div>
        <h2>History</h2>
        {history.map((pointsSet, index) => (
          <div key={index}>
            <p>
              Attempt {index + 1}: {pointsSet.join(', ')} (Sum:{' '}
              {pointsSet.reduce((acc, val) => acc + val, 0)})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PointTester2;
