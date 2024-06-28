/* 'use client';
// utils/handlePostClick.ts
import { useRouter } from 'next/navigation';

export const handlePostClick = (postId: string, userId: string | null) => {
  const router = useRouter();

  const readPostsKey = `readPosts_${userId}`;
  const storedReadPosts = JSON.parse(localStorage.getItem(readPostsKey) || '[]');

  // 중복 항목 제거 및 새로운 포스트 ID 추가
  const updatedReadPosts = Array.from(new Set([...storedReadPosts, postId]));

  localStorage.setItem(readPostsKey, JSON.stringify(updatedReadPosts));

  // 페이지 이동 추가
  const detailUrl = `/post/detail/${postId}`;
  router.push(detailUrl);
}; */
