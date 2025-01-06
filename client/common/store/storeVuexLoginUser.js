import _ from "lodash";
import router from "@/router";
import szdStoreSession from "./storeSession";
import szdStoreCookie from "./storeCookie";
import szdStoreLocal from "./storeLocal";
import { getUserInfo, logout, getLang, getDict, loginOthers, getMsg } from "../api/login";

//系统代码、WebSocket应用
const SYS_CODE = process.env.VUE_APP_SYS_CODE;

//view->actions->mutations->state->view  view通过dispatch提交到actions，actions通过commit提交到mutations，并最终修改state中的数据
const loginUser = {
  state: {
    token: "", //获取token
    user: {}, //用户信息
    menus: [], //菜单信息
    routesObj: {}, // 路由对象
    sysMicro: {}, //微应用
    webParams: {}, //Web参数配置
    homeConfig: {}, //主题配置
    perParams: {} //个人参数配置
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_ROUTESOBJ: (state, routesObj) => {
      state.routesObj = routesObj;
    },
    SET_SYSMICRO: (state, sysMicro) => {
      state.sysMicro = sysMicro;
    },
    SET_WEBPARAMS: (state, webParams) => {
      state.webParams = webParams;
    },
    SET_HOMECONFIG: (state, homeConfig) => {
      state.homeConfig = homeConfig;
    },
    SET_PERPARAMS: (state, perParams) => {
      state.perParams = perParams;
    }
  },
  actions: {
    //获取用户信息
    GetUserInfo({ commit }) {
      return new Promise(resolve => {
        let _loginUser = szdStoreSession.getCoreLogin();
        if (_loginUser && _loginUser.token === szdStoreCookie.getToken()) {
          if (window.__POWERED_BY_QIANKUN__) {
            Object.keys(_loginUser.routesObj).forEach(key => {
              _loginUser.routesObj[key].path = _loginUser.routesObj[key].path.replace("/micro", "");
            });
          }
          setVuexLoginUser({ commit }, _loginUser); //设置vuex
          resolve(true);
        } else {
          getUserInfo().then(res => {
            if (res && res.code === 200) {
              dealUserInfo({ commit }, res).then(resLoginUser => {
                setVuexLoginUser({ commit }, resLoginUser); //设置vuex
              });
              //三方系统登录
              LoginOthers(res.user.userId);
              //下载本地存储
              downloadLocalStore(res.localMd5, res.user.language, res.user.userId);
              resolve(true);
            } else {
              szdStoreCookie.removeToken();
              szdStoreSession.removeCoreLogin();
              resolve(false);
            }
          });
        }
      });
    },
    //退出系统
    LogOut({ commit }) {
      return new Promise(resolve => {
        if (szdStoreCookie.getToken()) {
          logout(szdStoreCookie.getToken()).then(res => {
            clearStore({ commit });
            resolve(true);
          });
        } else {
          clearStore({ commit });
          resolve(true);
        }
      });
    }
  }
};

// 获取用户信息-处理
function dealUserInfo({ commit }, res) {
  return new Promise(resolve => {
    let _loginUser = {
      token: szdStoreCookie.getToken(),
      user: res.user, //用户
      menus: res.menus, //展示菜单
      routesObj: {}, //路由
      sysMicro: {}, //微应用
      webParams: {}, //web参数
      homeConfig: {}, //主题配置
      perParams: res.userPer //个人参数
    };
    //路由转化对象
    _loginUser.routesObj = setRoutesObj(res.routers);
    //微应用对象
    for (let i = 0; i < res.sysMicro.length; i++) {
      const item = res.sysMicro[i];
      _loginUser.sysMicro[item.sysCode] = {
        sysCode: item.sysCode,
        sysName: item.sysName,
        sysWebIp: item.sysWebIp,
        sysWebSocket: item.sysWebSocket
      };
    }
    //web参数
    for (let i = 0; i < res.webParams.length; i++) {
      const item = res.webParams[i];
      if (item.configType && item.configKey) {
        if (item.configKey === "web_table_pagination") {
          let temp = JSON.parse(item.configValue);
          if (Array.isArray(temp) && temp.length > 0) {
            _loginUser.webParams[item.configKey] = JSON.parse(item.configValue);
          }
        } else {
          _loginUser.webParams[item.configKey] = item.configValue;
        }
      }
    }
    //home和导航配置
    _loginUser.homeConfig = setHomeConfig(res.homeConfig, _loginUser.routesObj);
    //md5参数
    _loginUser.webParams["localMd5"] = res.localMd5;
    //设置store
    szdStoreSession.setCoreLogin(_loginUser);
    //处理完成返回
    resolve(_loginUser);
  });
}

