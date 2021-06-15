import { EnumSex } from '@/enum';

/**
 * 数组转query参数（例如[value1,value2] => key=value1&key=value2& ）
 * @param list
 * @param key
 * @returns
 */
function array2Query(list: any[], key): string {
  let query = '';
  for (let i = 0; i < list.length; i++) {
    query += `${key}=${list[i]}&`;
  }
  return query;
}
/**
 * 金钱的 元转分
 * @param fen
 * @returns
 */
function yuan2fen(fen: number): number {
  return fen * 100;
}
/**
 * 金钱的 分转元
 * @param fen
 * @returns
 */
function fen2yuan(yuan: number): number {
  return yuan / 100;
}
/**
 * 时间格式转时间戳
 * @param dateTime
 */
function dateTime2time(dateTime?: string): number {
  if (!dateTime) return 0;
  return new Date(dateTime).getTime();
}
/**
 * 根据身份证号码获取性别
 * @param idCard
 * @returns
 */
function getSexByIdcard(idCard) {
  if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
    return EnumSex.male;
  }
  return EnumSex.female;
}
/**
 * 根据身份证号码出生日期
 * @param val
 * @returns
 */
function getBirthdayByIdcard(idCard) {
  let birthday = '';
  if (idCard.length == 15) {
    birthday = '19' + idCard.slice(6, 12);
  } else if (idCard.length == 18) {
    birthday = idCard.slice(6, 14);
  }
  return new Date(birthday.replace(/(.{4})(.{2})/, '$1-$2-')).getTime();
}
/**
 * 校验身份证（国标【GB 11643-1999】）
 * @param val
 * @returns
 */
function checkIdCard(idCard) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard);
}
export default {
  array2Query,
  yuan2fen,
  fen2yuan,
  dateTime2time,
  checkIdCard,
  getSexByIdcard,
  getBirthdayByIdcard,
};
