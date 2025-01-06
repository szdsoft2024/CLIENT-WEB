import store from "~store";
import { lockTabOff } from "../tools/lock";
import szdStoreSession from "./storeSession";

//系统代码
const SYS_CODE = process.env.VUE_APP_SYS_CODE;

const state = {
  visitedViews: [],
  cachedViews: []
};

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    // 路径相同但名称不是micro时替换掉micro
    let hadView = null;
    let hadViewIdx = -1;
    for (let i = 0; i < state.visitedViews.length; i++) {
      if (state.visitedViews[i].path === view.path) {
        hadViewIdx = i;
        hadView = state.visitedViews[i];
      }
    }
    if (hadView) {
      if (hadView.name !== view.name && view.name !== "micro") {
        state.visitedViews[hadViewIdx].name = view.name;
      }
      return;
    }

    // 获取名称
    if (view.path.substr(0, 7) === "/micro/") {
      const ls_route = setTabMeta(view.path);
      if (ls_route) {
        view.meta.title = ls_route.meta.title;
        view.meta.name = ls_route.name;
      }
    }
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || "no-name"
      })
    );
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return;
    if (view.meta.keepAlive) {
      state.cachedViews.push(view.name);
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    //解锁
    if (view.meta.name) {
      let _routerCodeArr = [];
      _routerCodeArr.push(view.meta.name);
      lockTabOff(_routerCodeArr);
    }
    //关闭标签
    for (let i = 0; i < state.visitedViews.length; i++) {
      if (state.visitedViews[i].path === view.path) {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name);
    if (index > -1) {
      state.cachedViews.splice(index, 1);
    }
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    //解锁
    let _routerCodeArr = [];
    for (let i = 0; i < state.visitedViews.length; i++) {
      const v = state.visitedViews[i];
      if (!v.meta.affix && v.path !== view.path && v.meta.name) {
        _routerCodeArr.push(v.meta.name);
      }
    }
    lockTabOff(_routerCodeArr);
    //关闭标签
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path;
    });
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name);
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1);
    } else {
      state.cachedViews = [];
    }
  },

  DEL_ALL_VISITED_VIEWS: state => {
    //解锁
    let _routerCodeArr = [];
    for (let i = 0; i < state.visitedViews.length; i++) {
      const v = state.visitedViews[i];
      if (!v.meta.affix && v.meta.name) {
        _routerCodeArr.push(v.meta.name);
      }
    }
    lockTabOff(_routerCodeArr);
    //关闭标签-保留固定
    state.visitedViews = state.visitedViews.filter(tag => tag.meta.affix);
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = [];
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  },

  CLIENT_CACHED_VIEWS: (state, mircoData) => {
    if (mircoData.event === "add" && mircoData.name) {
      if (state.cachedViews.includes(mircoData.name)) return;
      const routerObj = szdStoreSession.getCoreLogin().routesObj[mircoData.name];
      if (routerObj && routerObj.sysCodeWeb === SYS_CODE && routerObj.meta.keepAlive) {
        state.cachedViews.push(mircoData.name);
      }
    } else if (mircoData.event === "closeSelf") {
      const index = state.cachedViews.indexOf(mircoData.name);
      if (index > -1) {
        state.cachedViews.splice(index, 1);
      }
    } else if (mircoData.event === "closeOther") {
      const index = state.cachedViews.indexOf(mircoData.name);
      if (index > -1) {
        state.cachedViews = state.cachedViews.slice(index, index + 1);
      } else {
        state.cachedViews = [];
      }
    } else if (mircoData.event === "closeAll") {
      state.cachedViews = [];
    }
  }
};

const actions = {
  addView({ dispatch }, view) {
    dispatch("addVisitedView", view);
    dispatch("addCachedView", view);
  },
  addVisitedView({ commit }, view) {
    commit("ADD_VISITED_VIEW", view);
  },
  addCachedView({ commit }, view) {
    commit("ADD_CACHED_VIEW", view);
  },
  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delVisitedView", view);
      dispatch("delCachedView", view);

      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_VISITED_VIEW", view);
      resolve([...state.visitedViews]);
    });
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_CACHED_VIEW", view);
      resolve([...state.cachedViews]);
    });
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delOthersVisitedViews", view);
      dispatch("delOthersCachedViews", view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_OTHERS_VISITED_VIEWS", view);
      resolve([...state.visitedViews]);
    });
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_OTHERS_CACHED_VIEWS", view);
      resolve([...state.cachedViews]);
    });
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delAllVisitedViews", view);
      dispatch("delAllCachedViews", view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit("DEL_ALL_VISITED_VIEWS");
      resolve([...state.visitedViews]);
    });
  },
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit("DEL_ALL_CACHED_VIEWS");
      resolve([...state.cachedViews]);
    });
  },

  updateVisitedView({ commit }, view) {
    commit("UPDATE_VISITED_VIEW", view);
  },

  //core 通知微应用
  clientNavTab({ commit, state }, mircoData) {
    return new Promise(resolve => {
      commit("CLIENT_CACHED_VIEWS", mircoData);
      resolve([...state.cachedViews]);
    });
  }
};

// 获取路由-名称
function setTabMeta(path) {
  let ls_route = undefined;
  const routesObj = store.state.loginUser.routesObj;
  for (let key in routesObj) {
    if (routesObj[key].path === path.toLowerCase()) {
      ls_route = routesObj[key];
      break;
    }
  }
  return ls_route;
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
