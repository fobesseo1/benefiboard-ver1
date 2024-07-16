// app/_components/HomeContent.tsx
import { CurrentUserType, PostType } from '@/types/types';
import { RepostType } from '../repost/_component/repost_list';
import OnboardingLogicWrapper from './OnboardingLogicWrapper';
import ServerRenderedContent from './ServerRenderedContent';

interface HomeContentProps {
  postsWithCategoryNames: PostType[];
  currentUser: CurrentUserType | null;
  bestReposts: RepostType[];
  basicReposts: RepostType[];
}

export default function HomeContent(props: HomeContentProps) {
  return (
    <>
      <ServerRenderedContent {...props} />
      <OnboardingLogicWrapper {...props} />
    </>
  );
}
