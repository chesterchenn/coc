/**
 * 将YYYYMMDDTHHmmss格式化字符串成UTC时间
 * @param {string} str 特定的时间格式
 */
export const formatString2UTC = (str) => {
  if (str.length < 13) {
    console.log(`formatString2UTC Error: ${str} length in not enough`);
    return str;
  }
  const result =
    str.slice(0, 4) +
    '-' +
    str.slice(4, 6) +
    '-' +
    str.slice(6, 11) +
    ':' +
    str.slice(11, 13) +
    ':' +
    str.slice(13);

  return result;
};
