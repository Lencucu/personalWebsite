'use client';

import { useState } from 'react';

export default function LocationTest() {
  const [location, setLocation] = useState<string | null>(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation(`纬度: ${lat}, 经度: ${lon}`);
      },
      (err) => {
        setLocation(`错误: ${err.message}`);
      }
    );
  };

  return (
    <div>
      <button onClick={getLocation}>获取位置</button>
      <p>{location}</p>
    </div>
  );
}
