'use client'

import getLocation from '@/lib/getLocation'

export default function LocationTest() {
  return (
    <div>
      <p>`x:${getLocation()[0]}, y:${getLocation()[1]}`</p>
    </div>
  );
}
