import _ from "lodash";
import store from "~store";
import szdStoreSession from "../store/storeSession";
import szdRouter from "../utils/goRouter";
import { $m } from "../utils/globalConfig";
import { setLockOff, setLockOffBatch, setLockOn } from "../api/lock";

/**
 * 数据加锁
 * @param {String} lockCode 锁代码
 * @param {Object,Array} param 锁参数
 * @param {Boolean} closeWindow 加锁失败导航到首页
 * @return  {Promise} true 锁定成功 false 锁定失败
 *
 * */
export function lockOn(lockCode, param, closeWindow = false) {
  return new Promise(resolve => {
    //检查参数是否正确
    let json = lockCheck(lockCode, param);
    if (!json) {
      if (closeWindow) szdRouter.closeFrameTag();
      resolve(false);
      return;
    }

    //删除已加锁数据
    let locks = szdStoreSession.getLock();
    if (locks && locks.length > 0) {
      let _lockData = [];
      for (let i = 0; i < json.lockData.length; i++) {
        const temp = { routerCode: json.routerCode, lockCode: json.lockCode, lockData: json.lockData[i] };
        if (locks.findIndex(r => JSON.stringify(r) === JSON.stringify(temp)) === -1) {
          _lockData.push(json.lockData[i]);
        }
      }
      if (_lockData.length === 0) {
        resolve(true);
        return;
      }
      json.lockData = _lockData;
    }

    //加锁
    setLockOn(json).then(res => {
      if (res.code === 200) {
        if (res.data.retCode === "S") {
          //存储锁数据
          for (let i = 0; i < json.lockData.length; i++) {
            szdStoreSession.setLockAdd({
              routerCode: json.routerCode,
              lockCode: json.lockCode,
              lockData: json.lockData[i]
            });
          }
          resolve(true);
        } else {
          if (res.data.retCode === "E01") {
            $m("CORE_CLIENT.E092", res.data.retMsg); //数据已被用户 & 锁定
          } else {
            $m("CORE_CLIENT.E093", res.data.retMsg); //加锁异常 &
          }
          if (closeWindow) szdRouter.closeFrameTag();
          resolve(false);
        }
      } else {
        $m("CORE_CLIENT.E093"); //加锁异常 &
        if (closeWindow) szdRouter.closeFrameTag();
        resolve(false);
      }
    });
  });
}

/**
 * 数据解锁（注：关闭标签或浏览器，系统自动解锁，也可以不调用此方法）
 * @param {String} lockCode 锁代码
 * @param {Object,Array} param 锁参数
 * @param {String} routerCode 路由代码 用于检查页标签关闭，如使用onDeactivated事件，需要传输routerCode
 * @return  {Promise} true 解锁成功 false 解锁失败 ""不需要解锁
 * */
export function lockOff(lockCode, param, routerCode = "") {
  return new Promise(resolve => {
    //标签是否关闭
    if (routerCode && store.state.frameTag && store.state.frameTag.visitedViews.some(r => r.name === routerCode)) {
      resolve("");
      return;
    }

    //检查参数是否正确
    let json = lockCheck(lockCode, param);
    if (!json) {
      resolve(false);
      return;
    } else if (routerCode) {
      json.routerCode = routerCode;
    }

    //删除锁数据
    let _lockData = [];
    for (let i = 0; i < json.lockData.length; i++) {
      if (
        szdStoreSession.setLockDel({
          routerCode: json.routerCode,
          lockCode: json.lockCode,
          lockData: json.lockData[i]
        })
      ) {
        _lockData.push(json.lockData[i]);
      }
    }
    json.lockData = _lockData;

    //解锁
    if (json.lockData.length > 0) {
      setLockOff(json).then(() => {
        resolve(true);
      });
    } else {
      resolve(true);
    }
  });
}

/**
 * 检查锁参数是否正确
 * */
function lockCheck(lockCode, param) {
  if (!lockCode) {
    $m("CORE_CLIENT.E090"); //锁代码不能为空
    return false;
  }

  let json = {
    routerCode: szdRouter.getRouterCode(),
    lockCode: lockCode,
    lockData: []
  };

  if (Array.isArray(param) && param.length > 0) {
    json.lockData = param;
  } else if (_.isObject(param)) {
    json.lockData.push(param);
  } else if (param) {
    $m("CORE_CLIENT.E091"); //锁参数对象错误，只能是数组或对象
    return false;
  }
  return json;
}

/**
 * 释放tab标签所有锁
 * @param {Array} routerCodeArr 路由代码数组
 * */
export function lockTabOff(routerCodeArr) {
  if (routerCodeArr.length === 0) return;
  let locks = szdStoreSession.getLock();
  if (locks && locks.length > 0) {
    let _off = [];
    for (let i = 0; i < locks.length; i++) {
      if (routerCodeArr.includes(locks[i].routerCode)) {
        _off.push(locks[i]);
        szdStoreSession.setLockDel(locks[i]);
      }
    }
    if (_off.length > 0) {
      setLockOffBatch(_off).then();
    }
  }
}

/**
 * 释放ie标签所有锁
 * */
export function lockALLOff() {
  let locks = szdStoreSession.getLock();
  if (locks && locks.length > 0) {
    setLockOffBatch(locks).then();
  }
  szdStoreSession.removeLock();
}
