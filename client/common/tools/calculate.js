import { $m } from "../utils/globalConfig";
import { dataSum } from "../../components/table/js/tableFunc";

/**
 * 除法/固定小数位
 * @param {number} dividend  被除数
 * @param {number} divisor  除数
 * @param {number} decimalPlace  小数位
 * @param {String} rounding  小数位进位 up向上 down向下
 */
function division(dividend, divisor, decimalPlace, rounding) {
  if (divisor) {
    let val = Number(dividend) / Number(divisor);
    if (rounding === "up") {
      const pow = Math.pow(10, decimalPlace); //向上进位
      return Math.ceil(val * pow) / pow;
    } else if (rounding === "down") {
      const pow = Math.pow(10, decimalPlace); //向下舍位
      return Math.floor(val * pow) / pow;
    } else {
      return Number(val.toFixed(decimalPlace)); //固定小数位;
    }
  } else {
    $m("CORE_CLIENT.E045"); //除数不能为0
    return Infinity;
  }
}

/**
 * 乘法/固定小数位
 * @param {number} num1  被乘数
 * @param {number} num2  乘数
 * @param {number} decimalPlace  小数位
 * @param {String} rounding 小数位进位 up向上 down向下
 */
function multiply(num1, num2, decimalPlace, rounding) {
  let val = Number(num1) * Number(num2);
  if (rounding === "up") {
    const pow = Math.pow(10, decimalPlace); //向上进位
    return Math.ceil(val * pow) / pow;
  } else if (rounding === "down") {
    const pow = Math.pow(10, decimalPlace); //向下舍位
    return Math.floor(val * pow) / pow;
  } else {
    return Number(val.toFixed(decimalPlace)); //固定小数位;
  }
}

/**
 * 计算税额-金额
 * @param {number} amt  金额(不含税)
 * @param {number} tax  税率 单位%
 * @param {number} decimalPlace  小数位
 * @param {String} rounding 小数位进位 up向上 down向下
 */
export function taxNet(amt, tax, decimalPlace, rounding) {
  const taxVal = tax / 100;
  const _pos = decimalPlace || 2;
  return multiply(amt, taxVal, _pos, rounding);
}

/**
 * 计算税额-价税合计
 * @param {number} amt  金额(含税)
 * @param {number} tax  税率 单位%
 * @param {number} decimalPlace  小数位
 * @param {String} rounding 小数位进位 up向上 down向下
 */
export function taxInc(amt, tax, decimalPlace, rounding) {
  const taxVal1 = tax / 100;
  const taxVal2 = 1 + taxVal1;
  const _pos = decimalPlace || 2;
  const net = division(amt, taxVal2, _pos, rounding);
  return multiply(net, taxVal1, _pos, rounding);
}

/**
 * 汇总表格
 * @param {Object} obj  数据对象- table 表格 summary-method 中方法
 * @param {Array} fCatCol 列目录-同表格目录 或 直接字段 必须的参数
 * [{
 * field:  //列字段  必填
 * type:   //数据类型  必填
 * numDot: //千分位符 可选
 * numDec: //小数位位数 可选
 * doSum: //列汇总 0.不汇总 1.合计 2.平均值 3.最小值 4.最大值 5.统计行数  必填
 * }]
 * @return {Array} 汇总结果
 */
function tableSum(obj, fCatCol) {
  let fCat = [];
  for (let i = 0; i < fCatCol.length; i++) {
    if (_.isObject(fCatCol[i])) {
      fCat.push(fCatCol[i]);
    } else {
      fCat.push({ field: fCatCol[i], type: "number", numDot: true, numDec: 2, doSum: "1" });
    }
  }
  return dataSum(obj, fCat);
}

const szdCalc = {
  division,
  multiply,
  taxNet,
  taxInc,
  tableSum
};

export default szdCalc;
