import request from '@/utils/request';
import utils from '@/utils/util';
export const uploadPath = '/api/system/upload';
// 网点
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
export const getBranch = ({ page = 1, page_size = 10, ...query }) =>
  request<APIResponse<BranchItem[]>>({
    method: 'get',
    url: '/api/system/branch/pages',
    params: {
      page,
      page_size,
      ...query,
    },
  });
export const getAllBranch = () =>
  request<APIResponse<BranchItem[]>>({
    method: 'get',
    url: '/api/system/branch',
  });
export const addBranch = (data: BranchItem) =>
  request<APIResponse<null>>({
    method: 'post',
    url: '/api/system/branch',
    data,
  });
export const updateBranch = (data: BranchItem) =>
  request<APIResponse<null>>({
    method: 'put',
    url: '/api/system/branch',
    data,
  });
export const deleteBranch = (ids: (string | number)[]) =>
  request<APIResponse<number>>({
    method: 'delete',
    url: '/api/system/branch?' + utils.array2Query(ids, 'id'),
  });

export type CouponItem = {
  id?: string;
  name: string;
  start_time: number;
  end_time: number;
  description: string;
  created: number;
};
export const getCoupon = ({ page = 1, page_size = 10, ...query }) =>
  request<APIResponse<CouponItem[]>>({
    method: 'get',
    url: '/api/system/coupon/pages',
    params: {
      page,
      page_size,
      ...query,
    },
  });

export const addCoupon = (data: CouponItem) =>
  request<APIResponse<null>>({
    method: 'post',
    url: '/api/system/coupon',
    data,
  });
export const updateCoupon = (data: CouponItem) =>
  request<APIResponse<null>>({
    method: 'put',
    url: '/api/system/coupon',
    data,
  });
export const deleteCoupon = (ids: (string | number)[]) =>
  request<APIResponse<number>>({
    method: 'delete',
    url: '/api/system/coupon?' + utils.array2Query(ids, 'id'),
  });

// 附加服务
export type ExtraServiceItem = {
  id?: string;
  name: string;
  unit_price: number;
  discount: number;
  description: string;
  status: number;
  created: number;
};
export const getExtraService = ({ page = 1, page_size = 10, ...query }) =>
  request<APIResponse<ExtraServiceItem[]>>({
    method: 'get',
    url: '/api/system/extraService/pages',
    params: {
      page,
      page_size,
      ...query,
    },
  });

export const addExtraService = (data: ExtraServiceItem) =>
  request<APIResponse<null>>({
    method: 'post',
    url: '/api/system/extraService',
    data,
  });
export const updateExtraService = (data: ExtraServiceItem) =>
  request<APIResponse<null>>({
    method: 'put',
    url: '/api/system/extraService',
    data,
  });
export const deleteExtraService = (ids: (string | number)[]) =>
  request<APIResponse<number>>({
    method: 'delete',
    url: '/api/system/extraService?' + utils.array2Query(ids, 'id'),
  });

//战士
export type WarriorItem = {
  id?: string;
  name: string;
  phone: number;
  birthday: number;
  sex: number;
  join_time: number;
  belong_branch_id: string;
  status: number;
  id_card: string;
  id_card_image_front: string;
  id_card_image_behind: string;
  domicile_province: string;
  domicile_city: string;
  domicile_area: string;
  province: string;
  city: string;
  area: string;
  address: string;
  remark: string;
  created: number;
};
export const getWarrior = ({ page = 1, page_size = 10, ...query }) =>
  request<APIResponse<WarriorItem[]>>({
    method: 'get',
    url: '/api/system/warrior/pages',
    params: {
      page,
      page_size,
      ...query,
    },
  });

export const addWarrior = (data: WarriorItem) =>
  request<APIResponse<null>>({
    method: 'post',
    url: '/api/system/warrior',
    data,
  });
export const updateWarrior = (data: WarriorItem) =>
  request<APIResponse<null>>({
    method: 'put',
    url: '/api/system/warrior',
    data,
  });
export const deleteWarrior = (ids: (string | number)[]) =>
  request<APIResponse<number>>({
    method: 'delete',
    url: '/api/system/warrior?' + utils.array2Query(ids, 'id'),
  });
