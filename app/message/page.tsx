import { getCurrentUser } from '@/lib/cookies';
import MessageList from './_component/MessageList';
import { CurrentUserType } from '../page';

export default async function MessagePage() {
  const currentUser: CurrentUserType | null = await getCurrentUser();

  if (!currentUser) {
    return <div>로그인이 필요합니다.</div>;
  }

  return <MessageList currentUserId={currentUser.id} />;
}
