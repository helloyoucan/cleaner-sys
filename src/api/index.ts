import request from '../utils/request';
export type BranchItem = {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  province: string;
  city: string;
  area: string;
  address: string;
  contact_person: string;
  contact_phone: number;
  warrior_manager_id: string;
  range: number;
  base_cost: number;
  extra_range_unit_price: number;
  status: number;
  remark: string;
  created: number;
};
export const getBranch = ({ page = 1, page_size = 10 }) =>
  request<APIResponse<BranchItem[]>>({
    method: 'get',
    url: '/api/system/branch/pages',
    params: {
      page,
      page_size,
    },
  });

export const addBranch = (data: BranchItem) =>
  request<APIResponse<null>>({
    method: 'post',
    url: '/api/system/branch',
    data,
  });
