/*************************************************
 * 程序层-语言包
 */
const szdLang = "szdLang";
const szdLangMd5 = "szdLangMd5";

/** 获取语言 */
function getLang() {
  const dbLang = localStorage.getItem(szdLang);
  return dbLang ? JSON.parse(dbLang) : {};
}

/** 设置语言 */
function setLang(val) {
  if (val) localStorage.setItem(szdLang, JSON.stringify(val));
}

/** md5检查 */
function getLangMd5(val) {
  return localStorage.getItem(szdLangMd5) !== val;
}

/** md5设置 */
function setLangMd5(val) {
  localStorage.setItem(szdLangMd5, val);
}

/*************************************************
 * 数据字典
 */
const szdDict = "szdDict";
const szdDictMd5 = "szdDictMd5";

/** 获取数据字典 */
function getDict() {
  const dbDict = localStorage.getItem(szdDict);
  return dbDict ? JSON.parse(dbDict) : {};
}

/** 设置数据字典 */
function setDict(val) {
  localStorage.setItem(szdDict, JSON.stringify(val));
}

/** md5检查 */
function getDictMd5(val) {
  return localStorage.getItem(szdDictMd5) !== val;
}

/** md5设置 */
function setDictMd5(val) {
  localStorage.setItem(szdDictMd5, val);
}

/*************************************************
 * svg
 */

/** svg */
const szdSvg = "szdSvg";
const szdSvgMd5 = "szdSvgMd5";

/** 获取svg */
function getSvg() {
  return localStorage.getItem(szdSvg);
}

/** 设置svg */
function setSvg(val) {
  localStorage.setItem(szdSvg, val);
}

/** md5检查 */
function getSvgMd5(val) {
  return localStorage.getItem(szdSvgMd5) !== val;
}

/** md5设置 */
function setSvgMd5(val) {
  localStorage.setItem(szdSvgMd5, val);
}

/*************************************************
 * 消息类
 */

/** msg */
const szdMsg = "szdMsg";
const szdMsgMd5 = "szdMsgMd5";

/** 获取msg */
function getMsg() {
  const dbMsg = localStorage.getItem(szdMsg);
  return dbMsg ? JSON.parse(dbMsg) : {};
}

/** 设置msg */
function setMsg(val) {
  localStorage.setItem(szdMsg, JSON.stringify(val));
}

/** md5检查 */
function getMsgMd5(val) {
  return localStorage.getItem(szdMsgMd5) !== val;
}

/** md5设置 */
function setMsgMd5(val) {
  localStorage.setItem(szdMsgMd5, val);
}

/*************************************************
 * dev开发参数设置
 */

/** dev */
const szdDev = "szdDev";

/** 获取dev */
function getDev() {
  const dbDev = localStorage.getItem(szdDev);
  return dbDev ? JSON.parse(dbDev) : {};
}

/** 设置dev */
function setDev(val) {
  localStorage.setItem(szdDev, JSON.stringify(val));
}

/*************************************************
 * 登录用户
 */

/** dev */
const szdUserId = "szdUserId";

/** 获取dev */
function getUserId() {
  const userId = localStorage.getItem(szdUserId);
  return userId;
}

/** 设置dev */
function setUserId(val) {
  localStorage.setItem(szdUserId, val);
}

const szdStoreLocal = {
  getLang,
  setLang,
  getLangMd5,
  setLangMd5,
  getDict,
  setDict,
  getDictMd5,
  setDictMd5,
  getSvg,
  setSvg,
  getSvgMd5,
  setSvgMd5,
  getMsg,
  setMsg,
  getMsgMd5,
  setMsgMd5,
  getDev,
  setDev,
  getUserId,
  setUserId
};

export default szdStoreLocal;
