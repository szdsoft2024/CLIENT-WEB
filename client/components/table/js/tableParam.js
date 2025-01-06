import store from "~store";
import _ from "lodash";
import { $t } from "../../../common/utils/globalConfig";
import { setLayVar, setSelDataSortRule } from "./tableLayout";

const const_type = ["string", "number", "boolean", "array", "date", "datetime", "time", "year", "month", "svg", "button"]; //数据类型
const const_type_align_center = ["boolean", "date", "datetime", "time", "year", "month"]; //数据类型-居中
const const_ctrlType = ["input", "input-number", "date", "time", "checkbox", "radio", "select", "textarea", "svg", "button"]; //控件类型
//工具类默认按钮
const const_btn_type = ["", "primary", "success", "warning", "danger", "info"];
const const_toolbar_edit = ["$add", "$copy", "$del", "$uploadFold"];
const const_toolbar = [
  { fCode: "$add", tip: "新增行", icon: "Plus", noAuth: false },
  { fCode: "$del", tip: "删除行", icon: "Minus", noAuth: false },
  { fCode: "$copy", tip: "复制行", icon: "CopyDocument", noAuth: false },
  {
    fCode: "$uploadFold",
    icon: "Upload",
    noAuth: false,
    children: [
      { fCode: "$upload", label: "上传Excel", icon: "Upload", noAuth: false },
      { fCode: "$template", label: "下载模板", icon: "Tickets", noAuth: false }
    ]
  },
  { fCode: "$layout", tip: "管理布局", icon: "Grid", noAuth: true },
  {
    fCode: "$sortFold",
    icon: "Sort",
    noAuth: true,
    children: [
      { fCode: "$sort", label: "设置排序", icon: "Sort", noAuth: true },
      { fCode: "$sortCancel", label: "取消排序", icon: "Delete", noAuth: true }
    ]
  },
  {
    fCode: "$filterFold",
    icon: "Filter",
    noAuth: true,
    children: [
      { fCode: "$filter", label: "设置过滤", icon: "Filter", noAuth: true },
      { fCode: "$filterCancel", label: "取消过滤", icon: "Delete", noAuth: true }
    ]
  },
  // { fCode: "$print", tip: "打印", icon: "Printer",noAuth:true },
  {
    fCode: "$exportFold",
    icon: "Download",
    noAuth: true,
    children: [
      { fCode: "$export", label: "导出Excel", icon: "Download", noAuth: true }
      // { fCode: "$todo", label: "推送代办", tip: "推送代办", icon: "Document",noAuth:true },
      // { fCode: "$email", label: "推送邮件", tip: "推送邮件", icon: "Message",noAuth:true }
    ]
  },
  { fCode: "$statistics", tip: "统计分析", icon: "PieChart", noAuth: true }
];

//获取表格静态参数
export function getTableParams() {
  return {
    const_toolbar_edit: _.cloneDeep(const_toolbar_edit),
    const_toolbar: _.cloneDeep(const_toolbar)
  };
}

//布局
export function initTableLay(layout, fieldCat, toolbar, sortRule) {
  let _lay = {
    layout: {}, //表格样式
    fCatCol: [], //列目录数组
    fCatUse: {}, //列目录对象 字段:{}
    tBar: {}, //工具栏按钮
    sortRule: [], //排序规则
    fRanges: {}, //过滤数据
    //详情布局
    viewLay: {
      viewCat: [], //页标签信息
      fieldArr: [], //详情中指定主表字段，用于在详情中删除字段
      subTableArr: [] //详情中指定子表字段，详情中子表不存在，进行初始化
    }
  };
  //隐藏按钮
  let btnHide = _.isArray(toolbar.btnHide) ? _.cloneDeep(toolbar.btnHide) : []; //按钮隐藏
  //表格样式
  _lay.layout = tableLayout(layout, btnHide);
  //工具栏按钮
  _lay.tBar = tableBar(toolbar, btnHide, _lay.layout);
  //表格列目录
  let parent = []; //父级对象 [{ field: , label: }]
  _lay.fCatCol = tableFCat(fieldCat, _lay.layout, _lay.fCatUse, parent);
  //设置排序规则
  setSelDataSortRule(_lay, sortRule);
  //详情样式
  _lay.viewLay = setViewCat(layout, _lay.fCatUse);

  return _lay;
}

