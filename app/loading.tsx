import './loading.css';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-height-minus-146 gap-6 ">
      <div className="flex flex-col items-center justify-center gap-6 animate-pulse">
        <img src="/logo-benefiboard.svg" alt="logo" />
        <h2 className="text-2xl text-gray-200 ">loading...</h2>
      </div>
    </div>
  );
}
