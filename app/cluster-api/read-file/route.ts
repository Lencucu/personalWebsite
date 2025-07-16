// app/api/cluster-api/read-file/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'notes', 'log.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content
      .split('\n')
      .map(line => line.trim());
    return NextResponse.json({ lines });
  } catch (err) {
    return NextResponse.json(
      { error: '读取文件失败', detail: String(err) },
      { status: 500 }
    );
  }
}
