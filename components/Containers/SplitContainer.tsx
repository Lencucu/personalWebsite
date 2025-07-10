'use client';

import { useState, useRef, useEffect } from 'react';
import bezierPoint from '@/ops/bezierPoint'
import { buildPiecewiseFunction, integratePiecewise, evaluatePiecewise, PiecewiseFunction } from '@/ops/buildPiecewiseFunction';

const a1 = 1;
const b1 = 1;
const whole_k1 = 1;
const line1 = buildPiecewiseFunction(
  [0, 100],0,
  { expr: `${whole_k1}*(${a1}*x^2)`, len: 0.5, area: [-5, null] },
  { expr: `${whole_k1}*(0)`, len: 0.35, area: [0, 1] },
  { expr: `${whole_k1}*(-${b1}*x^2)`, len: 0.15, area: [null, 5] }
);
const integralLine1 = integratePiecewise([0,100],line1);

const b2 = 1;
const c2 = 1;
const d2 = 1;
const whole_k2 = 1;
const line2 = buildPiecewiseFunction(
  [0, 100],0,
  { expr: `${whole_k2}*(0)`, len: 0.1, area: [0, 1] },
  { expr: `${whole_k2}*(${b2}*x-${c2}*x^3)`, len: 0.36, area: [null, null] },
  { expr: `${whole_k2}*(0)`, len: 0.41, area: [0, 1] },
  { expr: `${whole_k2}*(-${d2}*x^2)`, len: 0.13, area: [null, 5] }
);
const integralLine2 = integratePiecewise([0,100],line2);

const a3 = 5;
const b3 = 0.4;
const c3 = 1;
const whole_k3 = 1;
const line3 = buildPiecewiseFunction(
  [0, 100],0,
  { expr: `${whole_k3}*(0)`, len: 0.23, area: [0, 1] },
  { expr: `${whole_k3}*(${a3}*x-${b3}*x^3)`, len: 0.18, area: [null, null] },
  { expr: `${whole_k3}*(0)`, len: 0.49, area: [0, 1] },
  { expr: `${whole_k3}*(-${c3}*x^2)`, len: 0.1, area: [null, 5] }
);
const integralLine3 = integratePiecewise([0,100],line3);

const a4 = 3.7;
const b4 = 0.1;
const c4 = 1;
const whole_k4 = 1;
const line4 = buildPiecewiseFunction(
  [0, 100],0,
  { expr: `${whole_k4}*(0)`, len: 0.235, area: [0, 1] },
  { expr: `${whole_k4}*(${a4}*x-${b4}*x^3)`, len: 0.25, area: [null, null] },
  { expr: `${whole_k4}*(0)`, len: 0.425, area: [0, 1] },
  { expr: `${whole_k4}*(-${c4}*x^2)`, len: 0.09, area: [null, 5] }
);
const integralLine4 = integratePiecewise([0,100],line4);

const a5_1 = 0.5;
const b5_1 = 1;
const whole_k5_1 = 1;
const line5_1 = buildPiecewiseFunction(
  [0, 100],0.08,
  { expr: `${whole_k5_1}*(1)`, len: 0.2, area: [0, 1] },
  { expr: `${whole_k5_1}*(${a5_1}*x-${b5_1}*x^3)`, len: 0.35, area: [null, null] },
  { expr: `${whole_k5_1}*(0)`, len: 0.45, area: [0, 1] },
);
const integralLine5_1 = integratePiecewise([0,100],line5_1);

