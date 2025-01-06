import { btnCheck, consume, init, nextUser, retInfo, setWfAppTool, wfInfo } from "./js/wfTool";
import { shBT, shBTS, shDyId } from "./js/wfShHelp";
import { eisAtt, eisImg, goDoc, goVch, goPrint, goPrintBatch, getUrlParams } from "./js/wfRouter";

export const szdWf = {
  init,
  btnCheck,
  wfInfo,
  retInfo,
  nextUser,
  consume,
  //路由相关
  getUrlParams,
  goDoc,
  goPrint,
  goPrintBatch,
  eisImg,
  eisAtt,
  goVch,
  //搜索帮助
  shBT,
  shBTS,
  shDyId
};

const installWfFunction = app => {
  setWfAppTool(app);
  app.config.globalProperties.szdWf = szdWf;
};

export default installWfFunction;
