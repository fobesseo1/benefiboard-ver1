'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleRouteChange = () => {
        const scrollPosition = sessionStorage.getItem('scrollPosition');
        if (scrollPosition) {
          window.scrollTo(0, parseInt(scrollPosition));
          sessionStorage.removeItem('scrollPosition');
        }
      };

      const handleBeforeUnload = () => {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      handleRouteChange();

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [pathname, searchParams]);
}
