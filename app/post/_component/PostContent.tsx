const PostContent = ({ content }: { content: string }) => (
  <section className="flex flex-col my-6 gap-8">
    {/* <img src="/mainad-1.png" alt="" className="w-full aspect-square object-cover" /> */}
    <p className="leading-normal ">{content}</p>
  </section>
);

export default PostContent;
