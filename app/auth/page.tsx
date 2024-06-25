import React from 'react';
import { AuthForm } from './components/AuthForm';
import { redirect } from 'next/navigation';
import SignOut from './components/SignOut';
import { CurrentUser, getCurrentUserInfo } from '@/lib/cookies';
import { revalidatePath } from 'next/cache';

export default async function page() {
  const currentUser: CurrentUser | null = getCurrentUserInfo();
  /* if (currentUser) {
    revalidatePath('/post');
    redirect('/post');
  } */
  return (
    <div className="flex justify-center mt-16 ">
      <div className="w-full mx-6 flex flex-col items-center gap-16">
        <img src="/logo-benefiboard.svg" alt="" />
        <SignOut />
        <AuthForm />
      </div>
    </div>
  );
}
