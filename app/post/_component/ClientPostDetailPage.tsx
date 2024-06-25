// app/_component/ClientPostDetailPage.tsx

'use client';

import { useEffect, useState } from 'react';
import { PointAnimation } from './PointAnimation';

export default function ClientPostDetailPage({ postId }: { postId: string }) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [initialRoundData, setInitialRoundData] = useState<any>(null);
  const userId = 'user_id_placeholder'; // 실제 사용자 ID로 교체

  useEffect(() => {
    const animationExecuted = !!localStorage.getItem(`post_${postId}_animation_executed`);
    if (!animationExecuted) {
      setShowAnimation(true);
    }
  }, [postId]);

  useEffect(() => {
    async function fetchRoundData() {
      const response = await fetch(`/api/get-round-data?userId=${userId}`);
      const data = await response.json();
      setInitialRoundData(data);
      console.log('initial round data', initialRoundData);
    }

    fetchRoundData();
  }, [userId]);

  if (!showAnimation || !initialRoundData) return null;

  return <PointAnimation userId={userId} initialRoundData={initialRoundData} />;
}