const a5_2 = 0.5;
const b5_2 = 1;
const c5_2 = 1;
const d5_2 = 1;
const whole_k5_2 = 1;
const line5_2 = buildPiecewiseFunction(
  [0, 100],0,
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
    setIntegralLine5_2(integratePiecewise([0,(100-(100-bot_pl3[0]-5)/2)*7/9],line5_2));
  },[]);
  // 监听鼠标拖动更新控制点
  useEffect(() => {
    // console.log('line2');
    // console.log(line2);
    // console.log('integralLine2');
    // console.log(integralLine2);
    function on_Move(e: MouseEvent | TouchEvent) {
      if (draggingPoint === null || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let clientX_effect, clientY_effect;
      if (e instanceof TouchEvent) {
        clientX_effect = (e.touches[0].clientX - rect.left) / rect.width;
        clientY_effect = (e.touches[0].clientY - rect.top) / rect.height;
      } else {
        clientX_effect = (e.clientX - rect.left) / rect.width;
        clientY_effect = (e.clientY - rect.top) / rect.height;
      }
      const x = clientX_effect * 100;
      const y = clientY_effect * 100;
      const trans_effect = clientX_effect - Sp_Ep[draggingPoint][0][0]/100;
      setPoints((oldPoints) => {
        const newPoints = [...oldPoints];
        // newPoints[draggingPoint] = { x, y };
        const t = Math.min(trans_effect, 1);
        const bezierPoint0 = bezierPoint(Sp_Ep[0], t);
        const bezierPoint1 = bezierPoint(Sp_Ep[1], t);
        const bezierPoint2 = bezierPoint(Sp_Ep[2], t);
        const bezierPoint3 = bezierPoint(Sp_Ep[3], t);
        // newPoints[0] = { x: bezierPoint0[0], y: bezierPoint0[1] };
        // newPoints[1] = { x: bezierPoint1[0], y: bezierPoint1[1] };
        // newPoints[2] = { x: bezierPoint2[0], y: bezierPoint2[1] };
        // newPoints[3] = { x: bezierPoint3[0], y: bezierPoint3[1] };
        newPoints[0] = { x: evaluatePiecewise(integralLine1  ,x), y: Sp_Ep[0][0][1] };
        newPoints[1] = { x: evaluatePiecewise(integralLine2  ,x), y: Sp_Ep[1][0][1] };
        newPoints[2] = { x: evaluatePiecewise(integralLine3  ,x), y: Sp_Ep[2][0][1] };
        newPoints[3] = { x: evaluatePiecewise(integralLine4  ,x), y: Sp_Ep[3][0][1] };
        newPoints[4] = { x: evaluatePiecewise(integralLine5_1,x), y: Sp_Ep[4][0][1] + evaluatePiecewise(integralLine5_2,x) };
        // console.log(x+':')
        // console.log(newPoints);
        return newPoints;
      });
    }
    function on_Up() {
      setDraggingPoint(null);
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
  }, [draggingPoint]);

  // 构造左侧裁剪路径（多边形）
  const leftClipPath = `
    polygon(
      0% 0%, 
      ${points.map((p) => `${p.x}% ${p.y}%`).join(', ')}, 
      0% 100%
    )
  `;

  // 构造右侧裁剪路径（多边形，反向）
  const rightClipPath = `
    polygon(
      100% 0%, 
      100% 100%, 
      ${points.map(p => `${p.x}% ${p.y}%`).reverse().join(', ')}
    )
  `;

  function generateRightPath(points: { x: number; y: number }[]) {
    const reversed = [...points].reverse();

    let d = `M 1 0 L 1 1`;

    for (let i = 0; i < reversed.length - 1; i += 2) {
      const p0 = reversed[i];
      const p1 = reversed[i + 1];
      d += ` Q ${p0.x/100} ${p0.y/100}, ${p1.x/100} ${p1.y/100}`;
    }

    d += ` Z`;
    return d;
  }


  return (
    <div
      ref={containerRef}
      className="relative w-[100dvw] h-[100dvh] overflow-hidden select-none pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
    >
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <clipPath id="rightClipPath" clipPathUnits="objectBoundingBox">
            <path d={generateRightPath(points)} />
          </clipPath>
        </defs>
      </svg>
      {/* 左侧，裁剪 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: leftClipPath,
          WebkitClipPath: leftClipPath,
        }}
      >
        {FrameBack}
      </div>

      {/* 右侧，裁剪 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // clipPath: rightClipPath,
          // WebkitClipPath: rightClipPath,
          clipPath: 'url(#rightClipPath)',
          WebkitClipPath: 'url(#rightClipPath)',
        }}
      >
        <FrameFront
          bot_pl1 = {bot_pl1}
          bot_pl2 = {bot_pl2}
          bot_pl3 = {bot_pl3}
        />
      </div>

      {/* 分割线 */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        // preserveAspectRatio="xMidYMid slice"
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      >
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          // stroke="black"
          strokeWidth={10}
          className="pointer-events-auto stroke-fuchsia-100"
          vectorEffect="non-scaling-stroke"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={0.5}
            className="cursor-pointer pointer-events-auto stroke-10 stroke-white/30 fill-transparent"
            vectorEffect="non-scaling-stroke"
            onMouseDown={() => setDraggingPoint(i)}
            onTouchStart={() => setDraggingPoint(i)}
          />
        ))}
      </svg>
    </div>
  );
}
