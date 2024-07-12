'use client';

import UserProfileCard from './UserProfileCard';
import HeaderBackClick from './HeaderBackClick';
import HeaderCommonSheet from './HeaderCommonSheet';
import { CurrentUserType } from '../page';

interface HeaderClientProps {
  currentUser: CurrentUserType | null;
}

const HeaderClient: React.FC<HeaderClientProps> = ({ currentUser }) => {
  return (
    <>
      <HeaderBackClick />
      <div className="flex items-center gap-2 lg:hidden">
        {currentUser && (
          <UserProfileCard
            avatar_url={currentUser.avatar_url}
            username={currentUser.username}
            email={currentUser.email}
            user_id={currentUser.id}
            point={currentUser.current_points}
            triggerElement={
              <img
                src={currentUser.avatar_url || '/money-3d-main.png'}
                alt="User Avatar"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            }
          />
        )}
        <HeaderCommonSheet currentUser={currentUser} />
      </div>
    </>
  );
};

export default HeaderClient;
