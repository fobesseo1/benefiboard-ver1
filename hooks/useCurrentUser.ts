// hooks/useCurrentUser.ts
'use client';

import { useState, useEffect } from 'react';

interface CurrentUser {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_points: number;
}

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
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
