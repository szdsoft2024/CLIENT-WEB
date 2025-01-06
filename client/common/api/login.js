import request from "../utils/request";
import requestNoLoading from "../utils/requestNoLoading";

// 登录方法
export function login(obj) {
  const data = {
    userId: obj.userId.trim(), //用户登录id
    password: obj.password, //用户密码
    code: obj.code, //验证码
    uuid: obj.uuid //验证码对应后端uuid
  };
  return request({
    url: "/core/login",
    method: "post",
    data: data
  });
}

// 获取用户详细信息
export function getUserInfo() {
  return request({
    url: "/core/user/auth/getUserInfo",
    method: "get",
    params: { sysCodeWeb: process.env.VUE_APP_SYS_CODE }
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: "/core/login/captchaImage",
    method: "get"
  });
}

// 获取小程序登录二维码
export function getQrCodeImg() {
  return request({
    url: "/core/login/wx/qrcode",
    method: "get"
  });
}

// 获取短信验证码
export function getSmsCode(param) {
  return request({
    url: "/core/login/smsCode?phoneNum=" + param,
    method: "get"
  });
}

// 短信登录方法
export function loginSms(userId, code, uuid) {
  const data = {
    userId, //用户手机号
    code, //验证码
    uuid //验证码对应后端uuid
  };
  return request({
    url: "/core/login/sms",
    method: "post",
    data: data
  });
}

// 外围系统集成登录
export function loginOthers(userId) {
  return requestNoLoading({
    url: "/core/login/others/" + userId,
    method: "get"
  });
}

// 外围系统功能穿透-用户登录
export function ssoLogin(data = {}) {
  return request({
    url: "/core/login/sso",
    method: "post",
    data: data
  });
}

// 获取LOGO等配置信息
export function getLoginConfig() {
  return request({
    url: "/core/login/config",
    method: "get"
  });
}

// 更改密码
export function changePwd(data) {
  return request({
    url: "/core/login/changePwd",
    method: "post",
    data: data
  });
}

// 导航选择区域菜单
export function selectMenuArea(data) {
  return request({
    url: "/core/user/auth/areaCode",
    method: "post",
    data: data
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/core/logout",
    method: "post"
  });
}

// 移除已登录的用户
export function removeLogged(data) {
  return request({
    url: "/core/user/auth/remove/logged",
    method: "post",
    data: data
  });
}

// 获取语言字典
export function getLang(lang) {
  return request({
    url: "/core/dev/lang/bundle/" + lang,
    method: "get"
  });
}

export function getSvg() {
  return request({
    url: "/core/dev/svg/download",
    method: "get"
  });
}

export function getDict() {
  return request({
    url: "/core/dev/baseField/dict",
    method: "get"
  });
}

export function getMsg() {
  return request({
    url: "/core/dev/msg/download",
    method: "get"
  });
}
