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
      <h2>PostEditPage</h2>
      {currentUser.id ? <p>Hello {currentUser.id}</p> : null}
      {currentUser.username ? <p>Hello {currentUser.username}</p> : null}
      {currentUser.email ? <p>Hello {currentUser.email}</p> : null}
      {currentUser.avatar_url ? <p>Hello {currentUser.avatar_url}</p> : null}
      <EditForm
        user_id={currentUser.id}
        user_name={currentUser.username || ''}
        user_avatar_url={currentUser.avatar_url || ''}
      />
    </div>
  );
}