//表格样式
function tableLayout(params, btnHide) {
  let layout = {
    report: params.report ? params.report : "", //程序名称
    varMode: params.varMode === "A" ? "A" : "U", //变式模式：U.仅自己可用，A.所有人可用，默认
    styleRow: params.styleRow, //行样式设置字段  表格未维护，直接进行回调
    styleCell: params.styleCell, //单元样式设置字段 表格未维护，直接进行回调
    optionCell: params.optionCell, //控件控制，设置编辑状态
    viewMode: ["0", "1", "2", "3"].includes(params.viewMode) ? params.viewMode : "0", //详情 0.不显示详情,1.单页面 2.多表头Tab页面 3.指定Tab页面（根据viewCat设置）
    viewTitle: params.viewTitle, //详情页标题字段 行上数据的字段
    light: params.light, //指示灯标识 列字段 列值为： 1.红 2.黄 3.绿 其它灰色
    selection: ["0", "1", "2"].includes(params.selection) ? params.selection : "0", //显示选择列 0.不显示 1.显示 2.显示固定
    showSummary: _.isBoolean(params.showSummary) ? params.showSummary : true, //汇总
    sort: ["0", "1", "2"].includes(params.sort) ? params.sort : "1", //排序 0.不启用排序 1.前端排序 2后端排序
    merge: ["0", "1", "2"].includes(params.merge) ? params.merge : "2", //排序合并单元格 0.不合并 1.按列值相同合并 2.按排序梯次合并
    filter: _.isBoolean(params.filter) ? params.filter : true, //过滤 false.不启用过滤 true.前端过滤
    dragRow: _.isBoolean(params.dragRow) && params.rowKey ? params.dragRow : false, //行拖动，必选维护 row-key 且在行数据中唯一
    rowKey: params.rowKey, //拖拽时row-key必填
    pagination: ["0", "1", "2"].includes(params.pagination) ? params.pagination : "2", //分页方式 0.不分页 1.前端分页 2.后端分页
    impTmpCode: params.impTmpCode, //导入模板代码
    impTmpName: params.impTmpName, //导入模板名称

    //内部参数
    $SZDUserId: store.state.loginUser.user.userId,
    $SZDVar: {}
  };

  if (layout.dragRow && !layout.rowKey) {
    layout.dragRow = false;
  }

  if (layout.dragRow) {
    layout.sort = "0";
    layout.merge = "0";
    layout.filter = false;
  }
  if (btnHide.includes("$sort")) {
    layout.sort = "0";
  }
  if (layout.sort === "0") {
    btnHide.push("$sortFold");
    btnHide.push("$sort");
    btnHide.push("$sortCancel");
  }
  if (btnHide.includes("$filter")) {
    layout.filter = false;
  }
  if (!layout.filter) {
    btnHide.push("$filterFold");
    btnHide.push("$filter");
    btnHide.push("$filterCancel");
  }
  return layout;
}

//工具栏按钮
function tableBar(params, btnHide, layout) {
  let bar = {
    hide: _.isBoolean(params.hide) ? params.hide : false, //隐藏工具栏
    edit: _.isBoolean(params.edit) ? params.edit : false, //编辑表单
    btnHide: _.cloneDeep(btnHide), //按钮隐藏
    btnDisabled: _.isArray(params.btnDisabled) ? _.cloneDeep(params.btnDisabled) : [], //按钮不可用
    btns: [] //按钮清单
  };
  //不显示工具栏,直接返回
  if (bar.hide) return bar;
  //标准按钮
  for (let i = 0; i < const_toolbar.length; i++) {
    tableBarAddBtn(bar, bar.btns, const_toolbar[i], layout);
  }
  //添加扩展按钮
  if (params.btns && _.isArray(params.btns)) {
    for (let i = 0; i < params.btns.length; i++) {
      //自定义按钮不允许以$开始
      if (params.btns[i].fCode && !params.btns[i].fCode.startsWith("$")) {
        tableBarAddBtn(bar, bar.btns, params.btns[i], layout);
      }
    }
  }
  //不存在按钮设置为隐藏
  if (bar.btns.length === 0) bar.hide = true;
  //如果按钮是编辑状态，多选框必须存在
  if (bar.edit && layout.selection === "0" && !bar.hide) layout.selection = "1";

  return bar;
}

