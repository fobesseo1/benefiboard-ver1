// 'use client';

// import { useState, useEffect } from 'react';

// export default function AdFixedPage() {
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(false);
//     }, 5000);

//     return () => clearTimeout(timer); // Cleanup the timer if the component is unmounted
//   }, []);

//   if (!isVisible) {
//     return <></>;
//   }

//   return (
//     <div className="mx-auto w-80 h-24 flex flex-col relative border-[1px] border-red-200 p-1">
//       <h2 className="text-xs">Ad 3초후 사라집니다</h2>
//       <div
//         className="flex-1 bg-cover bg-no-repeat w-full h-full"
//         style={{ backgroundImage: 'url(/adBottom-unicef.jpg)' }}
//       >
//         {/* <img src="/adBottom-unicef.jpg" alt="" className="object-cover w-full h-full" /> */}
//       </div>
//     </div>
//   );
// }

/* 클릭시 포인트 주기 로직 추가  */
export default function AdFixedPage() {
  return (
    <div className="mx-auto w-80 h-24 flex flex-col relative border-[1px] border-red-200 p-1">
      <h2 className="text-xs">Ad 무료공익광고 관심부탁드려요!!</h2>
      <div
        className="flex-1 bg-cover bg-no-repeat w-full h-full"
        style={{ backgroundImage: 'url(/adBottom-unicef.jpg)' }}
      >
        {/* <img src="/adBottom-unicef.jpg" alt="" className="object-cover w-full h-full" /> */}
      </div>
    </div>
  );
}
