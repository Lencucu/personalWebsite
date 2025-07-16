'use client';

import { useEffect, useState } from 'react';
import { Suspense } from 'react';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import { MapMarkerData } from './map_sql';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/marker-icon-2x.png',
  iconUrl: 'leaflet/marker-icon.png',
  shadowUrl: 'leaflet/marker-shadow.png',
});

// 修复默认图标
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
// });

const markers_template = [
  {
    id: 1,
    lat: 31.2304,
    lng: 121.4737,
    photo_url: 'https://example.com/photo1.jpg',
    description: '上海的照片',
  },
  {
    id: 2,
    lat: 39.9042,
    lng: 116.4074,
    photo_url: 'https://example.com/photo2.jpg',
    description: '北京的照片',
  },
];

function OffsetCenter({ targetLatLng, offsetXPercent, offsetYPercent }:{
  targetLatLng: L.LatLng,
  offsetXPercent: number,
  offsetYPercent: number
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const size = map.getSize(); // 地图容器大小，单位像素
    const targetPoint = map.latLngToContainerPoint(targetLatLng); // 目标点的屏幕坐标

    // 目标点想放在屏幕的百分比位置，计算目标屏幕坐标
    const targetScreenPoint = L.point(
      size.x * offsetXPercent,
      size.x * offsetYPercent
    );

    // 计算偏移量（像素）
    const offset = targetPoint.subtract(targetScreenPoint);

    // 计算新的中心点对应的经纬度
    const centerPoint = map.latLngToContainerPoint(map.getCenter());
    const newCenterPoint = centerPoint.add(offset);
    const newCenterLatLng = map.containerPointToLatLng(newCenterPoint);

    map.setView(newCenterLatLng, map.getZoom());
  }, [map, targetLatLng, offsetXPercent, offsetYPercent]);

  return null;
}

export default function Map({mapmarkers}: {mapmarkers: MapMarkerData[]}) {
  const [mounted, setMounted] = useState(false);
  const markers = mapmarkers || markers_template;

  // 等待第一次客户端挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 或者返回一个 loading 占位

  return (
    <MapContainer
      center={[mapmarkers[0].lat+0.329, mapmarkers[0].lng+0.3715]}
      zoom={5}
      style={{ height: '100dvh', width: '100%' }}
      zoomControl={false}
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

      <Suspense>
        {markers.map(({ id, lat, lng, photo_url, description }) => (
          <Marker key={id} position={[lat+0.329, lng+0.3715]}>
            <Popup>
              <div style={{ maxWidth: 200 }}>
                <a href={photo_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={photo_url}
                    alt={description}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </a>
                <p>{description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </Suspense>
      <OffsetCenter
        targetLatLng = {L.latLng(mapmarkers[0].lat+0.329, mapmarkers[0].lng+0.3715)}
        offsetXPercent = {0.04}
        offsetYPercent = {0.06}
      />
    </MapContainer>
  );
}
