'use client'

import gsap from 'gsap';
import localFont from 'next/font/local';

const smileySans = localFont({
  src: './../../public/fonts/SmileySans-Oblique.ttf.woff2',
  variable: '--font-smileySans',
})

export default function MomentPiece({content,url,pos}:{
    content:string,
    url:string,
    pos:number}) {
  function show(){
    // gsap.killTweensOf(`#MomentPiece_${pos}`);
    gsap.to(`#MomentPiece_${pos}`,{
      opacity: 1,
      duration: 0.45,
      overwrite: true,
    });
  }
  function hide(){
    // gsap.killTweensOf(`#MomentPiece_${pos}`);
    gsap.to(`#MomentPiece_${pos}`,{
      opacity: 0.72,
      duration: 0.8,
      overwrite: true,
    });
  }
  return (
    <div /*style={{ left: `${5 + pos * 24}vw`}}*/
      id = {`MomentPiece_${pos}`}
      className={`relative top-[4vh] flex-shrink-0 rounded-2xl border-0 border-gray-300 overflow-hidden h-[36vh] w-[48vh] cursor-pointer opacity-72`}
      onMouseOver={show}
      onMouseOut={hide}
      onTouchStart={show}
      onTouchEnd={hide}
    >
      <iframe
        src={url}
        className="w-full h-full pointer-events-none border-0"
        frameBorder="0"
        loading="lazy"
        scrolling="no"
        onLoad={() => {
          // 可以用 isLoaded 控制隐藏 fallback
          const fallback = document.querySelector('.iframe-fallback'+pos);
          if (fallback) fallback.classList.add('hidden');
        }}
      ></iframe>
      <div className={`${smileySans.className} absolute text-center inset-0 flex items-center justify-center bg-gray-100 text-gray-500 iframe-fallback`+pos}>
        {content}
      </div>
      <a
        href={url}
        className="absolute inset-0 z-10"
        aria-label="访问网站"
      ></a>
    </div>
  );
}