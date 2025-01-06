import { ElMessage } from "element-plus";
import szdStoreLocal from "../store/storeLocal";

/**
 * 减少频繁调用缓存
 * */
const getSingleDbLang = (function () {
  let ret;
  return function () {
    return ret || (ret = szdStoreLocal.getLang());
  };
})();

/**
 * 语言转换
 * */
export function $t(val) {
  if (!val) return "";
  const dbLang = getSingleDbLang();
  return dbLang[val] ? dbLang[val] : val;
}

/**
 * 消息提示
 * @param {String} msgCode 消息类.状态及消息号 状态枚举[E-错误 W-警告 S-成功 I-消息],消息号3位数字
 * @param {Array,String,Number,Boolean} param 参数，[p1替换消息第一个&,p2替换消息第二个&,pn替换消息第n个]，未替换的直接拼接到一块
 * @param {Boolean} showNull 显示空
 * @param {Boolean} retMsg 是否返回消息内容，否则提醒
 */
export function $m(msgCode, param = [], showNull = false, retMsg = false) {
  if (!msgCode) return "";
  let _configArr = msgCode.split(".");
  if ((_configArr.length !== 2 && !_configArr[0]) || !_configArr[1] || _configArr[1].length !== 4) {
    ElMessage.error($t("消息类参数错误") + msgCode);
    return "";
  }
  const _mPar = {
    msgCode: _configArr[0],
    msgNo: _configArr[1].substring(1),
    msgType: _configArr[1].substring(0, 1)
  };

  //获取消息信息
  let message = "";
  const msgObj = szdStoreLocal.getMsg();
  if (msgObj[_mPar.msgCode] && msgObj[_mPar.msgCode][_mPar.msgNo]) {
    message = msgObj[_mPar.msgCode][_mPar.msgNo];
  }

  let _param = param ? (Array.isArray(param) ? param : [param]) : [];
  const _paramLen = _param.length;
  //替换&,组装消息
  let mArr = message.split("&");
  const mArrLen = mArr.length;
  message = msgCode + ": ";

  for (let i = 0; i < mArrLen; i++) {
    if (_paramLen > i) {
      if (showNull || (_param[i] !== null && _param[i] !== undefined)) {
        message = message + mArr[i] + _param[i];
      } else {
        message = message + mArr[i];
      }
    } else if (mArr[i]) {
      if (_paramLen === i) {
        message = message + mArr[i];
      } else {
        message = message + "&" + mArr[i];
      }
    }
  }

  //多余参数拼接到后边
  if (_paramLen > mArrLen) {
    for (let j = mArrLen; j < _paramLen; j++) {
      if (showNull || (_param[j] !== null && _param[j] !== undefined)) {
        message = message + " " + _param[j];
      }
    }
  }

  if (retMsg) return message;

  if (_mPar.msgType === "S") {
    ElMessage({ message: message, grouping: true, showClose: true, type: "success" });
  } else if (_mPar.msgType === "W") {
    ElMessage({ message: message, grouping: true, showClose: true, type: "warning" });
  } else if (_mPar.msgType === "E") {
    ElMessage({ message: message, grouping: true, showClose: true, type: "error" });
  } else {
    ElMessage({ message: message, grouping: true, showClose: true, type: "info" });
  }
}

/**
 * 提示成功
 */
export function $mS(message) {
  ElMessage({ message: $t(message), grouping: true, showClose: true, type: "success" });
}

/**
 * 提示警告
 */
export function $mW(message) {
  ElMessage({ message: $t(message), grouping: true, showClose: true, type: "warning" });
}

/**
 * 提示错误
 */
export function $mE(message) {
  ElMessage({ message: $t(message), grouping: true, showClose: true, type: "error" });
}

/**
 * 提示消息
 */
export function $mI(message) {
  ElMessage({ message: $t(message), grouping: true, showClose: true, type: "info" });
}
