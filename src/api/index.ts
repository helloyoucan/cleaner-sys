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
  total_amount: number;
  amount: number; //可领取数量
  type: number; // 优惠类型 0:指定金额，1:折扣
  type_value: number; // 优惠类型对应的值
  threshold_type: number; // 使用门槛 0:无，1:指定金额，2:用户首单
  threshold_value: number; //有使用门槛时对应的值
  expiry_type: number; //有效期类型 0:固定日期,1:领取当日开始N天内有效
  expiry_type_value?: number; //当ExpiryType=1时，绑定的值
  start_time?: number;
  end_time?: number;
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

// 订单
export type OrderItem = {
  id: string;
  order_num: string;
  user_id: string;
  status: number;
  total_amount: number;
  paid_in_amount: number;
  discount_amount: number;
  refund_status: number;
  refund_s_arrival_time: number;
  created: number;
  // 接单战士
  warrior: {
    id: string;
    name: string;
    phone: number;
    belong_branch_id: string;
  };
  //服务网点信息
  branch: {
    id: string;
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
  //服务地址及联系人信息
  client_info: {
    user_id: string;
    name: string;
    phone: number;
    province: string;
    city: string;
    area: string;
    address: string;
    distance: number;
    start_time: number;
    end_time: number;
  };
  // 电器信息
  machine: {
    brand: string;
    type: string;
    mode: string;
    photos_json_str: string;
    remark: string;
  };
  // 订单选择的附加服务
  extra_services: Array<{
    id: string;
    order_id: string;
    extra_service_id: string;
    name: string;
    unit_price: number;
    discount: number;
    description: string;
  }>;
  // 订单使用的优惠券
  order_coupons: Array<{
    id: string;
    user_coupon_id: string;
    name: string;
    start_time: number;
    end_time: number;
    description: string;
    order_id: string;
  }>;
};
export const getOrder = ({ page = 1, page_size = 10, ...query }) =>
  request<APIResponse<OrderItem[]>>({
    method: 'get',
    url: '/api/system/order/pages',
    params: {
      page,
      page_size,
      ...query,
    },
  });

export const updateOrder = (data: OrderItem) =>
  request<APIResponse<null>>({
    method: 'put',
    url: '/api/system/order',
    data,
  });
export const deleteOrder = (ids: (string | number)[]) =>
  request<APIResponse<number>>({
    method: 'delete',
    url: '/api/system/order?' + utils.array2Query(ids, 'id'),
  });
