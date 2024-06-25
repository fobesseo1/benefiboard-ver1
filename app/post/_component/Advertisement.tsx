import { EmojiYay } from '@/app/_emoji-gather/emoji-gather';
import { Button } from '@/components/ui/button';

const Advertisement = ({ onButtonClick }: { onButtonClick: () => void }) => (
  <div className="my-4 flex flex-col gap-2 border-y-[1px] border-gray-200 py-4">
    <Button
      className="flex p-4 gap-4 items-center  mx-auto cursor-pointer  rounded-lg"
      onClick={onButtonClick}
    >
      {/* <EmojiYay size="36px" /> */}
      <p className=" font-semibold ">
        아래를 클릭하면
        <br />
        신나는 일이 생겨요!
      </p>
      {/* <EmojiYay size="36px" /> */}
    </Button>
    <p className="text-gray-600 text-right mr-4">ad</p>
    <img src="/ad-nike1.jpg" alt="" className="w-full aspect-video object-cover " />
    <Button className="mx-8" onClick={onButtonClick}>
      확인하고 포인트 받기
    </Button>
  </div>
);

export default Advertisement;
