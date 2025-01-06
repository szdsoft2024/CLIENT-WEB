import _ from "lodash";
import searchHelpCommon from "./searchHelpCommon.vue";
import { createVNode, render } from "vue";
import { $m } from "../../common/utils/globalConfig";

let ctx;

/**
 * 搜索帮助弹出框
 *
 * @param {Object} shPar 以下是对象说明
 * a:baseField[基础字段] 必填
 * b:dataObj[更改的数据(对象或数组)] :help="{}" 可选 @help="szdSh({})" 必填
 * c:baseMapping[映射关系] 如：['字段(目标)-字段(源)','字段(目标和源相同)','字段(目标)-*（*代表默认字段或第一字段）'] :help="{}" 可选 @help="szdSh({})" 必填
 * d:baseSelect[查询条件] 如：[['字段',值],['字段',值]] 可选
 * e:disabled[不能赋值] true 不可以赋值
 * f:type[类型]  可选 默认单选 [1单选 2多选 6多选用逗号分隔赋值]
 * g:rowIndex [多行赋值时的行号]（行赋值必传）如：scope.$index 可选
 *
 * @returns {Promise<res>} 返回参数说明
 * 返回对象 {data:[选中的行数据],param:{参数如默认字段},chgValue 选择的值,chgFlag:bool值 true更改 false未更改,chaField:{更改字段:{新值,旧值}}};
 * 返回boolean 直接关闭窗口返回false
 *
 * 使用说明
 * <szd-input @help="szdSh({})">
 * <szd-input :help="{}" @change="">
 * <@click="szdSh({})"/>
 */
export function szdSh(shPar) {
  return new Promise(resolve => {
    szdShShow(shPar).then(res => {
      if (shPar.e !== true && res && res.data.length > 0) {
        //映射关系转化为数组
        let arrMapping = [];
        if (shPar.c) {
          for (let i = 0; i < shPar.c.length; i++) {
            let temp_arr = shPar.c[i].split("-");
            if (temp_arr.length > 1 && temp_arr[1]) {
            } else {
              temp_arr[1] = temp_arr[0];
            }
            //设置缺省值字段
            if (temp_arr[1] === "*") {
              temp_arr[1] = res.param.defFieldId;
            }
            arrMapping.push(temp_arr);
          }
        }
        //添加更改状态
        res["chgFlag"] = false;
        res["chgField"] = {};
        res["chgValue"] = undefined;
        //赋值
        if (shPar.f === 2) {
          //多选赋值
          szdSh2(shPar.b, arrMapping, res, shPar.g);
        } else if (shPar.f === 6) {
          //多选用逗号分隔赋值
          szdSh6(shPar.b, arrMapping, res);
        } else {
          //单选赋值
          szdSh1(shPar.b, arrMapping, res);
        }
        resolve(res);
      } else {
        resolve(false);
      }
    });
  });
}

/**
 * 调用搜索帮助窗口
 *
 * @param {Object} shPar 以下是对象说明
 * a:baseField[基础字段] 必填
 * d:baseSelect[查询条件] 如：[['字段',值],['字段',值]] 可选
 * f:type[类型]  可选默认单选 [1单选 2多选 6多选用逗号分隔赋值]
 *
 * @returns {Promise<res>} 返回参数说明
 * 返回对象 {data:[选中的行数据],param:{参数如默认字段}}
 * 返回boolean 直接关闭窗口返回false
 */
export function szdShShow(shPar) {
  return new Promise(resolve => {
    const div = document.createElement("div");
    const baseField = shPar.a;
    const multipleChoice = shPar.f === 2 || shPar.f === 6 ? 2 : 1;
    const baseSelect = shPar.d;
    const vNode = createVNode(searchHelpCommon, {
      baseField,
      multipleChoice,
      baseSelect,
      onHandleSH: retObj => {
        resolve(retObj);
      },
      onCloseDialog: type => {
        if (type !== "okay") {
          resolve(false);
        }
        document.body.removeChild(div);
      }
    });
    vNode.appContext = ctx;
    document.body.appendChild(div);
    render(vNode, div);
  });
}

