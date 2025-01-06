import store from "~store";
import router from "@/router";

/** 固定字段-子表前缀 $SZDSubTable_ */
export const c_field_preSubTable = "$SZDSubTable_";
/** 固定字段-单元格编辑控制 $SZDOptionCell */
export const c_field_optionCell = "$SZDOptionCell";

/**
 * 获取URL地址参数
 * @param {Object} obj 设置参数 pkVal、userId、option
 */
export function getUrlParams(obj) {
  const query = router.currentRoute.value.query;
  if (query.pkVal) obj.pkVal = query.pkVal;
  obj.userId = query.userId ? query.userId : store.state.loginUser.user.userId;
  if (query.option) {
    obj.option = query.option;
  } else {
    if (obj.pkVal) {
      obj.option = "V";
    } else {
      obj.option = "C";
    }
  }
}
