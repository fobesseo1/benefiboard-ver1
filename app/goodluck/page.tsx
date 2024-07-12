import { getCurrentUser } from '@/lib/cookies';
import GoodluckTabs from './_components/GoodluckTabs';
import createSupabaseServerClient from '@/lib/supabse/server';
import { CurrentUserType } from '../page';
import AdPopupWrapper from '../post/_component/AdPopupWrapper';

export default async function GoodluckPage() {
  const currentUser: CurrentUserType | null = await getCurrentUser();

  const id = 'Goodluck';

  return (
    <div className="flex flex-col items-center pb-16">
      <GoodluckTabs />

      <AdPopupWrapper currentUser={currentUser} postId={id} authorId={`Goodluck`} />
    </div>
  );
}
