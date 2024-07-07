'use client';

import { useEffect } from 'react';

export default function AdFixedPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const banner = document.querySelector('.ad-banner');
      if (banner) {
        banner.classList.add('slide-highlight');
      }
    }, 1000); // 3초 후에 애니메이션 실행

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ad-banner mx-auto h-24 flex flex-col relative border-[1px] border-red-200 p-1 overflow-hidden">
      <h2 className="text-xs">Ad 무료공익광고 관심부탁드려요!!</h2>
      <div className="flex-1 w-full h-full">
        <img src="/adBottom-unicef.jpg" alt="Ad" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}
