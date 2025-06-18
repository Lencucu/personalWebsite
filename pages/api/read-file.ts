import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'data', 'notes', 'log.txt');

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content
      .split('\n')
      .map(line => line.trim())
      // .filter(Boolean);

    res.status(200).json({ lines });
  } catch (err) {
    res.status(500).json({ error: '读取文件失败', detail: err });
  }
}
