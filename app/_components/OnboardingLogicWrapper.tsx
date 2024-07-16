// app/_components/OnboardingLogicWrapper.tsx
'use client';

import { OnboardingProvider } from '../_context/OnboardingContext';
import OnboardingLogic from './OnboardingLogic';
import { CurrentUserType, PostType } from '@/types/types';
import { RepostType } from '../repost/_component/repost_list';

interface OnboardingLogicWrapperProps {
  postsWithCategoryNames: PostType[];
  currentUser: CurrentUserType | null;
  bestReposts: RepostType[];
  basicReposts: RepostType[];
}

export default function OnboardingLogicWrapper(props: OnboardingLogicWrapperProps) {
  return (
    <OnboardingProvider>
      <OnboardingLogic {...props} />
    </OnboardingProvider>
  );
}
