/**
 * 范围检查
 * @param val 需要检查的值
 * @param {Array} ranges 数据范围 {option:"操作符",low:低值,high:高值}
 * @return {Boolean} 返回Boolean
 */
export function range(val, ranges) {
  if (ranges && ranges.length > 0) {
    for (let i = 0; i < ranges.length; i++) {
      const item = ranges[i];
      switch (item.option) {
        case "EQ": //等于
          if (val !== item.low) return false;
          break;
        case "NE": //不等于
          if (val === item.low) return false;
          break;
        case "GE": //大于或等于
          if (val < item.low) return false;
          break;
        case "LE": //小于或等于
          if (val > item.low) return false;
          break;
        case "GT": //大于
          if (val <= item.low) return false;
          break;
        case "LT": //小于
          if (val >= item.low) return false;
          break;
        case "SP": //包含
          if (!val.includes(item.low)) return false;
          break;
        case "NS": //不包含
          if (val.includes(item.low)) return false;
          break;
        case "CP": //*通配符包含
          const regCp = new RegExp(item.low.replaceAll("*", ".*"));
          if (!regCp.test(val)) return false;
          break;
        case "NC": //*通配符不包含
          const regNc = new RegExp(item.low.replaceAll("*", ".*"));
          if (regNc.test(val)) return false;
          break;
        case "BT": //范围内
          if (val < item.low || val > item.high) return false;
          break;
        case "NB": //范围外
          if (val >= item.low && val <= item.high) return false;
          break;
        case "EN": //等于空
          if (!(val === "" || val === undefined || val === null)) return false;
          break;
        case "NN": //不等于空
          if (val === "" || val === undefined || val === null) return false;
          break;
      }
    }
  }
  return true;
}
