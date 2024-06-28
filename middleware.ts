// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set(name, value, { ...options, sameSite: 'none', secure: true });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set(name, '', { ...options, sameSite: 'none', secure: true });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: currentUser, error } = await supabase
      .from('userdata')
      .select('id, username, avatar_url, email, current_points')
      .eq('id', user.id)
      .single();

    if (currentUser) {
      //console.log('Setting currentUser cookie:', currentUser); // 로그 추가
      response.cookies.set('currentUser', JSON.stringify(currentUser), {
        httpOnly: false, // 클라이언트에서도 접근 가능하도록 설정
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        sameSite: 'lax', // none으로 설정하지 않도록 주의
      });
    } else {
      console.error('Error fetching currentUser:', error);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

/* import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // Supabase 클라이언트 생성
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: currentUser, error } = await supabase
      .from('userdata')
      .select('id, username, avatar_url, email, current_points')
      .eq('id', user.id)
      .single();

    if (currentUser) {
      console.log('Setting x-current-user header:', JSON.stringify(currentUser));
      // 쿠키 대신 헤더를 설정합니다
      requestHeaders.set('x-current-user', JSON.stringify(currentUser));
    } else {
      console.error('currentUser 가져오기 오류:', error);
    }
  }

  // 새로운 응답 생성
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
 */
