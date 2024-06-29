'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiDice6, BiHomeAlt2, BiMenu, BiMessageDots, BiPlusCircle } from 'react-icons/bi';
import CommonSheet from './CommonSheet';
import { useState, useEffect } from 'react';

interface CurrentUser {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_points: number;
}

const Footer = () => {
  const pathname = usePathname();
  const categoryId = pathname.split('/').pop();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

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

  return (
    <footer className="fixed bottom-0 left-0 z-50 h-16 w-screen bg-white flex items-center justify-between px-9 rounded-t-2xl border-[1px] border-gray-200 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-[948px]">
      <Link href="/post">
        <div className="flex flex-col justify-center items-center">
          <BiHomeAlt2 size={24} />
          <p className="text-[10px] text-gray-800 text-center">홈</p>
        </div>
      </Link>
      <Link href="/goodluck">
        <div className="flex flex-col gap-[2px] justify-center items-center">
          <BiDice6 size={24} />
          <p className="text-[10px] text-gray-800 text-center">로또번호</p>
        </div>
      </Link>
      <Link href={`/post/create?categoryId=${categoryId}`}>
        <div className="flex flex-col gap-[2px] justify-center items-center">
          <BiPlusCircle size={24} />
          <p className="text-[10px] text-gray-800 text-center">글쓰기</p>
        </div>
      </Link>
      <Link href="/message">
        <div className="flex flex-col gap-[2px] justify-center items-center">
          <BiMessageDots size={24} />
          <p className="text-[10px] text-gray-800 text-center">메세지</p>
        </div>
      </Link>
      <CommonSheet
        currentUser={currentUser}
        triggerElement={
          <div className="flex flex-col gap-[2px] justify-center items-center cursor-pointer">
            <BiMenu size={24} />
            <p className="text-[10px] text-gray-800 text-center">전체</p>
          </div>
        }
      />
    </footer>
  );
};

export default Footer;
