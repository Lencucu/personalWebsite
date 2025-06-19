'use client'

import './global.css';
import Link from 'next/link';
import FoldedPaper from '@/components/foldedPaper/foldedPaper';
import Moments from '@/components/moment/moment';

export default function HomePage() {
  return (
    <main>
      <div className="relative h-[50vh] text-left tracking-wide whitespace-nowrap overflow-hidden">
      <img className="absolute w-[20vh] h-[20vh]" src="/images/pos.svg" />
      {/*左上角一个行迹标定*/}
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
        <div className={`absolute bottom-[10%] pl-[06%] pr-[17%] text-xl`}>他的动态</div>
      </div>
      <div className="relative pl-[06%] h-[50vh] flex space-x-4 overflow-x-auto scrollbar-hide">
        <Moments />
        <Link href='/test' className="text-gray-100">TestPage</Link>
      </div>
    </main>
  );
}
