'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';

interface UserProfileCardProps {
  avatar_url: string | null;
  username: string | null;
  email: string | null;
  user_id: string;
  triggerElement: JSX.Element;
  point: number;
}

export default function UserProfileCard({
  avatar_url,
  username,
  email,
  user_id,
  point,
  triggerElement,
}: UserProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTouch = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div onTouchStart={handleTouch} onClick={handleTouch}>
        {triggerElement}
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <Card className="relative w-80 bg-white shadow-lg p-4 rounded-lg">
            <div className="absolute top-2 right-2">
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                <AiOutlineClose size={20} />
              </button>
            </div>
            <CardContent className="flex flex-col justify-between space-y-4">
              <img
                src={avatar_url || '/money-3d-main.png'}
                alt="avatar_image"
                className="w-60 h-60 ring-1 rounded-full object-cover mx-auto mt-4"
              />
              <div className="flex flex-col justify-center space-y-1 py-4 border-y-[1px] border-gray-200">
                <h4 className="text font-semibold pb-2 ">{username || email}</h4>
                <p className="text-sm">Point : {point}</p>
                <p className="text-sm">Trophy : 어린이 사랑 등 999,999,999</p>
                <p className="text-sm">Support : 매불쇼 외 999</p>
              </div>
              <Link href={`/profile/${user_id}`}>
                <p className="text-sm font-semibold">더보기...</p>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
