'use client'

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

type Props = {
  modelPath: string; // 本地模型文件路径（public 目录下相对路径）
};

export default function ModelViewer({ modelPath }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 场景相机渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 环境光和方向光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // 加载模型
    const loader = new GLTFLoader();
    let model: THREE.Object3D | null = null;
    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('模型加载错误:', error);
      }
    );

    // 动画循环
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (model) {
        model.rotation.y -= 0.01;
      }
      renderer.render(scene, camera);
    };
    animate();

    // 监听大小变化
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (model) scene.remove(model);
      if (renderer.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelPath]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