//设置路由对象
function setRoutesObj(routesArr) {
  let routesObj = {};
  for (let i = 0; i < routesArr.length; i++) {
    const item = routesArr[i];
    if (!item.routerCode || !item.sysCode || !item.sysCodeWeb) {
      console.error(item.routerCode + "系统代码或路由代码未配置");
      continue;
    }
    item.routerCode = item.routerCode.toUpperCase();
    if (item.routerCodePrt) item.routerCodePrt.toUpperCase();
    //url访问地址
    let _path = "/" + item.routerCode.toLowerCase();
    //拼接参数
    if (item.params) _path = _path + item.params;
    //非本应用路由 微应用打开
    if (item.sysCodeWeb !== SYS_CODE && !item.destCode) _path = `/micro${_path}`;
    //三方系统使用iframe打开
    if (item.destCode) _path = "/dest" + _path;
    //挂载组件地址
    let _component = _.isString(item.destCode) && item.destCode.length ? "sys/frame/index" : item.compUrl;
    //弹窗模式
    let _iframeMode = item.iframeMode ? item.iframeMode : "1";
    //设置参数对象
    routesObj[item.routerCode] = {
      routerCode: item.routerCode, //路由代码
      routerName: item.routerName, //路由名称
      routerType: item.routerType, //路由类型
      path: _path, //url显示的路径
      component: _component, //挂载组件地址
      componentUrl: _component,
      compUrl: item.compUrl ? item.compUrl : "",
      compUrlApp: item.compUrlApp ? item.compUrlApp : "",
      compUrlPrint: item.compUrlPrint ? item.compUrlPrint : "",
      program: item.program, //程序代码
      sysCode: item.sysCode, //系统代码
      sysCodeWeb: item.sysCodeWeb, //前端系统代码
      destCode: item.destCode ? item.destCode : "", //三方系统
      isFrame: item.isFrame, //路由显示类型  "0".默认 "1".新标签(带框架)  "2".新标签(无框架) "3".新标签(无框架，路由唯一) "4".dialog弹窗 "9".新标签(外链)
      isBlank: ["1", "2", "3", "9"].includes(item.isFrame), //新标签
      isLayout: ["0", "1"].includes(item.isFrame), //带框架

      //iframe弹窗框架
      iframeTitle: item.iframeTitle, //iframe框架标题
      iframeWidth: item.iframeWidth, //iframe框架宽度
      iframeHeight: item.iframeHeight, //iframe框架高度
      iframeMode: _iframeMode, //弹窗模式 1.组件模式 2.iframe无框架 3.iframe有框架
      iframeVue: _iframeMode === "1" && !item.destCode, //是否组件模式
      iframeLayout: item.iframeMode === "3", //是否有框架
      //打印路由代码和打印路由程序
      routerCodePrt: item.routerCodePrt, //打印页面
      programPrt: item.programPrt, //打印页面
      //业务类型
      bstp: item.bstp,
      bstpCount: item.bstpCount,
      //路由默认参数
      name: item.routerCode, //用于检查唯一值
      meta: {
        name: item.routerCode,
        title: item.routerName,
        keepAlive: item.keepAlive //页面缓存
      }
    };
  }
  return routesObj;
}

//设置首页和导航配置
function setHomeConfig(homeConfig, routesObj) {
  let _param = homeConfig ? homeConfig : {};
  let _homeConfig = {
    license: _param.license, //是否商业授权
    theme: _param.theme ? _param.theme : {}, //主题配置
    nav: {
      type: _param.nav && _param.nav.type ? _param.nav.type : "1", //导航菜单1默认空白 2自定义路由3导航菜单4显示logo
      routerCode: _param.nav && _param.nav.routerCode && routesObj[_param.nav.routerCode] ? _param.nav.routerCode : "",
      areaMenu: _param.nav && _param.nav.areaMenu ? _param.nav.areaMenu : [],
      logoUrl: _param.nav && _param.nav.logoUrl ? _param.nav.logoUrl : ""
    },
    homeRCode: _param.homeRCode && routesObj[_param.homeRCode] ? _param.homeRCode : "", //首页更换
    top: {
      leftRCode: _param.top && _param.top.leftRCode && routesObj[_param.top.leftRCode] ? _param.top.leftRCode : "", //上左
      middle: [] //上中
    },
    bottom: [] //底部
  };
  // 设置导航参数
  if (_homeConfig.nav.type === "2" && !_homeConfig.nav.routerCode) _homeConfig.nav.type = "1";
  if (_homeConfig.nav.type === "3" && _homeConfig.nav.areaMenu.length === 0) _homeConfig.nav.type = "1";
  if (_homeConfig.nav.type === "4" && !_homeConfig.nav.logoUrl) _homeConfig.nav.type = "1";
  // 上中
  if (_param.top && _param.top.middle && _param.top.middle.length > 0) {
    for (let i = 0; i < _param.top.middle.length; i++) {
      let item = _param.top.middle[i];
      if (routesObj[item.routerCode]) {
        _homeConfig.top.middle.push({ routerCode: item.routerCode, routerName: routesObj[item.routerCode].routerName });
      }
    }
  }
  // 底部
  if (_param.bottom && _param.bottom.length > 0) {
    for (let i = 0; i < _param.bottom.length; i++) {
      let item = _param.bottom[i];
      if (routesObj[item.routerCode]) {
        _homeConfig.bottom.push({ routerCode: item.routerCode, routerName: routesObj[item.routerCode].routerName });
      }
    }
  }

  return _homeConfig;
}

