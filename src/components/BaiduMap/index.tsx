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
    var map = new BMapGL.Map('baidu-map'); // 创建地图实例
    var point = new BMapGL.Point(116.404, 39.915); // 创建点坐标
    map.centerAndZoom(point, 15);
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
        </div>
        <div id="baidu-map" style={{ height: 450, width: 735 }}></div>
      </div>
    );
  }
}

// export default MapApiLoaderHOC({ ak: 'WahIhIS6713Mxfc34t1PI759xGfOorQM' })(BdiduMap)
