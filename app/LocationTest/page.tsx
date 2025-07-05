'use client'

export default function LocationTestPage(){
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          document.getElementById("output").innerText =
            `纬度: ${lat}, 经度: ${lon}`;
        },
        (err) => {
          document.getElementById("output").innerText =
            `定位失败：${err.message}`;
        },
        {
          enableHighAccuracy: true, // 尽量使用 GPS
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      document.getElementById("output").innerText = "浏览器不支持定位";
    }
  };
  return (
    <div>
      <button onClick={getLocation}>获取位置</button>
      <p id="output"></p>
    </div>
    );
};

{/*  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("成功", position.coords.latitude, position.coords.longitude);
    },
    (err) => {
      console.error("失败", err); // 一定要加上这个才能看出失败信息
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
    }
  );*/}
