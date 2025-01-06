/** 零代码区域 **/
import { c_field_optionCell, c_field_preSubTable, getUrlParams } from "./js/scpTool";
import { setItemNo } from "./js/scpSetItemNo";
import { setMove } from "./js/scpMpMove";
import { checkData, checkDataDst } from "./js/scpCheckData";
import { getFst, getFstBtn, setFstCellRows, setFstCellData } from "./js/scpFstField";

export const szdScp = {
  c_field_preSubTable,
  c_field_optionCell,
  getUrlParams,
  setItemNo,
  setMove,
  checkData,
  checkDataDst,
  getFst,
  getFstBtn,
  setFstCellData,
  setFstCellRows
};

const installScpFunction = app => {
  /** 零代码区域 **/
  app.config.globalProperties.szdScp = szdScp;
};

export default installScpFunction;
