import { getCurrentUser } from '@/lib/cookies';
import GoodluckTabs from './_components/GoodluckTabs';
import createSupabaseServerClient from '@/lib/supabse/server';
import AdAlert from '../post/_component/AdAlert';
import { calculatePoints } from '../post/_action/adPoint';
import Ad_Handler from '../_components/Ad_Handler';
import { CurrentUserType } from '../page';

export default async function GoodluckPage() {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const id = 'Goodluck';

  // Fetching the round data
  let initialRoundData;
  if (currentUser) {
    const { data, error: roundError } = await supabase
      .from('user_rounds')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (roundError) {
      console.log('Error fetching user round data:', roundError.message);
    } else {
      initialRoundData = data;
      console.log('initialRoundData Login', initialRoundData);
    }
  } else {
    // 로그인하지 않은 사용자의 경우 임시 라운드 데이터를 생성
    initialRoundData = {
      round_points: calculatePoints(),
      current_round_index: 0,
    };
    console.log('initialRoundData NotLogin', initialRoundData);
  }

  const animationExecuted =
    typeof window !== 'undefined' && localStorage.getItem(`post_${id}_animation_executed`);

  const postId = null;
  const author_id = null;
  const pagePath = 'goodluck';

  return (
    <div className="flex flex-col items-center pb-16">
      <GoodluckTabs />
      {/* AdAlert 컴포넌트를 추가 */}
      {/* AdAlert 컴포넌트를 추가 */}
      {/* {initialRoundData && !animationExecuted && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <AdAlert
            userId={currentUser?.id ?? null}
            postId={id}
            initialRoundData={initialRoundData}
            author_id={`Goodluck`}
            pagePath={pagePath}
          />
        </div>
      )} */}
      <Ad_Handler currentUser={currentUser} postId={id} authorId={`Goodluck`} pagePath="goodluck" />
    </div>
  );
}
