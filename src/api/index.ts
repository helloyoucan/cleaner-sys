import request from '../utils/request';
export const getBranch = ({ page = 1, page_size = 10 }) =>
  request({
    method: 'get',
    url: '/api/system/branch/pages',
    params: {
      page,
      page_size,
    },
  });
