//app>_components>Header.tsx

'use client';

import { useRouter } from 'next/navigation';
import { BiArrowBack } from 'react-icons/bi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import UserHoverCard from './UserHoverCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { childCategoriesArray, parentCategoriesArray } from '../post/_action/category';

interface CurrentUser {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_points: number;
}

const Header = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const parentCategories = parentCategoriesArray;
  const childCategories = childCategoriesArray;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user');
        const userInfo = await response.json();
        setCurrentUser(userInfo);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleBackClick = () => {
    router.back();
  };

  const handleLoginClick = () => {
    router.push('/login'); // 로그인 페이지로 이동
  };

  return (
    /* top위치 status에 따라 조정필요 */
    <header className="fixed top-0  left-0 z-50 w-screen h-16 flex items-center justify-between px-6 border-b-[1px] border-gray-200 bg-white">
      <BiArrowBack size={24} onClick={handleBackClick} className="cursor-pointer" />

      <img
        src="/logo-benefiboard.svg"
        alt=""
        className="absolute left-1/2 transform -translate-x-1/2"
      />

      <div className="flex items-center gap-3">
        {currentUser ? (
          <UserHoverCard
            avatar_url={currentUser.avatar_url}
            username={currentUser.username}
            email={currentUser.email}
            user_id={currentUser.id}
            point={currentUser.current_points}
            triggerElement={
              <img
                src={currentUser.avatar_url || '/money-3d-main.png'} // 아바타 URL을 사용하거나 기본 아바타 사용
                alt="User Avatar"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            }
          />
        ) : (
          <Link href="/auth">
            <p className="text-xs tracking-tighter border-[1px] p-[2px] border-gray-200">로그인</p>
          </Link>
        )}
        <Sheet>
          <SheetTrigger asChild>
            <RxHamburgerMenu size={24} />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>전체메뉴</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col py-4  gap-4">
              <h2 className="text-lg font-semibold">게시판</h2>
              <div className="flex flex-col gap-2">
                {parentCategories.map((category) => (
                  <SheetClose asChild key={category.id}>
                    <Link href={`/post/${category.id}`}>
                      <p className="font-semibold pl-2">- {category.name}</p>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