function tableBarAddBtn(bar, btns, item, layout) {
  //按钮代码不存在直接返回
  if (!item.fCode) return;
  //隐藏按钮直接返回
  if (bar.btnHide.includes(item.fCode)) return;
  //添加非隐藏按钮
  if (bar.edit || (!bar.edit && !const_toolbar_edit.includes(item.fCode))) {
    let l_btn = {
      type: const_btn_type.includes(item.type) ? item.type : "primary",
      fCode: item.fCode,
      label: item.label,
      tip: item.tip,
      icon: item.icon,
      color: item.color,
      disabled: bar.btnDisabled.includes(item.fCode),
      noAuth: _.isBoolean(item.noAuth) ? item.noAuth : false,
      fstHide: false
    };
    //翻译
    l_btn.label = $t(l_btn.label);
    l_btn.tip = $t(l_btn.tip);
    //添加子按钮
    if (item.children && _.isArray(item.children)) {
      l_btn["children"] = [];
      for (let j = 0; j < item.children.length; j++) {
        //防止无限添加children
        if (item.children[j].children) {
          item.children[j].children = undefined;
        }
        //添加子按钮
        tableBarAddBtn(bar, l_btn.children, item.children[j], layout);
      }
    }
    //设置按钮
    btns.push(l_btn);
  }
}

//表格列设置
function tableFCat(fieldCat, layout, fCatUse, parent) {
  let fCatCol = []; //列目录数组
  for (let i = 0; i < fieldCat.length; i++) {
    const item = fieldCat[i];
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
    let fCatColItem = {
      field: item.field, //字段
      label: item.label,
      children: _.cloneDeep(fCatColChild),
      hide: _.isBoolean(item.hide) ? item.hide : false, //隐藏
      //内部参数
      $SZDPos: 0, //内部参数-输出位置
      $SZDCol: false, //内部传输-true 数据列 false 多表头表头
      $SZDParent: parent.length > 0 ? _.cloneDeep(parent) : false, //存在多表头赋值，否则为false
      $SZDDot: false //内部参数-是否设置小数位和千分位
    };
    //翻译
    fCatColItem.label = $t(fCatColItem.label);
    //查找子节点是否显示
    if (!fCatColItem.hide) {
      const _temp = fCatColChild.find(itemChild => itemChild.hide === false);
      if (!_temp) fCatColItem.hide = true;
    }
    return fCatColItem;
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
    hide: _.isBoolean(item.hide) ? item.hide : false, //隐藏
    fixed: parent.length === 0 ? (["left", "right"].includes(item.fixed) ? item.fixed : false) : false, //固定列
    //数据维护
    edit: _.isBoolean(item.edit) ? item.edit : item.type === "button", //编辑
    type: const_type.includes(item.type) ? item.type : "string", //数据类型
    numDot: item.type === "number" ? (_.isBoolean(item.numDot) ? item.numDot : true) : false, //千分位符
    numDec: item.type === "number" && !isNaN(item.numDec) ? item.numDec : undefined, //小数位位数
    noZero: item.type === "number" && _.isBoolean(item.noZero) ? item.noZero : false, //不输出0
    importSplit: item.importSplit, //数据导入分割符
    //列汇总 0.不汇总 1.合计 2.平均值 3.最小值 4.最大值 5.统计行数
    doSum: ["0", "1", "2", "3", "4", "5"].includes(item.doSum) ? item.doSum : "0",
    //控件类型
    ctrlType: const_ctrlType.includes(item.ctrlType) ? item.ctrlType : undefined, //控件类型
    ctrlParam: undefined, //控件参数（参数项参照各控件参数配置 disable readOnly 不能使用）
    //点击事件
    click: item.click ? item.click : false,
    //表头设置
    required: _.isBoolean(item.required) ? item.required : false, //必输
    helpTip: item.helpTip, //表头提示
    sort: false, //排序
    merge: false, //合并单元格
    filter: false, //过滤
    //内部参数
    $SZDPos: 0, //内部参数-输出位置
    $SZDCol: true, //内部传输-true 数据列 false 多表头表头
    $SZDParent: parent.length > 0 ? _.cloneDeep(parent) : false, //存在多表头赋值，否则为false
    $SZDDot: false //内部参数-是否设置小数位和千分位
  };

  //翻译
  fCat.label = $t(fCat.label);

  //标签和父标签名称
  if (parent.length > 0) {
    parent.forEach(itemParent => {
      fCat.labelAndParent = fCat.labelAndParent ? fCat.labelAndParent + ">" + itemParent.label : itemParent.label;
    });
    fCat.labelAndParent = fCat.label + "(" + fCat.labelAndParent + ")";
  } else {
    fCat.labelAndParent = fCat.label;
  }

  //设置对齐方式
  if (["left", "center", "right"].includes(item.align)) {
    fCat.align = item.align;
  } else if (fCat.type === "number") {
    fCat.align = "right";
  } else if (const_type_align_center.includes(fCat.type)) {
    fCat.align = "center";
  }

  //是否使用千分位和小数位转换
  if (fCat.numDot || !isNaN(fCat.numDec)) {
    fCat.$SZDDot = true;
  }

  //非数值型汇总
  if ((fCat.type !== "number" && ["1", "2"].includes(fCat.doSum)) || fCat.type === "button") {
    fCat.doSum = "0";
  }

  //点击事件
  if (fCat.click && ["boolean", "array", "button"].includes(fCat.type)) {
    fCat.click = false;
  }

  //排序、合并、过滤设置，按钮不允许此操作
  if (["array", "button", "svg"].includes(fCat.type)) {
    fCat.sort = false;
    fCat.merge = false;
    fCat.filter = false;
  } else {
    //排序设置
    if (layout.sort === "0") {
      fCat.sort = false;
    } else if (layout.sort === "1") {
      fCat.sort = _.isBoolean(item.sort) ? item.sort : true;
    } else {
      fCat.sort = _.isBoolean(item.sort) ? item.sort : false;
    }
    //合并单元格
    if (layout.merge !== "0" && !fCat.edit) {
      fCat.merge = _.isBoolean(item.merge) ? item.merge : fCat.type !== "number"; //默认数值不合并
    }
    //过滤设置
    if (!layout.filter) {
      fCat.filter = false;
    } else {
      fCat.filter = _.isBoolean(item.filter) ? item.filter : true;
    }
  }

  //控件设置
  if (fCat.ctrlType || fCat.edit || fCat.type === "button" || fCat.type === "svg") {
    setCtrl(fCat, item.ctrlParam);
  }

  //控件不能合并
  if (fCat.ctrlType) {
    fCat.merge = false;
  }

  return fCat;
}

