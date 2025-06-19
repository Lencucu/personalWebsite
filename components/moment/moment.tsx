'use client'

import { useEffect, useState } from 'react';
import MomentPiece from '@/components/moment/moment-piece'

export default function Moments() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/read-file')
      .then(res => res.json())
      .then(data => setLines(data.lines || []));
  }, []);

  return lines.reduce<string[]>((acc, line, idx) => {
      if (idx % 2 === 0) {
        // 偶数索引开始合并两条
        acc.push(lines[idx] + (lines[idx + 1] ? (' ' + lines[idx + 1]) : ''));
      }
      return acc;
    }, []).map((combinedLine, idx, arr) => (
    <MomentPiece key={idx} pos={arr.length-1-idx} content={combinedLine.split(' ')[0]} url={combinedLine.split(' ')[1]}/>
  )).reverse();
}
