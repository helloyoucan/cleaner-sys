import axios from 'axios';
const instance = axios.create({
  // baseURL: '/api',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});
instance.interceptors.response.use(
  function (response) {
    return Promise.resolve(response.data);
  },
  function (error) {
    return Promise.reject(error);
  },
);
export default instance.request;