//控件及参数设置
function setCtrl(fCat, ctrlParam) {
  //控件类型 ["string", "number", "boolean", "array", "date", "datetime", "time", "year", "month", "svg", "button"]
  switch (fCat.type) {
    case "string":
      if (!["input", "radio", "select", "textarea"].includes(fCat.ctrlType)) fCat.ctrlType = "input";
      break;
    case "number":
      if (!["input", "input-number", "radio", "select"].includes(fCat.ctrlType)) fCat.ctrlType = "input";
      break;
    case "boolean":
      fCat.ctrlType = "checkbox";
      break;
    case "array":
      fCat.ctrlType = "checkbox";
      break;
    case "time":
      fCat.ctrlType = "time";
      break;
    case "svg":
      fCat.ctrlType = "svg";
      break;
    case "button":
      fCat.ctrlType = "button";
      break;
    default:
      fCat.ctrlType = "date";
      break;
  }
  //控件参数 ["input", "input-number", "date", "time", "checkbox", "radio", "select", "textarea", "svg", "button"];
  switch (fCat.ctrlType) {
    case "input":
      setCtrlInput(fCat, ctrlParam);
      break;
    case "input-number":
      setCtrlInputNumber(fCat, ctrlParam);
      break;
    case "time":
      setCtrlTime(fCat, ctrlParam);
      break;
    case "checkbox":
      setCtrlCheckbox(fCat, ctrlParam);
      break;
    case "radio":
      setCtrlRadio(fCat, ctrlParam);
      break;
    case "select":
      setCtrlSelect(fCat, ctrlParam);
      break;
    case "textarea":
      setCtrlTextarea(fCat, ctrlParam);
      break;
    case "svg":
      setCtrlSvg(fCat, ctrlParam);
      break;
    case "button":
      setCtrlButton(fCat, ctrlParam);
      break;
    default:
      setCtrlDate(fCat, ctrlParam);
      break;
  }
}

