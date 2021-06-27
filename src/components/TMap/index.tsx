import { getGeocoder } from '@/api/TMap';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import styles from './styles.less';
import { debounce } from 'lodash';
const qq = window.qq;
type Props = {
  address: string;
  setLatLng(lat, lng): void;
  lat?: string;
  lng?: string;
};
const DefauleLatLng = {
  lat: '22.53332',
  lng: '113.93041',
};
const debounceGetGeocoder = debounce((address, cb) => {
  getGeocoder(address).then((res) => {
    if (res.code == 0 && res.data.status == 0) {
      const result = res.data.result;
      let zoom = 20;
      if (result.title == result.address_components.province) zoom = 5;
      if (result.title == result.address_components.city) zoom = 10;
      if (result.title == result.address_components.district) zoom = 12;
      cb({
        lat: result.location.lat,
        lng: result.location.lng,
        zoom,
      });
    }
  });
}, 1000);
export default (props: Props) => {
  console.log(props);
  const [inputValue, setInputValue] = useState<string>(props.address);
  console.log('inputValue', inputValue);
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();
  useEffect(() => {
    const center = new qq.maps.LatLng(
      props.lat || DefauleLatLng.lat,
      props.lng || DefauleLatLng.lng,
    );
    const map = new qq.maps.Map(document.getElementById('TMap'), {
      center,
      zoom: props.address ? 20 : 10,
      zoomControlOptions: { position: qq.maps.ControlPosition.BOTTOM_RIGHT },
      panControlOptions: { position: qq.maps.ControlPosition.BOTTOM_RIGHT },
    });
    const marker = new qq.maps.Marker({
      position: center,
      map: map,
      draggable: true,
      title: '网点位置',
    });
    // setTimeout(()=>{
    //   console.log(props)
    //   // 等父元素表单渲染完毕再更新
    //   !props.lat && props.setLatLng(DefauleLatLng.lat, DefauleLatLng.lng)
    // })
    qq.maps.event.addListener(marker, 'dragging', function (e) {
      props.setLatLng(e.latLng.getLat(), e.latLng.getLng());
    });
    setMarker(marker);
    setMap(map);
  }, []);
  useEffect(() => {
    setInputValue(props.address);
    map &&
      props.address &&
      debounceGetGeocoder(props.address, ({ lat, lng, zoom }) => {
        const center = new qq.maps.LatLng(lat, lng);
        map.setOptions({ center, zoom });
        marker.setPosition(center);
      });
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
