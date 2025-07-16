'use client'

export default function getLocation(){
  let location = [0,0];
  navigator.geolocation.getCurrentPosition(
    (position) => {
      location[0] = position.coords.latitude;
      location[1] = position.coords.longitude;
    },
    (err) => {}
  );
  return location;
};