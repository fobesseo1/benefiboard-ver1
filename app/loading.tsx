import './loading.css';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-height-minus-146 gap-6">
      <h2 className="text-2xl text-gray-100 animate-pulse">loading...</h2>
      {/* <div className="loadingContainer flex">
        <div className="loadingBar"></div>
        <div className="loadingBar"></div>
        <div className="loadingBar"></div>
        <div className="loadingBar"></div>
        <div className="loadingBar"></div>
      </div> */}
    </div>
  );
}