//控件及参数设置 input
function setCtrlInput(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    type: fCat.type, //类型支持string,number
    numDot: fCat.numDot, //千分位符
    numDec: fCat.numDec, //类型支持string,number
    numMax: _.isNumber(ctrlParam.numMax) ? ctrlParam.numMax : undefined, //最大值
    numMin: _.isNumber(ctrlParam.numMin) ? ctrlParam.numMin : undefined, //最小值
    placeholder: ctrlParam.placeholder, //占位符
    maxlength: _.isNumber(ctrlParam.maxlength) ? ctrlParam.maxlength : undefined, //最大长度
    showHelp: _.isBoolean(ctrlParam.showHelp) ? ctrlParam.showHelp : false, //显示搜索帮助

    //仅在Table中使用，如果baseField为空，则回调事件
    baseField: ctrlParam.baseField, //基础字段
    baseMapping: ctrlParam.baseMapping, //字段映射 数组 ['字段(目标)-字段(源)','字段(目标和源相同)]
    baseSelect: ctrlParam.baseSelect, //查询条件，数组 [['字段',"row.字段（row取行值）"],['字段',"值"]]

    readonly: ctrlParam.readonly, //仅显示
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false, //隐藏
    clearable: ctrlParam.clearable, //清空按钮
    dblclick: fCat.click, //双击事件
    align: fCat.align, //对齐方式
    noZero: fCat.noZero, //不输出0
    format: ctrlParam.format, //数据格式化
    descField: ctrlParam.descField ? ctrlParam.descField : "", //描述字段
    descSpan: _.isNumber(ctrlParam.descSpan) && ctrlParam.descField ? ctrlParam.descSpan : 0 //描述宽度
  };
}

//控件及参数设置 input-number
function setCtrlInputNumber(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    placeholder: ctrlParam.placeholder, //占位符
    max: _.isNumber(ctrlParam.max) ? ctrlParam.max : Infinity, //最大值
    min: _.isNumber(ctrlParam.min) ? ctrlParam.min : -Infinity, //最小值
    precision: fCat.numDec, //精度
    step: _.isNumber(ctrlParam.step) ? ctrlParam.step : 1, //步进
    controls: ctrlParam.controls, //控制按钮
    readonly: ctrlParam.readonly, //仅显示
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false //隐藏
  };
}

//控件及参数设置 date
function setCtrlDate(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    type: fCat.type, //类型
    placeholder: ctrlParam.placeholder, //占位符
    readonly: ctrlParam.readonly, //仅显示
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false, //隐藏
    clearable: ctrlParam.clearable //清空按钮
  };
}

//控件及参数设置 time
function setCtrlTime(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    placeholder: ctrlParam.placeholder, //占位符
    readonly: ctrlParam.readonly, //仅显示
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false, //隐藏
    clearable: ctrlParam.clearable //清空按钮
  };
}

//控件及参数设置 复选框 checkbox
function setCtrlCheckbox(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  if (fCat.type === "boolean") {
    fCat.ctrlParam = {
      disabled: !fCat.edit, //不可用
      hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false //隐藏
    };
  } else {
    fCat.ctrlParam = {
      baseField: ctrlParam.baseField, //多复选框 基础字段
      baseArr: ctrlParam.baseArr, //多复选框 数组[{svalue:"",sname:""}]
      max: ctrlParam.max, //多复选框 最大选择数
      min: ctrlParam.min, //多复选框 最小选择数
      checkboxAll: ctrlParam.checkboxAll, //多复选框 显示全选 true 显示在上边 left 在左边
      disabled: !fCat.edit, //不可用
      hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false //隐藏
    };
  }
}

//控件及参数设置 单选框 radio
function setCtrlRadio(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    baseField: ctrlParam.baseField, //基础字段
    baseArr: ctrlParam.baseArr, //数组
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false, //隐藏
    first: _.isBoolean(ctrlParam.first) ? ctrlParam.first : false //值为空默认第一个
  };
}

