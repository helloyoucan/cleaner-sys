export enum EnumBranchStatus {
  close = 0, //关闭中
  open = 1, //营业中
  rest = 2, //休息中
}

export enum EnumExtraServiceStatus {
  disable = 0, //可用
  enable = 1, //不可用
}

export enum EnumSex {
  female = 0,
  male = 1,
}
export enum EnumWarriorStatus {
  disable = 0, //禁用（禁止接单）
  enable = 1,
}
//优惠类型
export enum EnumCouponType {
  amount = 0, //指定金额
  discount = 1, // 折扣
}
// 使用门槛
export enum EnumCouponThresholdType {
  none = 0, //无
  fixedAmount = 1, //满足指定金额
  firstOrder = 2, //用户首单
}
//有效期类型
export enum EnumCouponExpiryType {
  fixedDate = 0, //固定日期
  afterGet = 1, //领取当日开始N天内有效
}
