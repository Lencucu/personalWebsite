'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from "gsap";
type GSAPTween = gsap.core.Tween;
import bezierPoint from '@/lib/mathematicalLib/bezierPoint'
import { buildPiecewiseFunction, integratePiecewiseAsFunctions, /*integratePiecewise, evaluatePiecewise, */evaluatePiecewiseFunctions, FnPiecewiseFunction/*, PiecewiseFunction*/ } from '@/lib/mathematicalLib/buildPiecewiseFunction';
import {
  integralLine1Function,
  integralLine2Function,
  integralLine3Function,
  integralLine4Function,
  integralLine5_1Function,
  line5_2 } from '@/lib/mathematicalLib/lines';

export default function SplitContainer({
  FrameFront,
  FrameBack,
  bot_pl1 = [70,17],
  bot_pl2 = [36,10],
  bot_pl3 = [10, 7],
  leftSideWidth_distn = [0.07,0.07],
}:{
  FrameFront: React.ComponentType<any>,
  FrameBack: React.ReactNode,
  bot_pl1?: [number,number],
  bot_pl2?: [number,number],
  bot_pl3?: [number,number],
  leftSideWidth_distn?: [number,number],
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingPoint, setDraggingPoint] = useState<number | null>(null);
  const [integralLine5_2Function, setIntegralLine5_2Function] = useState<FnPiecewiseFunction | null>(null);
  const animProgress = useRef({ progress: 0 });
  const pointsTweenRef = useRef<GSAPTween | null>(null);
  const [shouleGoBack, setShouleGoBack] = useState<boolean>(false);

  const valuesY = [// start_point end_point
                                0     ,
             (100-bot_pl1[0]-8)/2     ,
             (100-bot_pl2[0]-6)/2     ,
             (100-bot_pl3[0]-5)/2     ,
    100-(100-(100-bot_pl3[0]-5)/2)*7/9,
  ];

  // 控制点初始位置（百分比）
  const [points, setPoints] = useState([
    { x: 0, y: valuesY[0]},
    { x: 0, y: valuesY[1]},
    { x: 0, y: valuesY[2]},
    { x: 0, y: valuesY[3]},
    { x: 0, y: valuesY[4]},
    { x: 0, y:        100},
  ]);

  useEffect(() => {
    if(shouleGoBack) setShouleGoBack(false);
  },[shouleGoBack]);

  useEffect(() => {
    // setIntegralLine5_2(integratePiecewise([0,(100-(100-bot_pl3[0]-5)/2)/100*7/9],line5_2));
    setIntegralLine5_2Function(integratePiecewiseAsFunctions([0,(100-(100-bot_pl3[0]-5)/2)/100*7/9],line5_2));
  },[]);
  useEffect(() => {
    if(!integralLine5_2Function) return;
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
          newPoints[0].x = evaluatePiecewiseFunctions(integralLine1Function  ,p)*100;
          newPoints[1].x = evaluatePiecewiseFunctions(integralLine2Function  ,p)*100;
          newPoints[2].x = evaluatePiecewiseFunctions(integralLine3Function  ,p)*100;
          newPoints[3].x = evaluatePiecewiseFunctions(integralLine4Function  ,p)*100;
          newPoints[4] = { x: evaluatePiecewiseFunctions(integralLine5_1Function,p)*100, y: valuesY[4] + evaluatePiecewiseFunctions(integralLine5_2Function, p)*100 };
          return newPoints;
        });
      },
    });
    gsap.to(pointsTweenRef.current,{progress: leftSideWidth_distn[0]});
  },[integralLine5_2Function]);

  return (
    <div
      ref={containerRef}
      className="relative w-[100dvw] h-[100dvh] overflow-hidden select-none pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        // preserveAspectRatio="xMidYMid slice"
        className="absolute top-0 left-0 w-[100dvw] h-[100dvh] pointer-events-none z-20"
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
          {/*<path d={generateRightPath(points)} />*/}
          {/*<path d={generateRightPath(points)} />*/}
{/*          <clipPath id="leftCut" clipPathUnits="objectBoundingBox">
            <polygon points = {`0 0, ${
              points.map((p) => `${p.x/100} ${p.y/100}`).join(', ')
            } 0 1`}/>
          </clipPath>
          <clipPath id="rightCut" clipPathUnits="objectBoundingBox">
            <polygon points = {`1 0, 1 1, ${
              points.map(p => `${p.x/100} ${p.y/100}`).reverse().join(', ')
            }`}/>
          </clipPath>*/}
          <mask id="leftCut" maskContentUnits="objectBoundingBox"/* maskUnits="objectBoundingBox"*/>
            <polygon
              points={`0 0, ${points.map((p) => `${p.x / 100} ${p.y / 100}`).join(', ')}, 0 1`}
              fill="white"
            />
          </mask>

          <mask id="rightCut" maskContentUnits="objectBoundingBox"/* maskUnits="objectBoundingBox"*/>
            <polygon
              points={`1 0, 1 1, ${points
                .map((p) => `${p.x / 100} ${p.y / 100}`)
                .reverse()
                .join(', ')}`}
              fill="white"
            />
          </mask>
        </defs>
      </svg>


      {/* 左侧，裁剪 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // clipPath: 'url(#leftCut)',
          // WebkitClipPath: 'url(#leftCut)',
          mask: 'url(#leftCut)',
          WebkitMask: 'url(#leftCut)',
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
          z-20
          "
        aria-label="圆形按钮"
        onClick={()=>setShouleGoBack(true)}
      >
        {/* 这里放按钮内容，比如图标 */}
        +
      </button>

      {/* 右侧，裁剪 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // clipPath: 'url(#rightCut)',
          // WebkitClipPath: 'url(#rightCut)',
          mask: 'url(#rightCut)',
          WebkitMask: 'url(#rightCut)',
        }}
        className = "z-10"// pointer-events-none
      >
        <FrameFront
          bot_pl1 = {bot_pl1}
          bot_pl2 = {bot_pl2}
          bot_pl3 = {bot_pl3}
          leftSideWidth_distn = {leftSideWidth_distn}
          shouleGoBack = {shouleGoBack}
          onSwipe = {(effectX: number)=>{
            if(pointsTweenRef.current)
              gsap.to(pointsTweenRef.current,{progress: effectX});
          }}
        />
      </div>
    </div>
  );
}
