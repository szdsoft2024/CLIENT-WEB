import szdStoreSession from "../store/storeSession";

/**
 * 设置favicon
 */
export function setFavicon() {
  const faviconUrl = sessionStorage.getItem("SZDCORE-favicon");
  if (faviconUrl) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }
}

/**
 * 设置主题
 */
export function setThemeColor(theme = false) {
  let _theme = {};
  if (theme) {
    _theme = theme;
  } else {
    const loginUser = szdStoreSession.getCoreLogin();
    if (loginUser && loginUser.homeConfig && loginUser.homeConfig.theme) {
      _theme = loginUser.homeConfig.theme;
    }
  }
  if (_theme.type) {
    const _keys = ["menuBg", "menuTxt", "menuActiveBg", "menuActiveText"];
    _keys.forEach(key => {
      if (_theme[key]) {
        document.getElementsByTagName("body")[0].style.setProperty("--" + key, _theme[key]);
      }
    });
  }
}
