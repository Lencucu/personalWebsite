import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!);

export type MapMarkerData = {
  id: string;
  lat: number;
  lng: number;
  photo_url: string;
  description: string;
};

export async function fetchMapMarkers() {
  try {
    if (!process.env.POSTGRES_URL) return;
    const sql = postgres(process.env.POSTGRES_URL);
    const data = await sql<MapMarkerData[]>`SELECT * FROM map_markers`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    return; // fallback 空数据
  }
}
