'use client'

import Link from 'next/link';
import gsap from "gsap";
type GSAPTween = gsap.core.Tween;
import { useEffect, useState, useRef } from 'react'

import '@/app/global.css';
import FoldedPaper from '~/component/foldedPaper/foldedPaper';
import Moments from '~/component/moment/moment';
import { line1Ease, line2Ease, line3Ease } from '~/lib/mathematicalLib/lines';
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
  leftSideWidth_distn?: [number, number],
  shouleGoBack?: boolean,
  onSwipe?: (ratio: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const title3Ref = useRef<HTMLDivElement>(null);
  const [inDragging, setInDragging] = useState(false);
  const posX_start_Ref = useRef<number | null>(null);
  const title1TweenRef = useRef<GSAPTween | null>(null);
  const title2TweenRef = useRef<GSAPTween | null>(null);
  const title3TweenRef = useRef<GSAPTween | null>(null);

  const effectX_default = leftSideWidth_distn[0] + leftSideWidth_distn[1];
  const [effectX, setEffectX] = useState<number | null>(null);
  const effectX_start_Ref = useRef<number | null>(null);

  const lastPos = useRef<number>(0);
  const lastLastPos = useRef<number>(lastPos.current);

  function on_Down(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
    if(inDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setInDragging(true);
    posX_start_Ref.current = 'touches' in e
      ? (e.touches[0].clientX - rect.left)
      : (e.clientX - rect.left);
    effectX_start_Ref.current = effectX;
    lastPos.current = effectX ?? effectX_default;
    lastLastPos.current! = lastPos.current!;
    // 注意两个值的区别，第一个是记录点击时effect的实时进度值，第二、三个是记录滑动时的鼠标实时位置以及实时前一刻的位置
  }

  useEffect( () =>{
    if(shouleGoBack)
      setEffectX(effectX_default);
  });

  useEffect( () => {
    setEffectX(effectX_default);
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
      if(!inDragging) return;
      else setInDragging(false);
      const posX_end = (e instanceof TouchEvent)?
        (e.changedTouches[0].clientX - rect.left):
        (e.clientX - rect.left);

      const effect = (posX_end - posX_start_Ref.current!)/rect.width;
      // 判断最后是否有微左滑，因为结尾微左滑一般意味着浏览者想撤销拉开的操作
      // 就算没有微左滑，如果只移动一点点，也意味着不确定，此时也不执行拉开操作
      if(lastPos.current!>lastLastPos.current! && effect>0.1) setEffectX(1);
      else setEffectX(effectX_default);
    }
    function on_Move(e: MouseEvent | TouchEvent) {
      if(!inDragging) return;
      const posX_tmp = (e instanceof TouchEvent)?
        (e.touches[0].clientX - rect.left):
        (e.clientX - rect.left);

      // 这里第一个加数代表点击时effect的值（这里并不是所期望的实时动画过程中effect的值，而是动画终点值，还待完善）
      // 第二个加数是移动量
      let effectX_tmp = effectX_start_Ref.current! + (posX_tmp-posX_start_Ref.current!)/rect.width;
      setEffectX(
        effectX_tmp>1? 1:
        (effectX_tmp<0? 0:effectX_tmp)
        );
      // 备份前一刻位置以及记录实时位置
      lastLastPos.current! = lastPos.current!;
      lastPos.current! = effectX_tmp;
    }

    window.addEventListener('mousemove', on_Move);
    window.addEventListener('touchmove', on_Move);
    window.addEventListener('mouseup', on_Up);
    window.addEventListener('touchend', on_Up);
    return () => {
      window.removeEventListener('mousemove', on_Move);
      window.removeEventListener('touchmove', on_Move);
      window.removeEventListener('mouseup', on_Up);
      window.removeEventListener('touchend', on_Up);
    }
  },[inDragging]);

  useEffect( () => {
    let distn = effectX! - effectX_default;
    if(distn > 0)
      distn = distn/(1 - effectX_default)*(1 - leftSideWidth_distn[0]);
    else
      distn = distn/effectX_default*leftSideWidth_distn[0];
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

      <div className="relative pl-[6%] h-[50dvh] w-[94%] flex space-x-6 overflow-x-auto scrollbar-hide"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 60%, black 90%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 60%, black 90%, transparent 100%)',
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
