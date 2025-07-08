'use client'

import Link from 'next/link';
import gsap from "gsap";
import { useEffect } from 'react'
import localFont from 'next/font/local';

import '@/app/global.css';
import FoldedPaper from '@/components/foldedPaper/foldedPaper';
import Moments from '@/components/moment/moment';

const smileySans = localFont({
  src: './../../public/fonts/SmileySans-Oblique.ttf.woff2',
  variable: '--font-smileySans',
})

export default function HomePage() {
  useEffect(() => {
    gsap.to("#main-content", {
      opacity: 1,
      duration: 1,
    });
  }, []);
  return (
    <div id="main-content" className="opacity-0">

      <div className="relative text-gray-800 h-[50dvh] text-left tracking-wide whitespace-nowrap overflow-hidden">
        <div className={`absolute bottom-[70%] pl-[17%] pr-[06%] text-4xl`}>
          一条
          <Link href='/aboutMe' className="text-blue-400">库</Link>
          子的网站
        </div>
        <div className={`absolute bottom-[36%] pl-[10%] pr-[10%] text-2xl`}>
          {/*奏折的形式打开*/}
          <FoldedPaper className='text-gray-400' 口袋='/gallery'/>和破洞
        </div>
        <div className={`absolute bottom-[10%] pl-[07%] pr-[17%] text-xl`}>磨裤锉</div>
      </div>

      <div className="relative pl-[06%] h-[50dvh] w-[70%] flex space-x-4 overflow-x-auto scrollbar-hide"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 85%, transparent 100%)',
        }}>
        <Moments />
      </div>

      <div className={`absolute ${smileySans.className} pl-[06%] bottom-[01.5%] text-gray-200 space-x-1 flex`}>
        <span>Tests</span><span>|</span>
        <Link href='/test'>page</Link>
        <a href='/game_test/what.html'>game</a>
      </div>

    </div>
  );
}
