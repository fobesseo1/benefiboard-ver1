/* 1원 = 20point */

export const calculatePoints = (): number[] => {
  const rounds = 7 + Math.floor(Math.random() * 3); // 7 ~ 9 사이의 숫자
  const points: number[] = new Array(rounds).fill(0);
  let sum = 0;
  let bigPointIndex = Math.floor(Math.random() * rounds);

  for (let i = 0; i < rounds; i++) {
    if (i === bigPointIndex) {
      points[i] = 10 + Math.floor(Math.random() * 6); // 10 ~ 15 사이의 숫자
    } else {
      points[i] = Math.floor(Math.random() * 4); // 0 ~ 3 사이의 숫자
    }
    sum += points[i];
  }

  // 총합이 20이 아니면 다시 계산
  while (sum !== 20) {
    sum = 0;
    bigPointIndex = Math.floor(Math.random() * rounds);
    for (let i = 0; i < rounds; i++) {
      if (i === bigPointIndex) {
        points[i] = 10 + Math.floor(Math.random() * 6); // 10 ~ 15 사이의 숫자
      } else {
        points[i] = Math.floor(Math.random() * 4); // 0 ~ 3 사이의 숫자
      }
      sum += points[i];
    }
  }

  return points;
};

/* export async function fetchIpAddress(): Promise<string> {
  try {
  const response = await fetch('/api/get-ip');
  const data = await response.json();
  return data.ip;
  } catch (error) {
  console.error('Failed to fetch IP address:', error);
  return 'Unknown IP';
  }
  } */

export async function fetchIpAddress(): Promise<string> {
  try {
    const response = await fetch('/api/get-ip');
    if (!response.ok) {
      throw new Error('Failed to fetch IP address');
    }
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to fetch IP address:', error);
    return 'Unknown IP';
  }
}
