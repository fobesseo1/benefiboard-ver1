'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BiDonateHeart,
  BiGroup,
  BiHomeAlt2,
  BiMenu,
  BiMessageDots,
  BiPlusCircle,
  BiShoppingBag,
} from 'react-icons/bi';

const Footer = () => {
  const pathname = usePathname();

  // 현재 URL에서 카테고리 ID를 추출합니다.
  const categoryId = pathname.split('/').pop();

  return (
    <footer className="fixed bottom-0 left-0 z-50 h-16 w-screen bg-white flex items-center justify-between px-9 rounded-t-2xl border-[1px] border-gray-200 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-[948px]">
      <Link href="/post">
        <div className="flex flex-col  justify-center items-center">
          <BiHomeAlt2 size={24} />
          <p className="text-[10px] text-gray-800 text-center">홈</p>
        </div>
      </Link>
      <Link href="/goodluck">
        <div className="flex flex-col gap-[2px] justify-center items-center">
          <BiGroup size={24} />
          <p className="text-[10px] text-gray-800 text-center">커뮤니티</p>
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
      <div className="flex flex-col gap-[2px] justify-center items-center">
        <BiMenu size={24} />
        <p className="text-[10px] text-gray-800 text-center">전체</p>
      </div>
    </footer>
  );
};

export default Footer;
