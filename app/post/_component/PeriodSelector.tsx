// app/post/_component/PeriodSelector.tsx
'use client';

import { useState } from 'react';

interface PeriodSelectorProps {
  onSelectPeriod: (period: number) => void;
}

export default function PeriodSelector({ onSelectPeriod }: PeriodSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(7);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const period = parseInt(event.target.value, 10);
    setSelectedPeriod(period);
    onSelectPeriod(period);
  };

  return (
    <div>
      <label htmlFor="period">Select period: </label>
      <select id="period" value={selectedPeriod} onChange={handleSelect}>
        <option value={1}>1 Day</option>
        <option value={7}>7 Days</option>
        <option value={30}>30 Days</option>
      </select>
    </div>
  );
}
