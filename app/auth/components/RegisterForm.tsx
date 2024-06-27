'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AiOutlineLoading3Quarters, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useState } from 'react';
import { useTransition } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signUpWithEmailAndPassword } from '../actions';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const FormSchema = z
  .object({
    email: z.string().email({
      message: '올바른 형식의 이메일이 아닙니다.',
    }),
    password: z.string().min(6, {
      message: '비밀번호는 6글자 이상이어야 합니다.',
    }),
    confirm: z.string().min(6, {
      message: '비밀번호는 6글자 이상이어야 합니다.',
    }),
  })
  .refine((data) => data.confirm === data.password, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirm'],
  });

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm: '',
    },
  });

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertTitle, setAlertTitle] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<'default' | 'destructive'>('default');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const result = await signUpWithEmailAndPassword(data);
      console.log('signUp', result);

      if (!result.success) {
        setAlertTitle('회원가입 실패');
        setAlertMessage(result.message);
        setAlertVariant('destructive');
      } else {
        setAlertTitle('회원가입 성공');
        setAlertMessage(result.message);
        setAlertVariant('default');
      }
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@gmail.com"
                    {...field}
                    type="email"
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="비밀번호 최소 6글자 이상 입력해주세요"
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      onChange={field.onChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 재확인</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="비밀번호와 동일한 값을 입력하세요"
                      {...field}
                      type={showConfirmPassword ? 'text' : 'password'}
                      onChange={field.onChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full flex gap-2">
            회원가입
            <AiOutlineLoading3Quarters className={cn('animate-spin', { hidden: !isPending })} />
          </Button>
        </form>
      </Form>

      {alertMessage && (
        <Alert className="mt-4" variant={alertVariant}>
          <AlertTitle>{alertTitle}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
