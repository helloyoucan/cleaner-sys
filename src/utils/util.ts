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
export default {
  array2Query,
  yuan2fen,
  fen2yuan,
};
