import { getCurrentUserInfo } from '@/lib/cookies';
import GoodluckTabs from './_components/GoodluckTabs';
import createSupabaseServerClient from '@/lib/supabse/server';
import AdAlert from '../post/_component/AdAlert';

export default async function GoodluckPage() {
  const currentUser = getCurrentUserInfo();
  const supabase = await createSupabaseServerClient();
  // Fetching the round data
  const { data: roundData, error: roundError } = await supabase
    .from('user_rounds')
    .select('*')
    .eq('user_id', currentUser?.id)
    .single();

  if (roundError) {
    console.log('Error fetching user round data:', roundError.message);
  }

  const postId = null;
  const author_id = null;
  const pagePath = 'goodluck';

  return (
    <div className="flex flex-col items-center pb-16">
      <GoodluckTabs />
      {/* AdAlert 컴포넌트를 추가 */}
      {currentUser && roundData && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <AdAlert
            userId={currentUser.id}
            postId={postId}
            initialRoundData={roundData}
            author_id={author_id}
            pagePath={pagePath}
          />
        </div>
      )}
    </div>
  );
}
