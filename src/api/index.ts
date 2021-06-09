import request from '../utils/request';
import type { BranchItem } from '../pages/branch/index';
export const getBranch = ({ page = 1, page_size = 10 }) =>
  request({
    method: 'get',
    url: '/api/system/branch/pages',
    params: {
      page,
      page_size,
    },
  });

export const addBranch = (data: BranchItem) =>
  request({
    method: 'post',
    url: '/api/system/branch',
    data,
  });
