import { Suspense } from 'react';
import AdContnetPage from './ad-content';

export default function AdPage() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="animate-slide-in-up">
        <p className="py-4 text-gray-800 font-semibold">광고 페이지 New</p>
        <img src="mainad-1.webp" alt="" className="w-screen-minus-32 aspect-square object-cover " />
        <Suspense fallback={<div>Loading...</div>}>
          <AdContnetPage />
        </Suspense>
      </div>
    </div>
  );
}

/* 'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdPage() {
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

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="py-4 text-gray-800 font-semibold">광고 페이지</p>
      <img src="mainad-1.png" alt="" className="w-screen-minus-32 aspect-square object-cover" />
    </div>
  );
}
 */
