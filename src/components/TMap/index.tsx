import { getGeocoder } from '@/api/TMap';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import styles from './styles.less';
const qq = window.qq;
type Props = {
  address: string;
  setLatLng(lat, lng): void;
};
export default (props: Props) => {
  const [inputValue, setInputValue] = useState<string>(props.address);
  const [map, setMap] = useState<any>();
  useEffect(() => {
    const map = new qq.maps.Map(document.getElementById('TMap'), {
      // 地图的中心地理坐标。
      center: new qq.maps.LatLng(22.53332, 113.93041),
      zoom: 10,
      zoomControlOptions: {
        position: qq.maps.ControlPosition.BOTTOM_RIGHT,
      },
      panControlOptions: {
        //设置控件位置相对右下角对齐，向左排列
        position: qq.maps.ControlPosition.BOTTOM_RIGHT,
      },
    });
    setMap(map);
  }, []);
  useEffect(() => {
    setInputValue(props.address);
    if (map && props.address) {
      // todo:事件节流
      getGeocoder(props.address).then((res) => {
        if (res.code == 0 && res.data.status == 0) {
          const result = res.data.result;
          let zoom = 16;
          if (result.title == result.address_components.province) zoom = 5;
          if (result.title == result.address_components.city) zoom = 10;
          if (result.title == result.address_components.district) zoom = 12;
          map.setOptions({
            center: new qq.maps.LatLng(
              result.location.lat,
              result.location.lng,
            ),
            zoom,
          });
        }
      });
    }
  }, [props.address]);
  return (
    <div
      style={{ width: 735, height: 450 }}
      className={styles.mapContent}
      id="TMap"
    >
      <div className={styles.searchContent}>
        <Input
          placeholder="搜索地址"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      </div>
    </div>
  );
};
