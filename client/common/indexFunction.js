/** tool区域 */
import szdDate from "./tools/date";
import szdCalc from "./tools/calculate";
import szdTool from "./tools/tool";
import szdCheck from "./tools/check";

import szdRouter from "./utils/goRouter";
import szdComp from "./utils/component";

/** store区域 */
import szdStoreSession from "./store/storeSession";
import szdStoreLocal from "./store/storeLocal";
import szdStoreCookie from "./store/storeCookie";

/** message区域 */
import { szdPop, szdPopSave, szdPopDel } from "./message/popup";
import szdLoading from "./message/loading";

import { $m, $mE, $mI, $mS, $mW, $t } from "./utils/globalConfig";

const installCommonFunction = app => {
  /** tool区域 */
  //日期
  app.config.globalProperties.szdDate = szdDate;
  //计算
  app.config.globalProperties.szdCalc = szdCalc;
  //工具
  app.config.globalProperties.szdTool = szdTool;
  //检查
  app.config.globalProperties.szdCheck = szdCheck;
  //路由和框架处理区域
  app.config.globalProperties.szdRouter = szdRouter;
  //组件方法
  app.config.globalProperties.szdComp = szdComp;
  /** store区域 */
  app.config.globalProperties.szdStoreSession = szdStoreSession;
  app.config.globalProperties.szdStoreCookie = szdStoreCookie;
  app.config.globalProperties.szdStoreLocal = szdStoreLocal;

  /** message区域 */
  //确认提示
  app.config.globalProperties.szdPop = szdPop;
  app.config.globalProperties.szdPopSave = szdPopSave;
  app.config.globalProperties.szdPopDel = szdPopDel;
  //加载loading
  app.config.globalProperties.szdLoading = szdLoading;

  app.config.globalProperties.$t = $t;
  app.config.globalProperties.$m = $m;
  app.config.globalProperties.$mS = $mS;
  app.config.globalProperties.$mW = $mW;
  app.config.globalProperties.$mE = $mE;
  app.config.globalProperties.$mI = $mI;
};

export default installCommonFunction;
