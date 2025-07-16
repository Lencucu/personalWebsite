'use client'

import dynamic from 'next/dynamic';
import { MapMarkerData } from './map_sql';

const Map = dynamic(() => import('~/component/map/map'), { ssr: false });

export default function DynamicMap({mapmarkers}:{mapmarkers: MapMarkerData[]}) {
  return <Map mapmarkers={mapmarkers}/>;
}
