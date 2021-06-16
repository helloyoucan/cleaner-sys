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
/**
 *
 * @param img
 * @param callback
 */
function imageFile2Base64(img): Promise<string | ArrayBuffer | null> {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.addEventListener('load', () => resolve(reader.result));
    reader.readAsDataURL(img);
  });
}

/**
 * 根据出生日期算出年龄
 * @param birthday 生日的时间戳
 * @returns
 */
function birthday2Age(birthday: number) {
  var returnAge;
  var birthdayDate = new Date(birthday);
  var birthYear = birthdayDate.getFullYear();
  var birthMonth = birthdayDate.getMonth() + 1;
  var birthDay = birthdayDate.getDate();

  const d = new Date();
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();

  if (nowYear == birthYear) {
    returnAge = 0; //同年 则为0岁
  } else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay; //日之差
        returnAge = dayDiff < 0 ? ageDiff - 1 : ageDiff;
      } else {
        var monthDiff = nowMonth - birthMonth; //月之差
        returnAge = monthDiff < 0 ? ageDiff - 1 : ageDiff;
      }
    } else {
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }

  return returnAge; //返回周岁年龄
}
export default {
  array2Query,
  yuan2fen,
  fen2yuan,
  dateTime2time,
  checkIdCard,
  getSexByIdcard,
  getBirthdayByIdcard,
  imageFile2Base64,
  birthday2Age,
};
