import { getGeocoderByAddress, getGeocoderByLocation } from '@/api/TMap';
import { Input, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './styles.less';
import { debounce } from 'lodash';
const qq = window.qq;
type Props = {
  detailsAddress: string;
  setLatLng(lat, lng): void;
  setDetailsAddress(detailsAddress: {
    province: string;
    city;
    area;
    address;
  }): void;
  lat?: string;
  lng?: string;
};
const DefauleLatLng = {
  lat: '22.53332',
  lng: '113.93041',
};
const debouncegetGeocoderByAddress = debounce((address, cb) => {
  getGeocoderByAddress(address).then((res) => {
    if (res.code == 0 && res.data.status == 0) {
      let zoom = 20;
      const { title, location, address_components } = res.data.result;
      const { province, city, district } = address_components;
      let address = title;
      if (title == province) zoom = 5;
      if (title == city) {
        zoom = 10;
        address = '';
      }
      if (title == district) {
        zoom = 12;
        address = '';
      }
      cb({
        lat: location.lat,
        lng: location.lng,
        zoom,
        province,
        city,
        area: district,
        address,
      });
    }
  });
}, 1000);
const debouncegetGeocoderByLocation = debounce((lat, lng, cb) => {
  getGeocoderByLocation(lat, lng).then((res) => {
    if (
      res.code == 0 &&
      res.data.status == 0 &&
      res.data.result.address_component.nation == '中国'
    ) {
      const result = res.data.result;
      cb({
        details: result.address,
        province: result.address_component.province,
        city: result.address_component.city,
        area: result.address_component.district,
        address: result.formatted_addresses.recommend,
      });
    } else {
      message.warning('解析地址有误');
    }
  });
}, 1000);
export default (props: Props) => {
  const [inputValue, setInputValue] = useState<string>(
    props.detailsAddress || '',
  );
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();
  const [isFocus, setIsFocus] = useState(false);
  const inputRef = useRef<any>();
  useEffect(() => {
    const center = new qq.maps.LatLng(
      props.lat || DefauleLatLng.lat,
      props.lng || DefauleLatLng.lng,
    );
    const map = new qq.maps.Map(document.getElementById('TMap'), {
      center,
      zoom: props.detailsAddress ? 20 : 10,
      zoomControlOptions: { position: qq.maps.ControlPosition.BOTTOM_RIGHT },
      panControlOptions: { position: qq.maps.ControlPosition.BOTTOM_RIGHT },
    });
    const marker = new qq.maps.Marker({
      position: center,
      map: map,
      draggable: true,
      title: '网点位置',
    });
    qq.maps.event.addListener(marker, 'mousedown', function (e) {
      inputRef?.current?.blur();
    });
    qq.maps.event.addListener(marker, 'dragging', function (e) {
      props.setLatLng(e.latLng.getLat(), e.latLng.getLng());
      debouncegetGeocoderByLocation(
        e.latLng.getLat(),
        e.latLng.getLng(),
        ({ details, province, city, area, address }) => {
          setIsFocus(false);
          setInputValue(details);
          props.setDetailsAddress({ province, city, area, address });
        },
      );
    });
    setMarker(marker);
    setMap(map);
    // return ()=>{
    //   map.destroy();
    //   setMap(null);
    // }
  }, []);
  useEffect(() => {
    isFocus &&
      map &&
      inputValue &&
      debouncegetGeocoderByAddress(
        inputValue,
        ({ lat, lng, zoom, province, city, area, address }) => {
          const center = new qq.maps.LatLng(lat, lng);
          map.setOptions({ center, zoom });
          marker.setPosition(center);
          props.setDetailsAddress({ province, city, area, address });
          props.setLatLng(lat, lng);
        },
      );
  }, [inputValue]);
  return (
    <div
      style={{ width: 735, height: 450 }}
      className={styles.mapContent}
      id="TMap"
    >
      <div className={styles.searchContent}>
        <Input
          ref={inputRef}
          placeholder="请输入地址"
          style={{ width: '500px' }}
          value={inputValue}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(event) => setInputValue(event.target.value)}
        />
      </div>
    </div>
  );
};
