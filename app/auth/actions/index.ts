//app>auth>actions>index.ts

'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUpWithEmailAndPassword(data: {
  email: string;
  password: string;
  userType: 'regular' | 'partner';
  category?: string;
  partner_name?: string;
}) {
  const supabase = await createSupabaseServerClient();

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          user_type: data.userType,
          category: data.category,
          partner_name: data.partner_name,
        },
      },
    });

    if (authError) {
      return { success: false, message: '회원가입 오류: ' + authError.message };
    }

    if (!authData.user) {
      return { success: false, message: '사용자 데이터가 생성되지 않았습니다.' };
    }

    return { success: true, message: '회원가입을 완료하시려면 이메일을 확인해주세요' };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, message: '예상치 못한 오류가 발생했습니다.' };
  }
}

//DELETE FROM auth.users WHERE id = '9be86dbb-af2c-4b2d-8149-45eb0a6112c0';

export async function signInWithEmailAndPassword(data: { email: string; password: string }) {
  const supabase = await createSupabaseServerClient();
  const { data: result, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (result.session) {
    cookies().set('access_token', result.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: result.session.expires_in,
    });

    const userResponse = await supabase
      .from('userdata')
      .select('id, username, avatar_url, email')
      .eq('id', result.user?.id)
      .single();

    if (userResponse.error) {
      return { success: false, message: userResponse.error.message };
    }

    cookies().set('currentUser', JSON.stringify(userResponse.data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    });

    return { success: true, message: '로그인 성공' };
  }

  return { success: false, message: '세션 생성에 실패했습니다.' };
}