//设置Vuex和加载路由
function setVuexLoginUser({ commit }, _loginUser) {
  commit("SET_TOKEN", szdStoreCookie.getToken());
  commit("SET_USER", _loginUser.user);
  commit("SET_MENUS", _loginUser.menus);
  commit("SET_ROUTESOBJ", _loginUser.routesObj);
  commit("SET_SYSMICRO", _loginUser.sysMicro);
  commit("SET_WEBPARAMS", _loginUser.webParams);
  commit("SET_HOMECONFIG", _loginUser.homeConfig);
  commit("SET_PERPARAMS", _loginUser.perParams);
  //加载路由: 三方系统的不加载 仅加载自己的微应用，其它微应用各自加载
  for (let key in _loginUser.routesObj) {
    let item = _loginUser.routesObj[key];
    if (item.sysCodeWeb === SYS_CODE || (SYS_CODE === "CORE" && item.destCode)) {
      //挂载组件
      if (item.component) {
        item.component = loadView(item.component);
      }
      //添加路由，设置框架
      if (!router.hasRoute(item.routerCode)) {
        if (item.isLayout) {
          router.addRoute("Layout", item); //带框架
        } else {
          router.addRoute(item); //无框架
        }
      }
    }
  }
  //安装svg
  installSvg();
  //设置字体
  setFontSize(_loginUser.user);
}

//路由懒加载，需要的时候进行加载
export const loadView = view => {
  return () => import(`@/modules/${view}`);
};

//清空存储
function clearStore({ commit }) {
  szdStoreCookie.removeToken();
  szdStoreSession.removeCoreLogin();
  commit("SET_TOKEN", "");
  commit("SET_USER", {});
  commit("SET_MENUS", []);
  commit("SET_ROUTESOBJ", {});
  commit("SET_SYSMICRO", {});
  commit("SET_WEBPARAMS", {});
  commit("SET_HOMECONFIG", {});
  commit("SET_PERPARAMS", {});
}

//下载本地存储
function downloadLocalStore(localMd5, language, userId) {
  //语言包下载
  if (szdStoreLocal.getLangMd5(localMd5.lang + "_" + language) || !szdStoreLocal.getLang()) {
    getLang(szdStoreCookie.getLanguage()).then(res => {
      if (res.data) {
        szdStoreLocal.setLang(res.data);
        szdStoreLocal.setLangMd5(localMd5.lang + "_" + language);
      }
    });
  }
  //数据字典下载
  if (szdStoreLocal.getDictMd5(localMd5.dict + "_" + language) || !szdStoreLocal.getDict()) {
    getDict().then(res => {
      if (res.data) {
        szdStoreLocal.setDict(res.data);
        szdStoreLocal.setDictMd5(localMd5.dict + "_" + language);
      }
    });
  }
  //消息信息下载
  if (szdStoreLocal.getMsgMd5(localMd5.msg + "_" + language) || !szdStoreLocal.getMsg()) {
    getMsg().then(res => {
      if (res.data) {
        szdStoreLocal.setMsg(res.data);
        szdStoreLocal.setMsgMd5(localMd5.msg + "_" + language);
      }
    });
  }
  // 登录用户
  szdStoreLocal.setUserId(userId);
}

//安装svg内容
function installSvg() {
  if (document.getElementById("szdSvgId")) return;
  const svgWrap = document.createElement("div");
  svgWrap.id = "szdSvgId";
  svgWrap.style.cssText = "position:absolute;left:0;height:0;display:none;";
  svgWrap.innerHTML = szdStoreLocal.getSvg();
  document.body.insertBefore(svgWrap, document.getElementById("app"));
}

//设置字体
function setFontSize(user) {
  if (user && user.fontSize) {
    const size = user.fontSize;
    document.getElementsByTagName("body")[0].style.setProperty("--fz", size);
    document.documentElement.style.setProperty("--el-font-size-base", size);
    document.documentElement.style.setProperty("--font-size", size);
  }
}

//三方系统登录
function LoginOthers(userId) {
  loginOthers(userId).then(res => {
    if (res.code === 200) {
      if (res.data !== null && res.data !== undefined && res.data.length > 0) {
        res.data.forEach(item => {
          if (item.retCode === "S") {
            szdStoreCookie.setTokenOther(item); //token赋值
          } else if (item.retCode === "E") {
            console.error(item.destCode + ":" + item.retMsg);
          }
        });
      }
    }
  });
}

export default loginUser;
