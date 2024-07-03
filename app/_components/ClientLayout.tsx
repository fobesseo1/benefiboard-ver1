// app/_components/ClientLayout.tsx

'use client';

import { useOnboarding } from '../_context/OnboardingContext';
import Footer from './Footer';
import Header from './Header';

interface CurrentUser {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  current_points: number;
}

export default function ClientLayout({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: CurrentUser | null;
}) {
  const { isOnboarding } = useOnboarding();

  if (isOnboarding) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentUser={currentUser} />
      <main className="flex-1 tracking-tight text-gray-800 leading-tight pt-16 pb-16">
        {children}
      </main>
      <Footer currentUser={currentUser} />
    </div>
  );
}
