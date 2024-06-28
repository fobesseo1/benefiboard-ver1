import type { Metadata } from 'next';
import { Inter, Poppins, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Status from './_components/Status';
import Header from './_components/Header';
import Footer from './_components/Footer';

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

export const metadata: Metadata = {
  title: 'Benefiboard',
  description: 'Your benefiboard application description',
  manifest: '/manifest.json',
  themeColor: '#000000',
  icons: {
    icon: '/logo-benefiboard.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/logo-benefiboard.svg" />
      </head>
      <body className={notoSansKR.className}>
        <div className="max-w-[1280px] mx-auto">
          <Header />
          <main className="pt-16 pb-16 min-h-screen tracking-tight text-gray-800 leading-tight">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
