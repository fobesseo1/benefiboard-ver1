'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdContnetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams.get('target');

  useEffect(() => {
    if (target) {
      console.log('Navigating to target in 1.5 seconds:', target);

      const timer = setTimeout(() => {
        console.log('Navigating now:', new Date().toISOString());
        const startTime = performance.now();

        router.replace(target);

        const endTime = performance.now();
        console.log(`Navigation to ${target} completed in ${endTime - startTime} ms`);
      }, 1500);

      return () => {
        console.log('Clearing timeout');
        clearTimeout(timer);
      };
    }
  }, [target, router]);

  return null;
}
