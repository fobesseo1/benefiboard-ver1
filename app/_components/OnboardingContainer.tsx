// app/_components/OnboardingContainer.tsx
import { Suspense } from 'react';
import OnboardingLogic from './OnboardingLogic';
import LoadingSpinner from './LoadingSpinner';
import { CurrentUserType, PostType } from '../../types/types';
import { RepostType } from '../repost/_component/repost_list';

interface OnboardingContainerProps {
  postsWithCategoryNames: PostType[];
  currentUser: CurrentUserType | null;
  bestReposts: RepostType[];
  basicReposts: RepostType[];
}

export default function OnboardingContainer({
  postsWithCategoryNames,
  currentUser,
  bestReposts,
  basicReposts,
}: OnboardingContainerProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OnboardingLogic
        postsWithCategoryNames={postsWithCategoryNames}
        currentUser={currentUser}
        bestReposts={bestReposts}
        basicReposts={basicReposts}
      />
    </Suspense>
  );
}
