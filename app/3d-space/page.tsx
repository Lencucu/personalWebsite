'use client'; // 如果你在 Next.js 中使用

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function GemViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [faceIndex, setFaceIndex] = useState<number | null>(null);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5);


    // const onClick = (event: MouseEvent) => {
    //   if (!mountRef.current) return;

    //   // 将鼠标坐标从屏幕像素转换为 NDC（-1 ~ 1）
    //   const rect = mountRef.current.getBoundingClientRect();
    //   mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    //   mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    //   // 设置光线投射
    //   raycaster.setFromCamera(mouse, camera);

    //   // 检测交叉物体
    //   const intersects = raycaster.intersectObject(gem, true);
    //   if (intersects.length > 0) {
    //     const intersect = intersects[0];

    //     // 输出面索引
    //     // console.log("点击到的面 index:", intersect.faceIndex);
    //     // console.log("对应的三个顶点索引:", intersect.face?.a, intersect.face?.b, intersect.face?.c);
    //     // 可触发选中/高亮等逻辑

    //     setFaceIndex(intersect.faceIndex);
    //   }
    // };

    // mountRef.current.addEventListener('click', onClick);

    // function getVertexIndicesFromFaceIndex(geometry: THREE.BufferGeometry, faceIndex: number) {
    //   const index = geometry.index;
    //   if (index) {
    //     // 使用索引的情况
    //     const a = index.getX(faceIndex * 3);
    //     const b = index.getX(faceIndex * 3 + 1);
    //     const c = index.getX(faceIndex * 3 + 2);
    //     return [a, b, c];
    //   } else {
    //     // 非索引几何体，点索引就是顺序来的
    //     const a = faceIndex * 3;
    //     const b = faceIndex * 3 + 1;
    //     const c = faceIndex * 3 + 2;
    //     return [a, b, c];
    //   }
    // }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const geometry = new THREE.OctahedronGeometry(1, 4);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      transmission: 1.0,
      thickness: 1.0,
      roughness: 0,
      metalness: 0,
      ior: 2.4,
      specularIntensity: 1,
      envMapIntensity: 2,
      clearcoat: 1,
      clearcoatRoughness: 0,
      side: THREE.DoubleSide,
    });
    const gem = new THREE.Mesh(geometry, material);
    scene.add(gem);

    // 保存原始顶点位置
    const positionAttribute = geometry.attributes.position;
    const normalAttribute = geometry.attributes.normal;
    const vertexCount = positionAttribute.count;
    const originalPositions = new Float32Array(positionAttribute.array);

    let frameId: number;
    const clock = new THREE.Clock();

    // 波参数
    const amplitude = 0.05; // 振幅大小
    const wavelength = 1; // 波长（越大波越慢）
    const speed = 1; // 传播速度

    const animate = () => {
      const time = clock.getElapsedTime();

      for (let i = 0; i < vertexCount / 3; i++) {
        const ox0 = originalPositions[i * 9 + 0];
        const oy0 = originalPositions[i * 9 + 1];
        const oz0 = originalPositions[i * 9 + 2];
        const ox1 = originalPositions[i * 9 + 3];
        const oy1 = originalPositions[i * 9 + 4];
        const oz1 = originalPositions[i * 9 + 5];
        const ox2 = originalPositions[i * 9 + 6];
        const oy2 = originalPositions[i * 9 + 7];
        const oz2 = originalPositions[i * 9 + 8];

        const nx = normalAttribute.getX(i * 3);
        const ny = normalAttribute.getY(i * 3);
        const nz = normalAttribute.getZ(i * 3);

        const oy = (oy0 + oy1 + oy2) / 3;

        // 选取波传播的空间坐标轴，这里用顶点的 y 坐标做空间变量
        const wavePhase = (oy / wavelength) - speed * time;

        // 计算位移量，波形沿法线方向
        const offset = amplitude * Math.sin(wavePhase * Math.PI * 2);

        // 新位置 = 原始位置 + 法线 * 偏移量
        positionAttribute.setXYZ(i * 3 + 0,
          ox0 + nx * offset,
          oy0 + ny * offset,
          oz0 + nz * offset
        );
        positionAttribute.setXYZ(i * 3 + 1,
          ox1 + nx * offset,
          oy1 + ny * offset,
          oz1 + nz * offset
        );
        positionAttribute.setXYZ(i * 3 + 2,
          ox2 + nx * offset,
          oy2 + ny * offset,
          oz2 + nz * offset
        );
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();

      gem.rotation.y += 0.0025 + (Math.random() - 0.5) * 0.0003; // [0, 1)
      gem.rotation.x += 0.0025 + (Math.random() - 0.5) * 0.0003;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      mountRef.current?.removeChild(renderer.domElement);
      mountRef.current?.removeEventListener('click', onClick);
    };
  }/*, []*/);


  return <div ref={mountRef} className='w-[100dvw] h-[100dvh] overflow-hidden' />;
}
