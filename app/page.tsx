import './global.css';
import Link from 'next/link';

export default function HomePage() {
  let a = [0,0,255];
  return (
    <main>
      {/*左上角一个行迹标定*/}
      <div className="relative h-[50vh] text-left tracking-wide whitespace-nowrap overflow-hidden">
        <div className={`absolute bottom-[70%] pl-[17%] pr-[06%] text-4xl`}>
          这是属于一条‘
          <Link href='test' className="text-blue-500">库</Link>
          ’子的网站
        </div>
        <div className={`absolute bottom-[36%] pl-[10%] pr-[10%] text-2xl`}>他还有更多子帖</div>
        {/*奏折的形式打开*/}
        <div className={`absolute bottom-[10%] pl-[06%] pr-[17%] text-xl`}>他的动态</div>
      </div>
      <div className="relative h-[50vh]">
      </div>
    </main>
  );
}
