import React from 'react';
import { BiBarChart, BiBattery, BiWifi } from 'react-icons/bi';

export default function Status() {
  return (
    <div className="fixed top-0 left-0 h-[42px] z-50 w-screen flex items-center justify-between px-6 bg-white">
      <p className="font-semibold text-sm text-gray-800">9:30</p>
      <div className="flex gap-[2px]">
        <BiWifi />
        <BiBarChart />
        <BiBattery />
      </div>
    </div>
  );
}
