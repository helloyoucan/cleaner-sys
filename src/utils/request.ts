import axios from 'axios';
const instance = axios.create({
  // baseURL: '/api',
  timeout: 3000,
  transformResponse: [
    function (data) {
      // Do whatever you want to transform the data

      return data;
    },
  ],
});
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return JSON.parse(response.data);
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);
export default instance;
