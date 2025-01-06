//存储token
import Cookies from "js-cookie";
import szdStoreSession from "./storeSession";

const tokenKey = "SZDCORE-Admin-Token";

/** 获取登录token */
function getToken() {
  return Cookies.get(tokenKey);
}

/** 设置登录token */
function setToken(token) {
  Cookies.set(tokenKey, token);
}

/** 删除登录token */
function removeToken() {
  Cookies.remove(tokenKey);
  szdStoreSession.removeLock();
}

const const_language = "language";
let language_val;

/** 获取登录语言 */
function getLanguage() {
  if (!language_val) {
    language_val = Cookies.get(const_language);
    if (!language_val) {
      language_val = "zh-CN";
      setLanguage(language_val);
    }
  }
  return language_val;
}

/** 设置登录语言 */
function setLanguage(language) {
  language_val = language ? language : "zh-CN";
  Cookies.set(const_language, language_val, { expires: 30, SameSite: 'Strict', httpOnly:true });
}

/** 外围系统token赋值 */
function setTokenOther(loginOther) {
  if (loginOther) {
    try {
      Cookies.set(loginOther.tokenInfo.tokenName, encodeURIComponent(loginOther.tokenInfo.token), {
        domain: loginOther.tokenInfo.tokenDomain,
        path: "/"
      });
    } catch (e) {
      console.error(loginOther.destCode + "登录失败:浏览器cookie写入异常");
    }
  }
}

const szdStoreCookie = {
  getToken,
  setToken,
  removeToken,
  getLanguage,
  setLanguage,
  setTokenOther
};

export default szdStoreCookie;
