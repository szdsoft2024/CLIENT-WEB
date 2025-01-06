import { ElMessage } from "element-plus";
import { $t } from "../utils/globalConfig";

/**
 * 检查是否是空, 提示消息
 * @param val 检查的对象
 * @param {String} msg 报错消息
 */
function nullMsg(val, msg) {
  if (!val) {
    if (msg) ElMessage.error(msg);
    return true;
  } else {
    return false;
  }
}

/**
 * 检查是否是空并翻译消息, 提示消息，
 * @param val 检查的对象
 * @param {String} msg 报错消息
 */
function nullMsg$t(val, msg) {
  if (!val) {
    if (msg) ElMessage.error($t(msg));
    return true;
  } else {
    return false;
  }
}

const szdCheck = {
  nullMsg,
  nullMsg$t
};

export default szdCheck;
