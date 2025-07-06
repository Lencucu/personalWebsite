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
  try{
    const data = await sql<MapMarkerData[]>`
      SELECT *
      FROM map_markers`;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the MapMarkers data.');
  }
}