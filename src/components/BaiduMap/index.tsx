import React from 'react';
import {
  Map,
  Marker,
  ScaleControl,
  ZoomControl,
  AutoComplete,
  NavigationControl,
  InfoWindow,
  MapApiLoaderHOC,
} from 'react-bmapgl';
type Props = {
  longitude?: string;
  latitude?: string;
};
export default class BdiduMap extends React.Component<Props> {
  map: BMapGL.Map | null | undefined = null;
  render() {
    const { longitude, latitude } = this.props;
    console.log(longitude, latitude);
    const lat = latitude || 39.928216;
    const lng = longitude || 116.402544;
    const center = new BMapGL.Point(+lng, +lat);
    const position = new BMapGL.Point(+lng, +lat);
    return (
      <Map
        ref={(ref) => {
          this.map = ref?.map;
        }}
        center={center}
        zoom={11}
        style={{ height: 450, width: 552 }}
      >
        <Marker
          position={position}
          enableDragging
          icon={'simple_red'}
          map={this.map as BMapGL.Map}
        />
        <ScaleControl map={this.map as BMapGL.Map} />
        <ZoomControl map={this.map as BMapGL.Map} />
        <AutoComplete
          input="ac"
          onHighlight={(e) => {
            console.log(e);
          }}
          onConfirm={(e) => {
            console.log(e);
          }}
          onSearchComplete={(e) => {
            console.log(e);
          }}
        />
        <input id="ac" />
        {/* <NavigationControl />  */}
        {/* <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/> */}
      </Map>
    );
  }
}

// export default MapApiLoaderHOC({ ak: 'WahIhIS6713Mxfc34t1PI759xGfOorQM' })(BdiduMap)
