// hooks/useCurrentUser.ts
'use client';

import { CurrentUserType } from '@/app/page';
import { useState, useEffect } from 'react';

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user');
        const userInfo = await response.json();
        setCurrentUser(userInfo);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { currentUser, loading };
};

export default useCurrentUser;
