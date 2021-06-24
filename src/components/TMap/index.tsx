import { Input } from 'antd';
import { useEffect } from 'react';
import styles from './styles.less';
const qq = window.qq;
export default () => {
  useEffect(() => {
    var map = new qq.maps.Map(document.getElementById('TMap'), {
      // 地图的中心地理坐标。
      center: new qq.maps.LatLng(39.916527, 116.397128),
    });
  }, []);
  return (
    <div
      style={{ width: 735, height: 450 }}
      className={styles.mapContent}
      id="TMap"
    >
      <div className={styles.searchContent}>
        <Input placeholder="搜索地址" />
      </div>
    </div>
  );
};
