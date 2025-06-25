'use client'

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map/map'), { ssr: false });

export default function DynamicMap() {
  return <Map />;
}
