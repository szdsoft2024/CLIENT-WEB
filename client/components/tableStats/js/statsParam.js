import store from "~store";
import _ from "lodash";
import { setLayVar, setSelData } from "./statsLayout";

const const_type = ["string", "number", "boolean", "date", "datetime", "time", "year", "month", "button", "sub-table"]; //数据类型
const const_type_align = ["boolean", "date", "datetime", "time", "year", "month"]; //数据类型-居中

//布局
export function initStatsLay(layout, fieldCat) {
  let _lay = {
    layout: {}, //表格样式
    fCatCol: [], //列目录数组
    fCatUse: {}, //列目录对象 字段:{}
    tBar: {}, //工具栏按钮
    sortRule: [], //排序规则

    fCatSta: [], //分析字段
    fCatDim: [], //维度字段
    fCatTar: [] //指标字段
  };
  //表格样式
  _lay.layout = tableLayout(layout);
  //工具栏按钮
  _lay.tBar = tableBar(_lay.layout);
  //表格列目录
  let parent = []; //父级对象 [{ field: , label: }]
  _lay.fCatCol = tableFCat(fieldCat, _lay.layout, _lay.fCatUse, parent);

  return _lay;
}

//表格样式
function tableLayout(params) {
  return {
    report: params.report ? params.report : "", //程序名称
    varMode: params.varMode === "A" ? "A" : "U", //变式模式：U.仅自己可用，A.所有人可用，默认
    styleRow: "$SZDStyleRow", //行样式设置字段  表格未维护，直接进行回调
    // styleCell: params.styleCell, //单元样式设置字段 表格未维护，直接进行回调
    selection: false, //显示选择列
    showSummary: false, //汇总
    sort: "1", //排序 0.不启用排序 1.前端排序 2后端排序
    merge: "2", //排序合并单元格 0.不合并 1.按列值相同合并 2.按排序梯次合并
    filter: true, //过滤 false.不启用过滤 true.前端过滤
    pagination: "0", //分页方式 0.不分页 1.前端分页 2.后端分页

    //内部参数
    $SZDUserId: store.state.loginUser.user.userId,
    $SZDVar: {}
  };
}

//工具栏按钮
function tableBar() {
  return {
    hide: false, //隐藏工具栏
    edit: false, //编辑表单
    btnHide: ["$statistics"], //按钮隐藏
    btnDisabled: [], //按钮不可用
    btns: [{ fCode: "statistics", tip: "统计分析", icon: "PieChart" }] //按钮清单
  };
}

//表格列设置
function tableFCat(fieldCat, layout, fCatUse, parent) {
  let fCatCol = [];
  for (let i = 0; i < fieldCat.length; i++) {
    const item = fieldCat[i];
    if (item.type === "button" || item.type === "sub-table") continue;
    //列字段键值尾款和重复检查
    if (!item.field || !item.label || fCatUse[item.field]) {
      console.error("列字段代码field不能重复和为空，且列名称label不能为空:" + item.field);
      continue;
    }
    //添加列头
    if (_.isArray(item.children) && item.children.length > 0) {
      //添加多表头
      const fCatColItem = tableFCatHeader(item, layout, fCatUse, parent);
      if (fCatColItem) {
        fCatUse[item.field] = fCatColItem;
        fCatCol.push(fCatColItem);
      }
    } else {
      //列目录对象
      fCatUse[item.field] = tableFCatItem(item, layout, parent);
      //添加列字段
      fCatCol.push(fCatUse[item.field]);
    }
  }
  return fCatCol;
}

//多级表头
function tableFCatHeader(item, layout, fCatUse, parent) {
  //添加父级节点
  let _parent = _.cloneDeep(parent);
  _parent.push({ field: item.field, label: item.label });
  //获取子节点目录
  const fCatColChild = tableFCat(item.children, layout, fCatUse, _parent);
  if (fCatColChild.length > 0) {
    return {
      field: item.field, //字段
      label: item.label,
      children: _.cloneDeep(fCatColChild),
      //内部参数
      $SZDPos: 0, //内部参数-输出位置
      $SZDCol: false, //内部传输-true 数据列 false 多表头表头
      $SZDParent: parent.length > 0 ? _.cloneDeep(parent) : false, //存在多表头赋值，否则为false
      $SZDDot: false //内部参数-是否设置小数位和千分位
    };
  } else {
    return false;
  }
}

//表格列设置
function tableFCatItem(item, layout, parent) {
  let fCat = {
    field: item.field, //字段
    label: item.label ? item.label : item.field, //列名称
    labelAndParent: "", //列名称(父级标签)
    width: _.isNumber(item.width) ? item.width : undefined, //宽度
    minWidth: _.isNumber(item.minWidth) ? item.minWidth : undefined, //最小宽度
    align: undefined, //对齐方式:left center right
    fixed: false, //固定列
    //数据维护
    edit: false, //编辑
    type: const_type.includes(item.type) ? item.type : "string", //数据类型
    numDot: item.type === "number" ? (_.isBoolean(item.numDot) ? item.numDot : true) : false, //千分位符
    numDec: item.type === "number" && !isNaN(item.numDec) ? item.numDec : undefined, //小数位位数
    noZero: _.isBoolean(item.noZero) ? item.noZero : false, //不输出0
    //列汇总 0.不汇总 1.合计 2.平均值 3.最小值 4.最大值 5.统计行数
    doSum: "0",
    //控件类型
    ctrlType: undefined, //控件类型
    ctrlParam: undefined, //控件参数（参数项参照各控件参数配置 disable readOnly 不能使用）
    //点击事件
    click: false,
    //表头设置
    required: false, //必输
    helpTip: "", //表头提示
    sort: true, //排序
    merge: true, //合并单元格
    filter: true, //过滤
    //内部参数
    $SZDPos: 0, //内部参数-输出位置
    $SZDCol: true, //内部传输-true 数据列 false 多表头表头
    $SZDParent: parent.length > 0 ? _.cloneDeep(parent) : false, //存在多表头赋值，否则为false
    $SZDDot: false //内部参数-是否设置小数位和千分位
  };

  //标签和父标签名称
  if (parent.length === 0) {
    fCat.labelAndParent = fCat.label;
  } else {
    parent.forEach(itemParent => {
      fCat.labelAndParent = fCat.labelAndParent ? fCat.labelAndParent + ">" + itemParent.label : itemParent.label;
    });
    fCat.labelAndParent = fCat.label + "(" + fCat.labelAndParent + ")";
  }

  //设置对齐方式
  if (["left", "center", "right"].includes(item.align)) {
    fCat.align = item.align;
  } else if (fCat.type === "number") {
    fCat.align = "right";
  } else if (const_type_align.includes(fCat.type)) {
    fCat.align = "center";
  }

  //是否使用千分位和小数位转换
  if (fCat.numDot || !isNaN(fCat.numDec)) {
    fCat.$SZDDot = true;
  }

  return fCat;
}

//初始化默认样式
export function initLayVarDef(lay, varObj) {
  setLayVar(lay, varObj);
}

//初始化排序设置
export function initLayStats(lay, stats) {
  if (!stats) return;
  //设置选择的数据
  if (stats.catsDim || stats.catsTar) {
    setSelData(lay, stats);
  }
}
