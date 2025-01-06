import Cookies from "js-cookie";

const const_SidebarStatus = "SZDCORE-SidebarStatus";

const frameLayout = {
  namespaced: true,
  state: {
    sidebar: {
      opened: !(Cookies.get(const_SidebarStatus) === 0)
    },
    device: "desktop", //手机和pc端赋值
    theme: "#1890ff" //主题色
  },
  mutations: {
    //切换左侧边菜单
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened;
      if (state.sidebar.opened) {
        Cookies.set(const_SidebarStatus, 1, { expires: 30 });
      } else {
        Cookies.set(const_SidebarStatus, 0, { expires: 30 });
      }
    },
    //终端设备
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit("TOGGLE_SIDEBAR");
    },
    toggleDevice({ commit }, device) {
      commit("TOGGLE_DEVICE", device);
    }
  }
};

export default frameLayout;
