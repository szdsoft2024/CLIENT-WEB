import router from "@/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessageBox } from "element-plus";
import store from "~store";
import szdStoreSession from "../store/storeSession";
import szdStoreCookie from "../store/storeCookie";
import szdRouter from "./goRouter";
import { $m, $t } from "./globalConfig";
import { ssoLogin } from "../api/login";
import szdStoreLocal from "../store/storeLocal";

//进度条
NProgress.configure({ showSpinner: false });
//白名单
const whiteList = ["/login"];
//路由拦截器
router.beforeEach((to, from, next) => {
  let token = szdStoreCookie.getToken();
  //检查是否是单点登录界面，要打开的页面是core/sso, 虚拟路由
  if (to.path === "/core/sso") {
    ssoLoginCheck(to, from, next, token);
    return;
  } else if (to.query.token) {
    //单点登录，url携带token，进行比较是否和当前一致，不一致进行token重新取值
    if (!token || token !== to.query.token) {
      ssoLoginUrlToken(to, from, next, token);
      return;
    }
  }

  NProgress.start();
  if (szdStoreCookie.getToken()) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      if (store.state.loginUser.user.userId === undefined) {
        store.dispatch("GetUserInfo").then(res => {
          if (res) {
            next({ ...to, replace: true });
          } else {
            store.dispatch("LogOut").then(() => {
              next({ path: "/" });
            });
          }
        });
      } else {
        if (!router.hasRoute(to.name) || (window.__POWERED_BY_QIANKUN__ && to.href.toLowerCase() === "/micro/index")) {
          NProgress.done();
          return;
        }
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      next(); // 在免登录白名单，直接进入
    } else {
      next(`/login`); // 否则全部重定向到登录页 next(`/login?redirect=${to.path}`)
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

//单点登录检查
function ssoLoginCheck(to, from, next, token) {
  if (to.query.token) {
    //将SSOToken转换为WebToken，同时刷新有效期
    ssoLogin({ userId: to.query.userId, token: to.query.token }).then(res => {
      if (res.code === 200) {
        if (token) {
          if (res.userId !== szdStoreLocal.getUserId()) {
            ElMessageBox.confirm($t("不同用户登录，登录信息将被重置, 是否继续?"), $t("提示"), {})
              .then(() => {
                ssoLoginNext(to.query, next, res.token);
              })
              .catch(() => {
                ssoLoginNext(to.query, next, token);
              });
          } else {
            ssoLoginNext(to.query, next, token);
          }
        } else {
          ssoLoginNext(to.query, next, res.token);
        }
      } else {
        $m("CORE_CLIENT.E015"); //单点登录token已过期,请重新登录
        next({ path: "/" });
      }
    });
  } else {
    $m("CORE_CLIENT.E017"); //单点登录未携带token信息，请联系对应系统技术人员
    next({ path: "/" });
  }
}

//单点登录刷新登录有效期
function ssoLoginNext(query, next, resToken) {
  szdStoreSession.removeCoreLogin();
  szdStoreCookie.setToken(resToken);
  store.dispatch("GetUserInfo").then(res => {
    if (res) {
      ssoLoginRedirect(query, next);
    } else {
      store.dispatch("LogOut").then(() => {
        $m("CORE_CLIENT.E015"); //单点登录token已过期,请重新登录
        next({ path: "/" });
      });
    }
  });
}

//单点登录重新定向
function ssoLoginRedirect(query, next) {
  const params = query;
  const routerCode = params.routerCode;
  delete params.token;
  delete params.userId;
  delete params.routerCode;
  const routerObj = szdRouter.getRouterObj(routerCode);
  if (routerObj) {
    szdRouter.goNav(routerCode, params);
  } else {
    next({ path: "/" });
  }
}

//单点登录，url携带token，进行比较是否和当前一致，不一致进行token重新取值
function ssoLoginUrlToken(to, from, next, token) {
  szdStoreSession.removeCoreLogin();
  szdStoreCookie.setToken(to.query.token);
  store.dispatch("GetUserInfo").then(res => {
    if (res) {
      next({ ...to, replace: true });
    } else {
      store.dispatch("LogOut").then(() => {
        $m("CORE_CLIENT.E015"); //单点登录token已过期,请重新登录
        next({ path: "/" });
      });
    }
  });
}
