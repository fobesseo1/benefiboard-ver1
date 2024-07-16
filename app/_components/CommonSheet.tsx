'use client';

import Link from 'next/link';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { childCategoriesArray, parentCategoriesArray } from '../post/_action/category';
import { CurrentUserType } from '@/types/types';

interface CommonSheetProps {
  currentUser: CurrentUserType | null;
  triggerElement: React.ReactNode;
}

const CommonSheet: React.FC<CommonSheetProps> = ({ currentUser, triggerElement }) => {
  const parentCategories = parentCategoriesArray;
  const childCategories = childCategoriesArray;

  //console.log('commonsheet', currentUser);

  return (
    <Sheet>
      <SheetTrigger asChild>{triggerElement}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>전체메뉴</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col py-4 gap-4">
          <div className="repost flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{currentUser?.username} 님</h2>
            <div className="flex flex-col gap-1">
              <SheetClose asChild>
                <p className="font-semibold pl-2">
                  현재 포인트 : {currentUser?.current_points} point
                </p>
              </SheetClose>
              <SheetClose asChild>
                <Link href={`/profile/${currentUser?.donation_id}`}>
                  <p className="font-semibold pl-2">
                    ♥ {currentUser?.partner_name} 님을 서포팅 ♥
                  </p>
                </Link>
              </SheetClose>
            </div>
          </div>
          <hr />
          <div className="board flex flex-col gap-4">
            <h2 className="text-lg font-semibold">게시판</h2>
            <div className="grid grid-cols-2 gap-1">
              {parentCategories.map((category) => (
                <SheetClose asChild key={category.id}>
                  <Link href={`/post/${category.id}`}>
                    <p className="font-semibold pl-2">- {category.name}</p>
                  </Link>
                </SheetClose>
              ))}
            </div>
          </div>
          <hr />
          <div className="repost flex flex-col gap-4">
            <h2 className="text-lg font-semibold">유명 커뮤니티 포스트 모음</h2>
            <div className="flex flex-col gap-1">
              <SheetClose asChild>
                <Link href={`/repost/best`}>
                  <p className="font-semibold pl-2">- 베스트 포스트</p>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={`/repost`}>
                  <p className="font-semibold pl-2">- 인기 포스트</p>
                </Link>
              </SheetClose>
            </div>
          </div>
          <hr />
          <div className="lucky flex flex-col gap-4">
            <h2 className="text-lg font-semibold">행운의 숫자</h2>
            <div className="flex flex-col gap-1">
              <SheetClose asChild>
                <Link href={`/goodluck`}>
                  <p className="font-semibold pl-2">- 로또</p>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={`/goodluck`}>
                  <p className="font-semibold pl-2">- 연금복권</p>
                </Link>
              </SheetClose>
            </div>
          </div>
          <hr />
          {currentUser?.id && (
            <div className="profile flex flex-col gap-4">
              <h2 className="text-lg font-semibold">프로필</h2>
              <div className="flex flex-col gap-1">
                <SheetClose asChild>
                  <Link href={`/profile/${currentUser?.id}`}>
                    <p className="font-semibold pl-2">- 나의 프로필 페이지</p>
                  </Link>
                </SheetClose>
              </div>
            </div>
          )}
          <hr />
          {currentUser?.id && (
            <div className="message flex flex-col gap-4">
              <h2 className="text-lg font-semibold">메세지</h2>
              <div className="flex flex-col gap-1">
                <SheetClose asChild>
                  <Link href={`/message`}>
                    <p className="font-semibold pl-2">- 나의 메세지</p>
                  </Link>
                </SheetClose>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommonSheet;
