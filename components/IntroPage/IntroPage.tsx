'use client'

import Link from 'next/link';
import gsap from "gsap";
type GSAPTween = gsap.core.Tween;
import { useEffect, useState, useRef } from 'react'

import '@/app/global.css';
import FoldedPaper from '@/components/foldedPaper/foldedPaper';
import Moments from '@/components/moment/moment';
import { line1Ease, line2Ease, line3Ease } from '@/lib/mathematicalLib/lines';
import { titleBlack } from '@/app/fonts';

export default function HomePage({
  bot_pl1 = [70,17],
  bot_pl2 = [36,10],
  bot_pl3 = [10, 7],
  leftSideWidth_distn = [0.12,0.05],
  shouleGoBack = false,
  onSwipe = ()=>{},
}:{
  bot_pl1?: [number,number],
  bot_pl2?: [number,number],
  bot_pl3?: [number,number],
  leftSideWidth_distn?: [number,number],
  shouleGoBack?: boolean,
  onSwipe?: (ratio: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const title3Ref = useRef<HTMLDivElement>(null);
  const [ticked, setTicked] = useState(false);
  const startXRef = useRef<number | null>(null);
  const title1TweenRef = useRef<GSAPTween | null>(null);
  const title2TweenRef = useRef<GSAPTween | null>(null);
  const title3TweenRef = useRef<GSAPTween | null>(null);

  const initialEffectX = leftSideWidth_distn[0] + leftSideWidth_distn[1];
  const [effectX, setEffectX] = useState<number | null>(null);
  const effectXRef_start = useRef<number | null>(null);

  const [lastMoveLen, setLastMoveLen] = useState<number>(0);

  function on_Down(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
    if (!ticked) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setTicked(true);
      startXRef.current = 'touches' in e
        ? e.touches[0].clientX - rect.left
        : e.clientX - rect.left;
      effectXRef_start.current = effectX;
    }
  }

  useEffect( () =>{
    if(shouleGoBack)
      setEffectX(initialEffectX);
  });

  useEffect( () => {
    setEffectX(initialEffectX);
    gsap.to("#main-content", {
      opacity: 1,
      duration: 1,
    });
    title1TweenRef.current = gsap.to(title1Ref.current!, {
      paddingLeft: '100%', // 👈 目标值
      duration: 2.5,
      ease: line1Ease,
      overwrite: true,
      paused: true,
    });
    title2TweenRef.current = gsap.to(title2Ref.current!, {
      paddingLeft: '100%', // 👈 目标值
      duration: 2.5,
      ease: line2Ease,
      overwrite: true,
      paused: true,
    });
    title3TweenRef.current = gsap.to(title3Ref.current!, {
      paddingLeft: '100%', // 👈 目标值
      duration: 2.5,
      ease: line3Ease,
      overwrite: true,
      paused: true,
    });
  }, []);

  useEffect( () => {
    const rect = containerRef.current!.getBoundingClientRect();
    function on_Up(e: MouseEvent | TouchEvent) {
      if(!ticked) return;
      else setTicked(false);
      const endX = (e instanceof TouchEvent)?
        (e.changedTouches[0].clientX - rect.left):
        (e.clientX - rect.left);
      const effect = (endX-startXRef.current!)/rect.width;
      if(lastMoveLen>0 && effect>0.1) setEffectX(1);
      else setEffectX(initialEffectX);
    }

    window.addEventListener('mouseup', on_Up);
    window.addEventListener('touchend', on_Up);
    return () => {
      window.removeEventListener('mouseup', on_Up);
      window.removeEventListener('touchend', on_Up);
    };
  }, [ticked]);

  useEffect( () => {
    const rect = containerRef.current!.getBoundingClientRect();
    function on_Move(e: MouseEvent | TouchEvent) {
      if(!ticked) return;
      const middleX = (e instanceof TouchEvent)?
        (e.touches[0].clientX - rect.left):
        (e.clientX - rect.left);

      let middleEffectX = effectXRef_start.current! + (middleX-startXRef.current!)/rect.width;
      // console.log(middleEffectX - effectXRef_start.current);
      if(middleEffectX > 1) setEffectX(1);
      else if(middleEffectX < 0) setEffectX(0);
      else setEffectX(middleEffectX);
      setLastMoveLen(middleEffectX - effectX!);
    }

    window.addEventListener('mousemove', on_Move);
    window.addEventListener('touchmove', on_Move);
    return () => {
      window.removeEventListener('mousemove', on_Move);
      window.removeEventListener('touchmove', on_Move);
    }
  },[ticked, lastMoveLen]);

  useEffect( () => {
    let distn = effectX! - initialEffectX;
    if(distn > 0)
      distn = distn/(1 - initialEffectX)*(1 - leftSideWidth_distn[0]);
    else
      distn = distn/initialEffectX*leftSideWidth_distn[0];
    onSwipe?.(leftSideWidth_distn[0] + distn);
    gsap.to(title1TweenRef.current!,{progress: effectX!});
    gsap.to(title2TweenRef.current!,{progress: effectX!});
    gsap.to(title3TweenRef.current!,{progress: effectX!});
  },[effectX])


  return (
    <div
      ref={containerRef}
      id="main-content"
      className="opacity-0"
    >

      <div className={`${titleBlack.className} relative text-gray-800 h-[50dvh] text-left tracking-wide whitespace-nowrap overflow-hidden`}
        onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => on_Down(e)}
        onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => on_Down(e)}
      >
        <div
          ref = {title1Ref}
          id = "title1"
          className = {`absolute text-4xl`}
          style = {{
            bottom: `${bot_pl1[0]}%`,
            // paddingLeft: `${bot_pl1[1]}%`,
          }}
        >一条<Link href='/aboutMe' className="text-blue-400">库</Link>子的网站
        </div>
        <div
          ref = {title2Ref}
          id = "title2"
          className = {`absolute text-2xl`}
          style = {{
            bottom: `${bot_pl2[0]}%`,
            // paddingLeft: `${bot_pl2[1]}%`,
          }}
        >{/*奏折的形式打开*/}<FoldedPaper className='text-gray-400' 口袋='/gallery'/>和破洞
        </div>
        <div
          ref = {title3Ref}
          id = "title3"
          className = {`absolute text-xl`}
          style = {{
            bottom: `${bot_pl3[0]}%`,
            // paddingLeft: `${bot_pl3[1]}%`,
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

      <div className={`absolute pl-[06%] bottom-[01.5%] text-gray-200 space-x-1 flex`}>
        <span>Tests</span><span>|</span>
        <Link href='/test'>page</Link>
        <a href='/game_test/what.html'>game</a>
      </div>

    </div>
  );
}
