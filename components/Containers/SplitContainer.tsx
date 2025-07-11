'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from "gsap";
type GSAPTween = gsap.core.Tween;
import bezierPoint from '@/ops/bezierPoint'
import { buildPiecewiseFunction, integratePiecewise, evaluatePiecewise, PiecewiseFunction } from '@/ops/buildPiecewiseFunction';
import {
  integralLine1,
  integralLine2,
  integralLine3,
  integralLine4,
  integralLine5_1 } from '@/ops/lines';

const a5_2 = 0.5;
const b5_2 = 1;
const c5_2 = 1;
const d5_2 = 1;
const whole_k5_2 = 1;
const line5_2 = buildPiecewiseFunction(
  [0, 1],0,
  { expr: `${whole_k5_2}*(${a5_2}*x-${b5_2}*x^3)`, len: 0.4, area: [null, null] },
  { expr: `${whole_k5_2}*(${c5_2}*x)`, len: 0.2, area: [0, 1] },
  { expr: `${whole_k5_2}*(${d5_2}*x^2)`, len: 0.4, area: [null, 5] }
);

export default function SplitContainer({
  FrameFront,
  FrameBack,
  bot_pl1 = [70,17],
  bot_pl2 = [36,10],
  bot_pl3 = [10, 7],
}:{
  FrameFront: React.ComponentType<any>,
  FrameBack: React.ReactNode,
  bot_pl1: [number,number],
  bot_pl2: [number,number],
  bot_pl3: [number,number],
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingPoint, setDraggingPoint] = useState<number | null>(null);
  const [integralLine5_2, setIntegralLine5_2] = useState<PiecewiseFunction | null>(null);
  const animProgress = useRef({ progress: 0 });
  const pointsTweenRef = useRef<GSAPTween | null>(null);

  const Sp_Ep = [// start_point end_point
    [[         28   /2    ,          0                        ],[100,                    0]],
    [[ bot_pl1[1]   /2    ,          (100-bot_pl1[0]-8)/2     ],[100, (100-bot_pl1[0]-8)/2]],
    [[ bot_pl2[1]   /2    ,          (100-bot_pl2[0]-6)/2     ],[100, (100-bot_pl2[0]-6)/2]],
    [[(bot_pl3[1]+1)/2    ,          (100-bot_pl3[0]-5)/2     ],[100, (100-bot_pl3[0]-5)/2]],
    [[(bot_pl3[1]+1)/2*7/9, 100-(100-(100-bot_pl3[0]-5)/2)*7/9],[100, (100-bot_pl3[0]-5)/2]],
    [[                   0, 100                               ],[  0,                  100]],
  ];

  // 控制点初始位置（百分比）
  const [points, setPoints] = useState([
    { x: Sp_Ep[0][0][0], y: Sp_Ep[0][0][1]},
    { x: Sp_Ep[1][0][0], y: Sp_Ep[1][0][1]},
    { x: Sp_Ep[2][0][0], y: Sp_Ep[2][0][1]},
    { x: Sp_Ep[3][0][0], y: Sp_Ep[3][0][1]},
    { x: Sp_Ep[4][0][0], y: Sp_Ep[4][0][1]},
    { x: Sp_Ep[5][0][0], y: Sp_Ep[5][0][1]},
  ]);

  useEffect(() => {
    setIntegralLine5_2(integratePiecewise([0,(100-(100-bot_pl3[0]-5)/2)/100*7/9],line5_2));
  },[]);
  useEffect(() => {
    // GSAP 动画，从0到1，持续2秒
    pointsTweenRef.current = gsap.to(animProgress.current, {
      progress: 1,
      duration: 2,
      ease: 'linear',
      overwrite: true,
      paused: true,
      onUpdate() {
        const p = this.progress(); // 当前进度 0~1
        setPoints((oldPoints) => {
          const newPoints = [...oldPoints];
          newPoints[0] = { x: evaluatePiecewise(integralLine1  ,p)*100, y: Sp_Ep[0][0][1] };
          newPoints[1] = { x: evaluatePiecewise(integralLine2  ,p)*100, y: Sp_Ep[1][0][1] };
          newPoints[2] = { x: evaluatePiecewise(integralLine3  ,p)*100, y: Sp_Ep[2][0][1] };
          newPoints[3] = { x: evaluatePiecewise(integralLine4  ,p)*100, y: Sp_Ep[3][0][1] };
          newPoints[4] = { x: evaluatePiecewise(integralLine5_1,p)*100, y: Sp_Ep[4][0][1] + (integralLine5_2 ? evaluatePiecewise(integralLine5_2, p) : 0)*100 };
          return newPoints;
        });
      },
    });
  },[integralLine5_2]);

  return (
    <div
      ref={containerRef}
      className="relative w-[100dvw] h-[100dvh] overflow-hidden select-none pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        // preserveAspectRatio="xMidYMid slice"
        className="absolute top-0 left-0 w-[100dvw] h-[100dvh] pointer-events-none z-10"
      >
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          // stroke="black"
          strokeWidth={10}
          className="pointer-events-auto stroke-fuchsia-100"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <clipPath id="leftClipPath" clipPathUnits="objectBoundingBox">
            <polygon points = {`0 0, ${
              points.map((p) => `${p.x/100} ${p.y/100}`).join(', ')
            } 0 1`}/>
            {/*<path d={generateRightPath(points)} />*/}
          </clipPath>
          <clipPath id="rightClipPath" clipPathUnits="objectBoundingBox">
            <polygon points = {`100 0, 100 100, ${
              points.map(p => `${p.x/100} ${p.y/100}`).reverse().join(', ')
            }`}/>
            {/*<path d={generateRightPath(points)} />*/}
          </clipPath>
        </defs>
      </svg>


      {/* 左侧，裁剪 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: 'url(#leftClipPath)',
          WebkitClipPath: 'url(#leftClipPath)',
        }}
      >
        {FrameBack}
      </div>
      <button
        className="
          fixed bottom-6 right-6 
          w-14 h-14 
          rounded-full 
          bg-blue-600 
          text-white 
          flex items-center justify-center 
          shadow-lg 
          hover:bg-blue-700 
          active:bg-blue-800
          transition
          z-10
          "
        aria-label="圆形按钮"
        onClick={()=>
          gsap.to(pointsTweenRef.current,{progress: 0.1})
        }
      >
        {/* 这里放按钮内容，比如图标 */}
        +
      </button>

      {/* 右侧，裁剪 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: 'url(#rightClipPath)',
          WebkitClipPath: 'url(#rightClipPath)',
        }}
      >
        <FrameFront
          // bot_pl1 = {bot_pl1}
          // bot_pl2 = {bot_pl2}
          // bot_pl3 = {bot_pl3}
          bot_pl1 = {[bot_pl1[0],0]}
          bot_pl2 = {[bot_pl2[0],0]}
          bot_pl3 = {[bot_pl3[0],0]}
          onSwipe = {(effectX: number)=>{
            if(pointsTweenRef.current)
              gsap.to(pointsTweenRef.current,{progress: effectX});
          }}
        />
      </div>
    </div>
  );
}
