'use client'

import Link from 'next/link';
import gsap from "gsap";
type GSAPTween = any;
import { useEffect, useState, useRef } from 'react'
import localFont from 'next/font/local';

import '@/app/global.css';
import FoldedPaper from '@/components/foldedPaper/foldedPaper';
import Moments from '@/components/moment/moment';
import { line1Ease, line2Ease, line3Ease } from '@/ops/lines';

const smileySans = localFont({
  src: './../../public/fonts/SmileySans-Oblique.ttf.woff2',
  variable: '--font-smileySans',
})

export default function HomePage({
  bot_pl1 = [70,17],
  bot_pl2 = [36,10],
  bot_pl3 = [10, 7],
  onSwipe,
}:{
  bot_pl1: [number,number],
  bot_pl2: [number,number],
  bot_pl3: [number,number],
  onSwipe?: (ratio: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const title3Ref = useRef<HTMLDivElement>(null);
  const [ticked, setTicked] = useState(false);
  const startXRef = useRef<number | null>(null);
  const title1tweenRef = useRef<GSAPTween | null>(null);
  const title2tweenRef = useRef<GSAPTween | null>(null);
  const title3tweenRef = useRef<GSAPTween | null>(null);
  const initialEffectX = 0.12;
  const [effectX, setEffectX] = useState(initialEffectX);

  function on_Down(e: MouseEvent | TouchEvent) {
    if(!ticked){
      const rect = containerRef.current!.getBoundingClientRect();
      setTicked(true);
      startXRef.current = (e instanceof TouchEvent)?
        (e.touches[0].clientX - rect.left):
        (e.clientX - rect.left);
    }
  }


  useEffect(() => {
    const rect = containerRef.current!.getBoundingClientRect();
    gsap.to("#main-content", {
      opacity: 1,
      duration: 1,
    });
    title1tweenRef.current = gsap.to(title1Ref.current!, {
      paddingLeft: '100%', // 👈 目标值
      duration: 1.5,
      ease: line1Ease,
      overwrite: true,
      paused: true,
      OnUpdate: ()=>{console.log('xxx')},
    });
    title2tweenRef.current = gsap.to(title2Ref.current!, {
      paddingLeft: '100%', // 👈 目标值
      duration: 1.5,
      ease: line2Ease,
      overwrite: true,
      paused: true,
    });
    title3tweenRef.current = gsap.to(title3Ref.current!, {
      paddingLeft: '100%', // 👈 目标值
      duration: 1.5,
      ease: line3Ease,
      overwrite: true,
      paused: true,
    });
  }, []);

  useEffect(() => {
    const rect = containerRef.current!.getBoundingClientRect();

    function on_Move(e: MouseEvent | TouchEvent) {
      if(!ticked) return;
      const middleX = (e instanceof TouchEvent)?
        (e.touches[0].clientX - rect.left):
        (e.clientX - rect.left);

      let middleEffectX_sub = (middleX-startXRef.current!)/rect.width;
      if(middleEffectX_sub < 0) middleEffectX_sub *= 100;
      let middleEffectX = effectX + middleEffectX_sub;
      if(middleEffectX > 1) setEffectX(1);
      else if(middleEffectX < 0) setEffectX(0);
      else setEffectX(middleEffectX);
    }

    function on_Up(e: MouseEvent | TouchEvent) {
      if(!ticked) return;
      else setTicked(false);
      const endX = (e instanceof TouchEvent)?
        (e.touches[0].clientX - rect.left):
        (e.clientX - rect.left);
      const effect = (endX-startXRef.current!)/rect.width;
      if(effect>0.1) setEffectX(1);
      else setEffectX(initialEffectX);

      onSwipe?.(effect);
    }

    window.addEventListener('mousemove', on_Move);
    window.addEventListener('mouseup', on_Up);
    window.addEventListener('touchmove', on_Move);
    window.addEventListener('touchend', on_Up);
    return () => {
      window.removeEventListener('mousemove', on_Move);
      window.removeEventListener('mouseup', on_Up);
      window.removeEventListener('touchmove', on_Move);
      window.removeEventListener('touchend', on_Up);
    };
  }, [ticked]);

  useEffect( () => {
    gsap.to(title1tweenRef.current!,{progress: effectX});
    gsap.to(title2tweenRef.current!,{progress: effectX});
    gsap.to(title3tweenRef.current!,{progress: effectX});
  },[effectX])


  return (
    <div
      ref={containerRef}
      id="main-content"
      className="opacity-0"
    >

      <div className="relative text-gray-800 h-[50dvh] text-left tracking-wide whitespace-nowrap overflow-hidden"
        onMouseDown={(e: MouseEvent | TouchEvent) => on_Down(e)}
        onTouchStart={(e: MouseEvent | TouchEvent) => on_Down(e)}
      >
        <div
          ref = {title1Ref}
          id = "title1"
          className = {`absolute text-4xl`}
          style = {{
            bottom: `${bot_pl1[0]}%`,
            paddingLeft: `${bot_pl1[1]}%`,
          }}
        >一条<Link href='/aboutMe' className="text-blue-400">库</Link>子的网站
        </div>
        <div
          ref = {title2Ref}
          id = "title2"
          className = {`absolute text-2xl`}
          style = {{
            bottom: `${bot_pl2[0]}%`,
            paddingLeft: `${bot_pl2[1]}%`,
          }}
        >{/*奏折的形式打开*/}<FoldedPaper className='text-gray-400' 口袋='/gallery'/>和破洞
        </div>
        <div
          ref = {title3Ref}
          id = "title3"
          className = {`absolute text-xl`}
          style = {{
            bottom: `${bot_pl3[0]}%`,
            paddingLeft: `${bot_pl3[1]}%`,
          }}
        >磨裤锉
        </div>
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
