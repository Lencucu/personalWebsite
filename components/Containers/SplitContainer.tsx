'use client';

import { useState, useRef, useEffect } from 'react';
import bezierPoint from '@/ops/bezierPoint'

export default function SplitContainer({frameFront, frameBack}:{
  frameFront: React.ReactNode,
  frameBack: React.ReactNode,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingPoint, setDraggingPoint] = useState<number | null>(null);

  const Sp_Ep = [
    [[ 28/2, 0            ],[100,   0]],
    [[ 17/2, (100-70-8)/2 ],[100,  33]],
    [[ 10/2, (100-36-6)/2 ],[100,  67]],
    [[  6/2, (100-10-5)/2 ],[100, 100]],
    [[    0, 100          ],[  0,   0]],
  ];

  // 控制点初始位置（百分比）
  const [points, setPoints] = useState([
    { x: Sp_Ep[0][0][0], y: Sp_Ep[0][0][1]},
    { x: Sp_Ep[1][0][0], y: Sp_Ep[1][0][1]},
    { x: Sp_Ep[2][0][0], y: Sp_Ep[2][0][1]},
    { x: Sp_Ep[3][0][0], y: Sp_Ep[3][0][1]},
    { x: Sp_Ep[4][0][0], y: Sp_Ep[4][0][1]},
  ]);

  // 监听鼠标拖动更新控制点
  useEffect(() => {
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
        newPoints[0] = { x: bezierPoint0[0], y: bezierPoint0[1] };
        newPoints[1] = { x: bezierPoint1[0], y: bezierPoint1[1] };
        newPoints[2] = { x: bezierPoint2[0], y: bezierPoint2[1] };
        newPoints[3] = { x: bezierPoint3[0], y: bezierPoint3[1] };
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
  }/*, [draggingPoint]*/);

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

  return (
    <div
      ref={containerRef}
      className="relative w-[100dvw] h-[100dvh] overflow-hidden select-none pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
    >
      {/* 左侧，裁剪 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: leftClipPath,
          WebkitClipPath: leftClipPath,
          zIndex: 1,
        }}
      >
        {frameBack}
      </div>

      {/* 右侧，裁剪 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: rightClipPath,
          WebkitClipPath: rightClipPath,
          zIndex: 1,
        }}
      >
        {frameFront}
      </div>

      {/* 分割线 */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        // preserveAspectRatio="xMidYMid slice"
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      >
{/*        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="gray"
          strokeWidth={30}
          className="pointer-events-auto"
          vectorEffect="non-scaling-stroke"
        />*/}
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
