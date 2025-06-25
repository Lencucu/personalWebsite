'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// 修复默认图标
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
// });

const markers = [
  {
    id: 1,
    lat: 31.2304,
    lng: 121.4737,
    photoUrl: 'https://example.com/photo1.jpg',
    description: '上海的照片',
  },
  {
    id: 2,
    lat: 39.9042,
    lng: 116.4074,
    photoUrl: 'https://example.com/photo2.jpg',
    description: '北京的照片',
  },
];

export default function Map() {
  const [mounted, setMounted] = useState(false);

  // 等待第一次客户端挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 或者返回一个 loading 占位

  return (
    <MapContainer
      center={[35, 110]}
      zoom={5}
      style={{ height: '100vh', width: '100%' }}
    >

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
{/*      <TileLayer
        url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=你的AccessToken"
        attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
        tileSize={512}
        zoomOffset={-1}
      />*/}

      {markers.map(({ id, lat, lng, photoUrl, description }) => (
        <Marker key={id} position={[lat, lng]}>
          <Popup>
            <div style={{ maxWidth: 200 }}>
              <img
                src={photoUrl}
                alt={description}
                style={{ width: '100%', borderRadius: 8 }}
              />
              <p>{description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
