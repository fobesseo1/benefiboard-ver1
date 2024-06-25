import { CurrentUser, getCurrentUserInfo } from '@/lib/cookies';
import MessageList from './_component/MessageList';

export default function MessagePage() {
  const currentUser: CurrentUser | null = getCurrentUserInfo();

  if (!currentUser) {
    return <div>로그인이 필요합니다.</div>;
  }

  return <MessageList currentUserId={currentUser.id} />;
}