//单选赋值
function szdSh1(dataObj, arrMapping, res) {
  if (arrMapping.length === 0) {
    res.chgValue = res.data[0][res.param.defFieldId];
    return;
  }
  //检查数据对象
  if (!_.isObject(dataObj)) {
    $m("CORE_CLIENT.E075"); //参数b的数据类型错误，应为对象类型
    return;
  }
  for (let i = 0; i < arrMapping.length; i++) {
    if (i === 0) {
      res.chgValue = res.data[0][arrMapping[i][1]];
    }
    if (dataObj[arrMapping[i][0]] !== res.data[0][arrMapping[i][1]]) {
      if (i === 0) {
        res.chgFlag = true;
      }
      res.chgField[arrMapping[i][0]] = {
        oVal: dataObj[arrMapping[i][0]],
        nVal: res.data[0][arrMapping[i][1]]
      };
      dataObj[arrMapping[i][0]] = res.data[0][arrMapping[i][1]];
    }
  }
}

//2 多选赋值
function szdSh2(dataObj, arrMapping, res, rowIndex) {
  if (arrMapping.length === 0) {
    res.chgValue = res.data[0][res.param.defFieldId];
    return;
  }
  //检查数据对象
  if (!Array.isArray(dataObj)) {
    $m("CORE_CLIENT.E076"); //参数b的数据类型错误，应为数组类型
    return;
  }
  //当前点击行赋值
  let rowData = dataObj[rowIndex];
  for (let i = 0; i < arrMapping.length; i++) {
    if (i === 0) {
      res.chgValue = res.data[0][arrMapping[i][1]];
    }
    if (rowData[arrMapping[i][0]] !== res.data[0][arrMapping[i][1]]) {
      if (i === 0) {
        res.chgFlag = true;
      }
      res.chgField[arrMapping[i][0]] = {
        oVal: rowData[arrMapping[i][0]],
        nVal: res.data[0][arrMapping[i][1]]
      };
      rowData[arrMapping[i][0]] = res.data[0][arrMapping[i][1]];
    }
  }
  //多行赋值，克隆当前点击行，同时清空值
  if (res.data && res.data.length > 1) {
    res.chgFlag = true;
    for (let i = 1; i < res.data.length; i++) {
      let tempRow = {};
      for (let key in rowData) {
        tempRow[key] = "";
      }
      for (let j = 0; j < arrMapping.length; j++) {
        tempRow[arrMapping[j][0]] = res.data[i][arrMapping[j][1]];
      }
      dataObj.push(tempRow);
    }
  }
}

//6 多选赋值以逗号分隔
function szdSh6(dataObj, arrMapping, res) {
  if (arrMapping.length === 0) {
    res.chgValue = res.data[0][res.param.defFieldId];
    return;
  }
  //检查数据对象
  if (!_.isObject(dataObj)) {
    $m("CORE_CLIENT.E075"); //参数b的数据类型错误，应为对象类型
    return;
  }
  let jsonTemp = {};
  for (let i = 0; i < res.data.length; i++) {
    for (let j = 0; j < arrMapping.length; j++) {
      if (!jsonTemp[arrMapping[j][0]]) {
        jsonTemp[arrMapping[j][0]] = res.data[i][arrMapping[j][1]];
      } else {
        jsonTemp[arrMapping[j][0]] = jsonTemp[arrMapping[j][0]] + "," + res.data[i][arrMapping[j][1]];
      }
    }
  }
  for (let j = 0; j < arrMapping.length; j++) {
    if (j === 0) {
      res.chgValue = jsonTemp[arrMapping[j][0]];
    }
    if (dataObj[arrMapping[j][0]] !== jsonTemp[arrMapping[j][0]]) {
      if (j === 0) {
        res.chgFlag = true;
      }
      res.chgField[arrMapping[j][0]] = {
        oVal: dataObj[arrMapping[j][0]],
        nVal: jsonTemp[arrMapping[j][0]]
      };
      dataObj[arrMapping[j][0]] = jsonTemp[arrMapping[j][0]];
    }
  }
}

/**
 * 设置上下文
 */
const setShApp = function (app) {
  ctx = app._context;
};

export default setShApp;
