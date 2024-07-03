// app/_context/OnboardingContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingContextType {
  isOnboarding: boolean;
  setIsOnboarding: (isOnboarding: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [isOnboarding, setIsOnboarding] = useState(false);

  return (
    <OnboardingContext.Provider value={{ isOnboarding, setIsOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