//控件及参数设置 下拉框 select
function setCtrlSelect(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    baseField: ctrlParam.baseField, //基础字段
    baseArr: ctrlParam.baseArr, //数组
    baseSelect: ctrlParam.baseSelect, //查询条件
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false, //隐藏
    clearable: ctrlParam.clearable, //清空按钮
    placeholder: ctrlParam.placeholder, //占位符
    first: _.isBoolean(ctrlParam.first) ? ctrlParam.first : false //值为空默认第一个
  };
}

//控件及参数设置 textarea
function setCtrlTextarea(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    placeholder: ctrlParam.placeholder, //占位符
    maxlength: _.isNumber(ctrlParam.maxlength) ? ctrlParam.maxlength : "", //最大值
    rows: _.isNumber(ctrlParam.rows) ? ctrlParam.rows : 1, //显示行数
    showWordLimit: _.isBoolean(ctrlParam.showWordLimit) ? ctrlParam.showWordLimit : true, //显示数字限制
    readonly: ctrlParam.readonly, //仅显示
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false //隐藏
  };
}

//控件及参数设置 svg
function setCtrlSvg(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    name: ctrlParam.name, //svg代码
    nameField: ctrlParam.nameField, //svg代码-动态
    fixed: _.isBoolean(ctrlParam.fixed) ? ctrlParam.fixed : false, //是否框架内置
    color: ctrlParam.color, //颜色
    colorField: ctrlParam.colorField, //动态颜色
    fontSize: fCat.fontSize, //字体大小
    labelField: ctrlParam.labelField, //显示标签
    click: _.isBoolean(ctrlParam.click) ? ctrlParam.click : false //是否点击事件
  };
}

//控件及参数设置 button
function setCtrlButton(fCat, ctrlParam) {
  if (ctrlParam && !_.isArray(ctrlParam)) {
    console.error("按钮列的参数应为数组" + fCat.field);
    return;
  }
  fCat.ctrlParam = [];
  if (_.isArray(ctrlParam)) {
    for (let i = 0; i < ctrlParam.length; i++) {
      if (ctrlParam[i].fCode) {
        fCat.ctrlParam.push({
          fCode: ctrlParam[i].fCode, //功能KEY
          label: ctrlParam[i].label ? ctrlParam[i].label : "", //功能名称
          tip: ctrlParam[i].tip, //提示消息
          type: const_btn_type.includes(ctrlParam[i].type) ? ctrlParam[i].type : "primary", //类型
          text: _.isBoolean(ctrlParam[i].text) ? ctrlParam[i].text : false, //是否为文字按钮
          link: _.isBoolean(ctrlParam[i].link) ? ctrlParam[i].link : true, //是否为链接按钮
          disabled: fCat.edit ? ctrlParam[i].disabled : true, //是否可用
          noAuth: _.isBoolean(ctrlParam[i].noAuth) ? ctrlParam[i].noAuth : false, //不控制权限
          icon: ctrlParam[i].icon ? ctrlParam[i].icon : undefined, //图标
          color: ctrlParam[i].color, //按钮颜色
          hide: _.isBoolean(ctrlParam[i].hide) ? ctrlParam[i].hide : false //是否隐藏
        });
      }
    }
  }
}

/*************************************
 * 设置详情
 **/
function setViewCat(mainLayout, fCatUse) {
  if (!mainLayout.viewCat || !Array.isArray(mainLayout.viewCat)) return false;
  let _viewLay = { viewCat: [], fieldArr: [], subTableArr: [] };
  for (let i = 0; i < mainLayout.viewCat.length; i++) {
    const item = mainLayout.viewCat[i];
    if (item.field && item.label && item.children && item.children.length > 0) {
      //详情信息
      let child = viewCatAddFCat(mainLayout, item.children, fCatUse, _viewLay, true);
      if (child.length > 0) {
        //详情信息-添加页签
        _viewLay.viewCat.push({ field: item.field, label: item.label, children: child });
      }
    }
  }
  return _viewLay;
}

