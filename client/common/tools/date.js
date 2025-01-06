import dayjs from "dayjs";

/**
 * 获取当天日期 YYYY-MM-DD
 */
function getDay() {
  return dayjs(new Date()).format("YYYY-MM-DD");
}

/**
 * 获取当前年 YYYY
 */
function getYear() {
  return dayjs(new Date()).format("YYYY");
}

/**
 * 获取当前月 MM
 */
function getMonth() {
  return dayjs(new Date()).format("MM");
}

/**
 * 获取当前年月 YYYY-MM
 */
function getYearMonth() {
  return dayjs(new Date()).format("YYYY-MM");
}

/**
 * 获取时间 YYYY-MM-DD HH:mm:ss
 */
function getDateTime() {
  return dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * 获取周几
 * @param {Date} time 日期时间 可选
 */
function getWeek(time = undefined) {
  const d = time ? new Date(time) : new Date();
  const wkDay = d.getDay();
  const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekday[wkDay];
}

/**
 * 日期格式化
 * @param {Date} time 日期时间 可选
 * @param {String} format 需要转换的格式 如 YYYY-MM-DD YYYY-MM-DD HH:mm:ss:SS
 */
function format(time = undefined, format = "YYYY-MM-DD") {
  return time ? dayjs(time).format(format) : dayjs(new Date()).format(format);
}

/**
 * 获取两个时间差
 * @param {Date} begDate 开始时间
 * @param {Date} endDate 结束时间
 * @param {String} unit 单位类型 day、d-天 hour、h-小时 minute、m-分钟 second、s-秒 millisecond、ms-毫秒
 */
function subtract(begDate, endDate, unit = "day") {
  //将两个日期字符串转化为日期对象
  const s = new Date(begDate);
  const e = new Date(endDate);
  //计算两个日期相差的毫秒数
  const mSec = e.getTime() - s.getTime();
  //获取转化比
  let unitNum;
  if (unit === "hour" || unit === "h") {
    unitNum = 60 * 60 * 1000;
  } else if (unit === "minute" || unit === "m") {
    unitNum = 60 * 1000;
  } else if (unit === "second" || unit === "s") {
    unitNum = 1000;
  } else if (unit === "millisecond" || unit === "ms") {
    unitNum = 1;
  } else {
    unitNum = 24 * 60 * 60 * 1000;
  }
  //相差时间
  return Math.floor(mSec / unitNum);
}

const szdDate = {
  getDay,
  getYear,
  getMonth,
  getYearMonth,
  getDateTime,
  getWeek,
  format,
  subtract
};

export default szdDate;
