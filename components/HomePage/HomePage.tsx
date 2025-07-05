'use client'

import '@/app/global.css';
import Link from 'next/link';
import FoldedPaper from '@/components/foldedPaper/foldedPaper';
import Moments from '@/components/moment/moment';
import gsap from "gsap";
import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    // gsap.to("#loading-cover", {
    gsap.to("#main-content", {
      opacity: 1,
      duration: 1,
    });
  }, []);
  return (
    <>
{/*      <img
        id="loading-cover"
        src="/images/skeleton.png"
        className="z-10 fixed inset-0 w-full h-full object-cover"
        style={{ pointerEvents: "none" }}
      />*/}
      <div id="main-content" className="opacity-0">
        <div className="relative text-gray-800 h-[50dvh] text-left tracking-wide whitespace-nowrap overflow-hidden">
          {/*左上角一个行迹标定*/}
          {/*<img className="absolute w-[20vh] h-[20vh]" src="/images/pos.svg" />*/}
          <div className={`absolute bottom-[70%] pl-[17%] pr-[06%] text-4xl`}>
            一条
            <Link href='/aboutMe' className="text-blue-400">库</Link>
            子的网站
          </div>
          {/*<div className={`absolute bottom-[36%] pl-[10%] pr-[10%] text-2xl`}>他还有更多*/}
          <div className={`absolute bottom-[36%] pl-[10%] pr-[10%] text-2xl`}>
            <FoldedPaper className='text-gray-400' 口袋='/gallery'/>和破洞
          </div>
          {/*奏折的形式打开*/}
          <div className={`absolute bottom-[10%] pl-[07%] pr-[17%] text-xl`}>磨裤锉</div>
        </div>
        <div className="relative pl-[06%] h-[50dvh] w-[70%] flex space-x-4 overflow-x-auto scrollbar-hide"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 85%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 85%, transparent 100%)',
          }}>
          <Moments />
          <div className="flex absolute bottom-0 text-gray-200 space-x-1">
            <Link href='/LocationTest'>PageTest</Link>
            <span>|</span>
            <a href='/game_test/what.html'>GameTest</a>
          </div>
        </div>
      </div>
    </>
  );
}
