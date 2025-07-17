import DynamicMap from './dynamic-map';

import { fetchMapMarkers } from './map_sql';

export default async function MainMapCom() {
  const mapmarkers = await fetchMapMarkers();
  return <DynamicMap mapmarkers={mapmarkers}/>;
}