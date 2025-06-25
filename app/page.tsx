'use client';
import { useState, useRef, useEffect } from 'react';
import DynamicMap from '@/components/map/dynamic-map'
import Home from '@/components/main/home'

export default function ImageCompareSplit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingPoint, setDraggingPoint] = useState<number | null>(null);

  // 控制点初始位置（百分比）
  const [points, setPoints] = useState([
    { x: 28/2, y: 0 },
    { x: 17/2, y: (100-70-8)/2 },
    { x: 10/2, y: (100-36-6)/2 },
    { x: 6/2, y: (100-10-5)/2 },
    { x: 0, y: 100 },
  ]);

  // 监听鼠标拖动更新控制点
  useEffect(() => {
    function onMouseMove(e: MouseEvent | TouchEvent) {
      if (draggingPoint === null || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let clientX, clientY;
      if (e instanceof TouchEvent) {
        clientX = (e.touches[0].clientX - rect.left) / rect.width * 100;
        clientY = (e.touches[0].clientY - rect.top) / rect.height * 100;
      } else {
        clientX = (e.clientX - rect.left) / rect.width * 100;
        clientY = (e.clientY - rect.top) / rect.height * 100;
      }
      const x = clientX;
      const y = clientY;
      setPoints((oldPoints) => {
        const newPoints = [...oldPoints];
        newPoints[draggingPoint] = { x, y };
        return newPoints;
      });
    }
    function onMouseUp() {
      setDraggingPoint(null);
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
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
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', userSelect: 'none' }}
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
        <DynamicMap />
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
        <Home />
      </div>

      {/* 分割线 */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      >
{/*        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="white"
          strokeWidth={3}
          className="pointer-events-auto"
        />
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="black"
          strokeWidth={1}
          className="pointer-events-auto"
        />*/}

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={1.15}
            fill="skyblue"
            stroke="white"
            strokeWidth={0.2}
            className="cursor-pointer pointer-events-auto"
            onMouseDown={() => setDraggingPoint(i)}
            onTouchStart={() => setDraggingPoint(i)}
          />
        ))}
      </svg>
    </div>
  );
}
