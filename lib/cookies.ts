//lib/cookies.ts
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export type CurrentUser = {
  current_points: number;
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
};

export function getcurrentUserFromCookies(): CurrentUser | null {
  const cookieStore = cookies();
  const currentUserCookie = cookieStore.get('currentUser');

  // 디버깅을 위한 로그 추가
  // console.log('All cookies:', cookieStore.getAll());
  // console.log('currentUserCookie:', currentUserCookie);

  if (currentUserCookie) {
    try {
      const decodedValue = decodeURIComponent(currentUserCookie.value);
      //console.log('decodedValue:', decodedValue); // 디코딩된 값 확인
      return JSON.parse(decodedValue);
    } catch (error) {
      console.error('Error parsing currentUser cookie:', error);
      return null;
    }
  } else {
    revalidatePath('/');
    console.log('no cookie');
  }
  return null;
}

export function getCurrentUserInfo() {
  const currentUser = getcurrentUserFromCookies();

  if (!currentUser) {
    return null;
  }

  const userInfo = {
    id: currentUser.id ?? '',
    username: currentUser.username ?? '',
    email: currentUser.email ?? '',
    avatar_url: currentUser.avatar_url ?? '',
    point: currentUser.current_points ?? '',
    current_points: currentUser.current_points ?? '',
  };

  return userInfo;
}
