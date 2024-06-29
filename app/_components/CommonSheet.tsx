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

interface CurrentUser {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_points: number;
}

interface CommonSheetProps {
  currentUser: CurrentUser | null;
  triggerElement: React.ReactNode;
}

const CommonSheet: React.FC<CommonSheetProps> = ({ currentUser, triggerElement }) => {
  const parentCategories = parentCategoriesArray;
  const childCategories = childCategoriesArray;

  return (
    <Sheet>
      <SheetTrigger asChild>{triggerElement}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>전체메뉴</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col py-4 gap-4">
          <div className="board">
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
          <div className="lucky">
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
            <div className="profile">
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
            <div className="profile">
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
