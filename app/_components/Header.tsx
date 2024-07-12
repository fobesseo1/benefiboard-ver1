// app/_components/Header.tsx
import Link from 'next/link';
import { CurrentUserType } from '../page';
import HeaderClient from './HeaderClient';
import HeaderBackClick from './HeaderBackClick';
import HeaderCommonSheet from './HeaderCommonSheet';

const Header = ({ currentUser }: { currentUser: CurrentUserType | null }) => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      <header className="h-16 bg-white flex items-center justify-between px-6 border-b-[1px] border-gray-200 lg:w-[948px] mx-auto">
        {/* <HeaderClient currentUser={currentUser} /> */}
        <HeaderBackClick />
        <img
          src="/logo-benefiboard.svg"
          alt=""
          className="absolute left-1/2 transform -translate-x-1/2"
        />
        {!currentUser && (
          <div className="flex gap-2 items-center">
            <Link href="/auth">
              <p className="text-xs tracking-tighter border-[1px] p-[2px] border-gray-200">
                로그인
              </p>
            </Link>
            <HeaderCommonSheet currentUser={currentUser} />
          </div>
        )}
        {currentUser && (
          <div className="flex items-center gap-1 lg:gap-4 justify-center ">
            <div className="flex items-center gap-1 justify-center">
              <Link href={`/profile/${currentUser.id}`}>
                <img
                  src={currentUser.avatar_url || '/money-3d-main.png'}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              </Link>
              <div className="lg:flex flex-col items-center hidden">
                <p className="text-sm font-semibold">{currentUser.username}</p>
                <p className="text-sm text-gray-500">포인트: {currentUser.current_points}</p>
              </div>
            </div>
            <HeaderCommonSheet currentUser={currentUser} />
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
