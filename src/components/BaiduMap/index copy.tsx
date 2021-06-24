import React from 'react';
import { Input } from 'antd';
import styles from './styles.less';
import {
  Map,
  Marker,
  ScaleControl,
  ZoomControl,
  AutoComplete,
  MapApiLoaderHOC,
} from 'react-bmapgl';
type Props = {
  longitude?: string;
  latitude?: string;
  province?: string;
  city?: string;
};
export default class BdiduMap extends React.Component<Props> {
  map: BMapGL.Map | null | undefined = null;
  componentDidMount() {
    console.log(BMapGL.Geolocation);
    // var geolocationControl = new window.BMapGL.GeolocationControl();
    // this.map?.addControl(geolocationControl)
  }
  render() {
    const { longitude, latitude, province, city } = this.props;
    console.log(province, city);
    const lat = latitude || 39.928216;
    const lng = longitude || 116.402544;
    const center = new BMapGL.Point(+lng, +lat);
    const position = new BMapGL.Point(+lng, +lat);
    return (
      <div className={styles.mapContent}>
        <div className={styles.searchContent}>
          <Input placeholder="搜索地址" id="ac" />
          <AutoComplete
            input="ac"
            location={province || city || ''}
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
        </div>
        <Map
          enableScrollWheelZoom
          enableDoubleClickZoom
          enableTilt
          zoom={18}
          ref={(ref) => {
            this.map = ref?.map;
          }}
          center={center}
          style={{ height: 450, width: 735 }}
        >
          <Marker
            position={position}
            enableDragging
            icon={'simple_red'}
            map={this.map as BMapGL.Map}
          />
          <ScaleControl map={this.map as BMapGL.Map} />
          <ZoomControl map={this.map as BMapGL.Map} />

          {/* <NavigationControl />  */}
          {/* <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/> */}
        </Map>
      </div>
    );
  }
}

// export default MapApiLoaderHOC({ ak: 'WahIhIS6713Mxfc34t1PI759xGfOorQM' })(BdiduMap)
