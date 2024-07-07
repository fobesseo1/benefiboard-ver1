// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter, Poppins, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Status from './_components/Status';
import { OnboardingProvider } from './_context/OnboardingContext';
import ClientLayout from './_components/ClientLayout';
import { getCurrentUser } from '@/lib/cookies';
import { CurrentUserType } from './page';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
});
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
});

export const cls = (...classnames: string[]) => {
  return classnames.join(' ');
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Benefiboard',
  description: 'Your benefiboard application description',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo-square.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser: CurrentUserType | null = await getCurrentUser();
  //console.log('layout currentUser', currentUser);

  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/logo-benefiboard.svg" />
      </head>
      <body className={`${notoSansKR.className} flex flex-col min-h-screen`}>
        <OnboardingProvider>
          <ClientLayout currentUser={currentUser}>{children}</ClientLayout>
        </OnboardingProvider>
      </body>
    </html>
  );
}
