import { useRef } from 'react';
import Map from 'react-bmapgl/Map';
import Marker from 'react-bmapgl/Overlay/Marker';
export default () => {
  const mapRef = useRef<any>();
  console.log(BMapGL);
  const center = new BMapGL.Point(116.404449, 39.914889);
  const position = new BMapGL.Point(116.402544, 39.928216);

  return (
    <Map ref={() => mapRef} style={{ height: 450 }} center={center} zoom={12}>
      {/* <Marker position={position} enableDragging icon={"simple_red"} ref={mapRef}/> */}
    </Map>
  );
};