// 添加详情字段目录
function viewCatAddFCat(mainLayout, viewCat, fCatUse, viewLay, language) {
  let fCat = [];
  for (let i = 0; i < viewCat.length; i++) {
    const item = viewCat[i];
    if (!item) continue;
    //指定字段
    if (_.isObject(item)) {
      if (item.field && item.children && item.children.length > 0) {
        //多层级
        if (item.field && item.label) {
          let child = viewCatAddFCat(mainLayout, item.children, fCatUse, viewLay, language);
          if (child.length > 0) {
            fCat.push({ field: item.field, label: language ? $t(item.label) : item.label, children: child });
            viewLay.fieldArr.push(item.field);
          }
        }
      } else if (item.field && item.fieldCat && item.fieldCat.length > 0) {
        //子表渲染
        fCat.push(viewCatAddSubTable(mainLayout, item));
        viewLay.subTableArr.push(item.field);
      } else if (item.field && item.label) {
        if (language) item.label = $t(item.label); //翻译
        //字段渲染
        fCat.push(viewCatAddFCatMove(mainLayout, item));
        viewLay.fieldArr.push(item.field);
      }
      continue;
    }
    //引用主表
    if (fCatUse[item]) {
      const mainFCat = _.cloneDeep(fCatUse[item]);
      if (mainFCat.children && mainFCat.children.length > 0) {
        let child = viewCatAddFCat(mainLayout, mainFCat.children, fCatUse, viewLay, false);
        if (child.length > 0) {
          fCat.push({ field: mainFCat.field, label: mainFCat.label, children: child });
        }
      } else {
        fCat.push(viewCatAddFCatMove(mainLayout, mainFCat));
      }
      viewLay.fieldArr.push(mainFCat.field);
    }
  }
  return fCat;
}

// 添加子表
function viewCatAddSubTable(mainLayout, item) {
  let subTableLay = {
    field: item.field,
    containerStyle: item.containerStyle, //容器样式
    layout: item.layout ? item.layout : {}, //布局
    fieldCat: _.isArray(item.fieldCat) ? item.fieldCat : [], //列目录
    toolbar: item.toolbar, //工具栏
    sortRule: _.isArray(item.sortRule) ? item.sortRule : [] //排序
  };
  //样式设置
  subTableLay.layout.sort = subTableLay.layout.sort === "2" ? subTableLay.layout.sort : "1";
  subTableLay.layout.pagination = "0"; //分页方式 0.不分页
  return subTableLay;
}

// 详情字段输出渲染赋值
function viewCatAddFCatMove(mainLayout, item) {
  let fCat = {
    field: item.field, //字段
    label: item.label ? item.label : item.field, //列名称
    align: undefined, //对齐方式:left center right
    hide: _.isBoolean(item.hide) ? item.hide : false, //隐藏
    //数据维护
    edit: _.isBoolean(item.edit) ? item.edit : false, //编辑
    type: const_type.includes(item.type) ? item.type : "string", //数据类型
    numDot: item.type === "number" ? (_.isBoolean(item.numDot) ? item.numDot : true) : false, //千分位符
    numDec: item.type === "number" && !isNaN(item.numDec) ? item.numDec : undefined, //小数位位数
    noZero: _.isBoolean(item.noZero) ? item.noZero : false, //不输出0
    //控件类型
    ctrlType: const_ctrlType.includes(item.ctrlType) ? item.ctrlType : undefined, //控件类型
    ctrlParam: undefined, //控件参数（参数项参照各控件参数配置 disable readOnly 不能使用）
    //点击事件
    click: item.click ? item.click : false,
    //表头设置
    required: _.isBoolean(item.required) ? item.required : false, //必输
    helpTip: item.helpTip, //表头提示
    //内部参数
    $SZDPos: 0, //内部参数-输出位置
    $SZDDot: false //内部参数-是否设置小数位和千分位
  };

  //设置对齐方式
  if (["left", "center", "right"].includes(item.align)) {
    fCat.align = item.align;
  } else if (fCat.type === "number") {
    fCat.align = "right";
  } else if (const_type_align_center.includes(fCat.type)) {
    fCat.align = "center";
  }

  //是否使用千分位和小数位转换
  if (fCat.numDot || !isNaN(fCat.numDec)) {
    fCat.$SZDDot = true;
  }

  //控件设置
  if (fCat.ctrlType || fCat.edit || fCat.type === "button") {
    setCtrl(fCat, item.ctrlParam);
  }

  return fCat;
}

//初始化默认样式
export function initLayVarDef(lay, varObj) {
  setLayVar(lay, varObj);
}
