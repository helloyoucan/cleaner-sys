const obj2query = (obj) => {
  let query = '';
  Object.entries(obj).forEach(([k, v]) => {
    query += `${k}=${v}&`;
  });
  return query;
};
const BaseURL = 'https://apis.map.qq.com';
const TMapKey = 'PSLBZ-Y6GWU-SQOVF-BPOJK-IESTV-TSBZV';
type OptType = {
  url: string;
  data?: {
    [key: string]: string | number;
  };
};
const callBackName = 'JsonPCallback';
// window[callBackName] = (...param) => console.log('jsonp param is:' + param)
function jsonp<T = any>(
  opt: OptType,
): Promise<{ code: number; data: T; message: string }> {
  const s = document.createElement('script');
  s.id = 'jsonp';
  s.src = `${BaseURL}${opt.url}${
    opt.url.indexOf('?') > -1 ? '&' : '?'
  }key=${TMapKey}&output=jsonp&callback=${callBackName}&${
    opt.data ? obj2query(opt.data) : ''
  }`;
  return new Promise((resolve, reject) => {
    const timeId = setTimeout(() => {
      s.remove();
      reject({ code: -1, data: null, message: '访问超时' });
    }, 10000);
    window[callBackName] = (res, ...other) => {
      clearTimeout(timeId);
      resolve({
        code: 0,
        data: { ...res, other },
        message: '',
      });
      s.remove();
    };
    document.body.appendChild(s);
  });
}

export default jsonp;
