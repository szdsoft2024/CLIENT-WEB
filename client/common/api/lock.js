import request from "../utils/request";

// 数据加锁
export function setLockOn(data) {
  return request({
    url: "/core/lock/on",
    method: "post",
    data: data
  });
}

// 数据解锁
export function setLockOff(data) {
  return request({
    url: "/core/lock/off",
    method: "post",
    data: data
  });
}

// 数据解锁
export function setLockOffBatch(data) {
  return request({
    url: "/core/lock/off/batch",
    method: "post",
    data: data
  });
}
