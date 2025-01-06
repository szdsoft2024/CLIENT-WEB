import { ElMessageBox } from "element-plus";
import { $t } from "../utils/globalConfig";

/**
 * 确认提示
 * @param {String} msgText 消息
 * @param {Boolean} catchFlag 关闭触发catch
 */
export function szdPop(msgText = "", catchFlag = false) {
  return new Promise((resolve, reject) => {
    let msg = msgText ? msgText : "请确认?";
    ElMessageBox.alert($t(msg), $t("请确认"), {
      showCancelButton: true,
      confirmButtonText: $t("确定"),
      cancelButtonText: $t("取消"),
      type: "warning"
    })
      .then(() => {
        resolve(true);
      })
      .catch(action => {
        if (catchFlag) {
          reject(false);
        }
      });
  });
}

/**
 * 保存确认提示
 * @param {String} msgText 消息
 * @param {Boolean} catchFlag 关闭触发catch
 */
export function szdPopSave(msgText = "", catchFlag = false) {
  return new Promise((resolve, reject) => {
    let msg = msgText ? msgText : "数据保存，请确认?";
    ElMessageBox.alert($t(msg), $t("警告"), {
      showCancelButton: true,
      confirmButtonText: $t("确定"),
      cancelButtonText: $t("取消"),
      type: "warning"
    })
      .then(() => {
        resolve(true);
      })
      .catch(action => {
        if (catchFlag) {
          reject(false);
        }
      });
  });
}

/**
 * 删除确认提示
 * @param {String} msgText 消息
 * @param {Boolean} catchFlag 关闭触发catch
 */
export function szdPopDel(msgText = "", catchFlag = false) {
  return new Promise((resolve, reject) => {
    let msg = msgText ? msgText : "数据将被删除，请确认?";
    ElMessageBox.alert($t(msg), $t("警告"), {
      showCancelButton: true,
      confirmButtonText: $t("确定"),
      cancelButtonText: $t("取消"),
      type: "warning"
    })
      .then(() => {
        resolve(true);
      })
      .catch(action => {
        if (catchFlag) {
          reject(false);
        }
      });
  });
}
