// _components/Onboarding.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../_css-module/Onboarding.module.css';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timeout1 = setTimeout(() => setStep(1), 1500); // 1.5배 느리게
    const timeout2 = setTimeout(() => setStep(2), 3000); // 1.5배 느리게
    const timeout3 = setTimeout(() => setStep(3), 4500); // 1.5배 느리게
    const timeout4 = setTimeout(() => {
      setStep(4);
      onComplete(); // 온보딩이 완료되었음을 알림
    }, 6000); // 1.5배 느리게

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
    };
  }, [onComplete]);

  return (
    <div
      className={`${styles.onboardingContainer} flex flex-col items-center h-[calc(100vh-146px)] justify-center text-center mx-auto lg:w-[948px]`}
    >
      <div className={`${styles.logo} ${step >= 1 ? styles.visible : ''}`}>
        <Image src="/logo-benefiboard-white.svg" alt="Benefiboard Logo" width={240} height={36} />
      </div>
      <div className={`${styles.welcomeMessage} ${step >= 2 ? styles.visible : ''}`}>
        Welcome to Benefiboard
      </div>
      <div className={`${styles.features} ${step >= 3 ? styles.visible : ''}`}>
        <div className={styles.feature}>투명한 수익 분배</div>
        <div className={styles.feature}>짧은 광고</div>
        <div className={styles.feature}>기부 옵션</div>
      </div>
      {/* <Link href="/home">
        <button className={`${styles.getStarted} ${step >= 4 ? styles.visible : ''}`}>
          Get Started
        </button>
      </Link> */}
    </div>
  );
};

export default Onboarding;
