"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import domtoimage from "dom-to-image-more";

type WindScatterTrianglesProps = {
  targetId: string;
  trigger: boolean;
  onEnd?: () => void;
};

export default function WindScatterTriangles({
  targetId,
  trigger,
  onEnd,
}: WindScatterTrianglesProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // 先用 html2canvas 截图元素
    domtoimage
      .toCanvas(target, {
        width: width + 1,
        backgroundColor: null,
        scale: 2,
        style: { transformOrigin: "top left" },
      })
      .then((canvas: HTMLCanvasElement) => {
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);

        const scene = new THREE.Scene();

        const camera = new THREE.OrthographicCamera(
          width / -2,
          width / 2,
          height / 2,
          height / -2,
          0.1,
          1000,
        );
        camera.position.z = 10;

        const segmentsX = width/3;
        const segmentsY = height/3;
        const geometry = new THREE.PlaneGeometry(
          width,
          height,
          segmentsX,
          segmentsY,
        );

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // 拆分三角面为独立面，方便单独控制风散
        const oldPosition = geometry.attributes.position.array;
        const oldUV = geometry.attributes.uv.array;
        const newPositions: number[] = [];
        const newUVs: number[] = [];
        const indices: number[] = [];

        for (let i = 0; i < geometry.index!.count; i += 3) {
          const ia = geometry.index!.getX(i);
          const ib = geometry.index!.getX(i + 1);
          const ic = geometry.index!.getX(i + 2);

          for (const index of [ia, ib, ic]) {
            newPositions.push(
              oldPosition[index * 3],
              oldPosition[index * 3 + 1],
              oldPosition[index * 3 + 2]
            );
            newUVs.push(oldUV[index * 2], oldUV[index * 2 + 1]);
          }
          const base = (i / 3) * 3;
          indices.push(base, base + 1, base + 2);
        }

        const newGeometry = new THREE.BufferGeometry();
        newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        newGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));
        newGeometry.setIndex(indices);

        mesh.geometry.dispose();
        mesh.geometry = newGeometry as THREE.PlaneGeometry;

        const faceCount = newGeometry.index!.count / 3;
        const positionAttr = newGeometry.attributes.position;
        const basePositions = positionAttr.array.slice();
        const velocities: Array<[number, number, number]> = [];

        for (let i = 0; i < faceCount; i++) {
          const speed = 2 + Math.random() * 4;
          const dir = new THREE.Vector3(
            (Math.random() - 0.5),
            (Math.random() - 0.5),
            (Math.random() - 0.5)
          ).normalize().multiplyScalar(speed);
          velocities.push([dir.x, dir.y, dir.z]);
        }

        let elapsed = 0;
        const duration = 5;
        const clock = new THREE.Clock();

        const animate = () => {
          const delta = clock.getDelta();
          elapsed += delta;

          for (let i = 0; i < faceCount; i++) {
            const velocity = velocities[i];
            for (let j = 0; j < 3; j++) {
              const idx = i * 9 + j * 3;
              positionAttr.array[idx] += velocity[0] * delta;
              positionAttr.array[idx + 1] += velocity[1] * delta;
              positionAttr.array[idx + 2] += velocity[2] * delta;
            }
          }
          positionAttr.needsUpdate = true;

          renderer.render(scene, camera);

          if (elapsed < duration) {
            requestAnimationFrame(animate);
          } else {
            renderer.dispose();
            texture.dispose();
            mesh.geometry.dispose();
            material.dispose();
            // mountRef.current?.removeChild(renderer.domElement);
            target.style.visibility = "visible";
            if (onEnd) onEnd();
          }
        };

        target.style.visibility = "hidden";
        if (mountRef.current) {
          while (mountRef.current.firstChild) {
            mountRef.current.removeChild(mountRef.current.firstChild);
          }
        }
        mountRef.current?.appendChild(renderer.domElement);
        animate();
      });

    return () => {
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
      const target = document.getElementById(targetId);
      if (target) target.style.visibility = "visible";
    };
  }, [trigger, targetId, onEnd]);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", pointerEvents: "none" }}
    />
  );
}
