'use client';

import React, { useEffect, useState } from 'react';

import { calculatePoints } from '../post/_action/adPoint';
import AdAlert from '../post/_component/AdAlert';
import createSupabaseBrowserClient from '@/lib/supabse/client';
import { CurrentUserType } from '../page';

interface RoundData {
  round_points: number[];
  current_round_index: number;
}

const Ad_Handler = ({
  postId,
  authorId,
  pagePath,
  currentUser,
}: {
  postId: string;
  authorId: string;
  pagePath: string;
  currentUser: CurrentUserType | null;
}) => {
  const [initialRoundData, setInitialRoundData] = useState<RoundData | null>(null);
  const [initialPoints, setInitialPoints] = useState<number | 0>(
    currentUser ? currentUser.current_points : 0
  );

  useEffect(() => {
    const fetchRoundData = async () => {
      const supabase = createSupabaseBrowserClient();

      if (currentUser) {
        const { data, error } = await supabase
          .from('user_rounds')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (error) {
          console.log('Error fetching user round data:', error.message);
        } else {
          setInitialRoundData(data);
          console.log('initialRoundData Login', data);
        }
      } else {
        const tempRoundData = {
          round_points: calculatePoints(),
          current_round_index: 0,
        };
        setInitialRoundData(tempRoundData);
        console.log('initialRoundData NotLogin', tempRoundData);
      }
    };

    fetchRoundData();
  }, [currentUser]);

  const animationExecuted =
    typeof window !== 'undefined' && localStorage.getItem(`post_${postId}_animation_executed`);

  return (
    initialRoundData &&
    !animationExecuted && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <AdAlert
          userId={currentUser?.id ?? null}
          postId={postId}
          initialRoundData={initialRoundData}
          author_id={authorId}
          /* pagePath={pagePath} */
          initialPoints={initialPoints}
        />
      </div>
    )
  );
};

export default Ad_Handler;
