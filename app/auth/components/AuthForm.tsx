'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInForm from './SignInForm';
import RegisterForm from './RegisterForm';
import GithubButton from './OAuthForm_Github';
import GoogleButton from './OAuthForm_Google';

export function AuthForm() {
  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="signin" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">로그인</TabsTrigger>
          <TabsTrigger value="register">회원가입</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
      <hr />
      <div className="flex flex-col gap-4">
        <GoogleButton />
        <GithubButton />
      </div>
    </div>
  );
}
