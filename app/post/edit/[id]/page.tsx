import { redirect } from 'next/navigation';
import { CurrentUser, getCurrentUserInfo } from '@/lib/cookies';
import EditForm from '../../_component/EditForm';

export default async function PostEditPage() {
  const currentUser: CurrentUser | null = getCurrentUserInfo();

  if (!currentUser) {
    console.log('nonono');
    return redirect('post');
  }

  return (
    <div>
      <EditForm
        user_id={currentUser.id}
        user_name={currentUser.username || ''}
        user_avatar_url={currentUser.avatar_url || ''}
      />
    </div>
  );
}
