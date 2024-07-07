// app/_components/Header.tsx

'use client';

import { useRouter } from 'next/navigation';
import { BiArrowBack } from 'react-icons/bi';
import { RxHamburgerMenu } from 'react-icons/rx';
import Link from 'next/link';
import CommonSheet from './CommonSheet';
import UserProfileCard from './UserProfileCard';
import { CurrentUserType } from '../page';

const Header = ({ currentUser }: { currentUser: CurrentUserType | null }) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  const handleLoginClick = () => {
    router.push('/login'); // 로그인 페이지로 이동
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full ">
      <header className="h-16 bg-white flex items-center justify-between px-6 border-b-[1px] border-gray-200  lg:w-[948px] mx-auto">
        <BiArrowBack size={24} onClick={handleBackClick} className="cursor-pointer" />
        <img
          src="/logo-benefiboard.svg"
          alt=""
          className="absolute left-1/2 transform -translate-x-1/2"
        />
        <div className="flex items-center gap-2 lg:gap-4 ">
          {currentUser ? (
            <div className="flex items-center gap-2">
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
              <div className="hidden lg:block">
                <p className="text-sm font-semibold">{currentUser?.username}</p>
                <p className="text-sm text-gray-500">포인트: {currentUser?.current_points}</p>
              </div>
            </div>
          ) : (
            <Link href="/auth">
              <p className="text-xs tracking-tighter border-[1px] p-[2px] border-gray-200">
                로그인
              </p>
            </Link>
          )}
          <CommonSheet
            currentUser={currentUser}
            triggerElement={
              <div>
                <RxHamburgerMenu size={24} />
              </div>
            }
          />
        </div>
      </header>
    </div>
  );
};

export default Header;
