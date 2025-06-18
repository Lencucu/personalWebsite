import './global.css';
import Link from 'next/link';
import FoldedPaper from '@/components/foldedPaper/foldedPaper';

export default function HomePage() {
  return (
    <main>
      {/*左上角一个行迹标定*/}
      <div className="relative h-[50vh] text-left tracking-wide whitespace-nowrap overflow-hidden">
        <div className={`absolute bottom-[70%] pl-[17%] pr-[06%] text-4xl`}>
          这是属于一条‘
          <Link href='/aboutMe' className="text-blue-500">库</Link>
          ’子的网站
        </div>
        {/*<div className={`absolute bottom-[36%] pl-[10%] pr-[10%] text-2xl`}>他还有更多*/}
        <div className={`absolute bottom-[36%] pl-[10%] pr-[10%] text-2xl`}>他有一个
          <FoldedPaper className='text-gray-400' 画廊='/gallery'/>
        </div>
        {/*奏折的形式打开*/}
        {/*<div className={`absolute bottom-[10%] pl-[06%] pr-[17%] text-xl`}>他的动态</div>*/}
      </div>
      <div className="relative h-[50vh]">
      </div>
    </main>
  );
}
