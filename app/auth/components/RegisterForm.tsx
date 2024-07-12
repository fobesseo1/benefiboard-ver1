'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AiOutlineLoading3Quarters, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useState } from 'react';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

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
    userType: z.enum(['regular', 'partner']),
    category: z.string().optional(),
    partner_name: z.string().optional(),
  })
  .refine((data) => data.confirm === data.password, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirm'],
  })
  .refine(
    (data) => {
      if (data.userType === 'partner') {
        return !!data.category && !!data.partner_name;
      }
      return true;
    },
    {
      message: '파트너 정보를 입력해주세요.',
      path: ['category', 'partner_name'],
    }
  );

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [alertInfo, setAlertInfo] = useState<{
    title: string;
    description: string;
    variant: 'default' | 'destructive';
  } | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm: '',
      userType: 'regular',
      category: '기타',
    },
  });

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertTitle, setAlertTitle] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<'default' | 'destructive'>('default');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('regular');
  const [selectedCategory, setSelectedCategory] = useState('기타');

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await signUpWithEmailAndPassword(data);
      if (result.success) {
        router.push(`/auth?success=${encodeURIComponent(result.message)}`);
      } else {
        router.push(`/auth?error=${encodeURIComponent(result.message)}`);
      }
    } catch (error) {
      console.error('회원가입 중 예외 발생:', error);
      router.push('/auth?error=' + encodeURIComponent('예상치 못한 오류가 발생했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사용자 유형</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUserType(e.target.value);
                    }}
                  >
                    <option value="regular">일반 사용자</option>
                    <option value="partner">파트너 사용자</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          {userType === 'partner' && (
            <>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCategory(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리를 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="children">어린이</SelectItem>
                        <SelectItem value="environment">환경보호</SelectItem>
                        <SelectItem value="politics">정치</SelectItem>
                        <SelectItem value="youtuber">유튜버</SelectItem>
                        <SelectItem value="influencer">인플루언서</SelectItem>
                        <SelectItem value="celebrity">연예인</SelectItem>
                        <SelectItem value="culture">문화</SelectItem>
                        <SelectItem value="art">예술</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedCategory === 'other' && (
                      <Input
                        {...field}
                        value={field.value === 'other' ? '' : field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="기타 카테고리를 입력해주세요"
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partner_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>파트너 이름</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''} // 값이 undefined일 때 빈 문자열 사용
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="파트너 이름을 입력하세요"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" className="w-full flex gap-2">
            회원가입
            <AiOutlineLoading3Quarters className={cn('animate-spin', { hidden: !isPending })} />
          </Button>
        </form>
        {alertInfo && (
          <Alert variant={alertInfo.variant} className="mt-4">
            <AlertTitle>{alertInfo.title}</AlertTitle>
            <AlertDescription>{alertInfo.description}</AlertDescription>
          </Alert>
        )}
      </Form>
    </>
  );
}
