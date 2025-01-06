import store from "~store";
import _ from "lodash";

const const_type = ["string", "number", "boolean", "date", "datetime", "time", "year", "month"]; //数据类型
const const_btn_type = ["", "primary", "success", "warning", "danger", "info"]; //按钮样式
//默认样式
const const_btns = [
  { fCode: "$search", label: "查询", icon: "Search" },
  { fCode: "$reset", label: "重置", icon: "Refresh" },
  { fCode: "$layout", label: "变式", icon: "Grid" },
  { fCode: "$more", label: "更多筛选", icon: "ArrowDown" }
];

//布局
export function initSchLay(schLay) {
  let _lay = {
    layout: {}, //布局样式
    schCat: [], //搜索目录
    schBtn: [] //功能按钮
  };
  //表格样式
  _lay.layout = initLayout(schLay.layout);
  //搜索条件目录
  _lay.schCat = initSchCat(_lay.layout, schLay.schCat);
  //工具栏按钮
  _lay.schBtn = initSchBtn(_lay.layout, schLay.schBtn);

  return _lay;
}

//表格样式
function initLayout(params) {
  if (!params) params = {};
  return {
    report: params.report ? params.report : "", //程序名称
    varMode: params.varMode === "A" ? "A" : "U", //变式模式：U.仅自己可用，A.所有人可用，默认
    hideBtn: _.isBoolean(params.hideBtn) ? params.hideBtn : false, //隐藏按钮
    styleBtn: params.styleBtn, //按钮样式
    span: Number(params.span) > 0 && Number(params.span) <= 24 ? Number(params.span) : 8, //每行个查询条件占用
    more: Number(params.more) > 0 ? Number(params.more) : 0, //更多筛选 默认显示的查询条件，0不控制
    reset: _.isBoolean(params.reset) ? params.reset : true, //重置自动查询
    //内部参数
    $SZDUserId: store.state.loginUser.user.userId,
    $SZDVar: {}
  };
}

//搜索条件目录
function initSchCat(layout, fCat) {
  if (!_.isArray(fCat)) fCat = [];
  let _schCat = [];
  for (let i = 0; i < fCat.length; i++) {
    const item = fCat[i];
    //列字段键值尾款和重复检查
    const _temp = _schCat.find(schItem => schItem.field === item.field);
    if (_temp) {
      console.error("字段代码field不能重复和为空，且名称label不能为空:" + item.field);
      continue;
    }
    _schCat.push({
      field: item.field, //字段
      label: item.label, //列名称
      type: const_type.includes(item.type) ? item.type : "string", //数据类型
      numDot: item.type === "number" ? (_.isBoolean(item.numDot) ? item.numDot : true) : false, //千分位符
      numDec: item.type === "number" && !isNaN(item.numDec) ? item.numDec : undefined, //小数位位数
      help: item.help, //搜索帮助
      noTo: item.noTo, //无范围
      noExt: item.noExt, //无多选
      disabled: item.disabled,
      readonly: item.readonly,
      clearable: item.clearable,
      selectOpt: item.selectOpt,
      prop: item.field,
      labelWidth: item.labelWidth, //form-item-label的宽度
      required: item.required,
      helpTip: item.helpTip,
      span: !isNaN(item.span) && Number(item.span) > 0 ? Number(item.span) : layout.span
    });
  }
  //检查 更多选择
  if (layout.more > 0 && layout.more >= _schCat.length) layout.more = 0;

  return _schCat;
}

//工具栏按钮
function initSchBtn(layout, btns) {
  if (layout.hideBtn) return [];
  if (!_.isArray(btns)) btns = [];
  let _schBtn = [];
  //扩展按钮 //自定义按钮不允许以$开始
  for (let i = 0; i < btns.length; i++) {
    if (btns[i].fCode && !btns[i].fCode.startsWith("$")) {
      initSchBtnAdd(_schBtn, btns[i]);
    }
  }
  //标准按钮
  for (let i = 0; i < const_btns.length; i++) {
    if (!layout.report && const_btns[i].fCode === "$layout") continue;
    if (layout.more === 0 && const_btns[i].fCode === "$more") continue;
    initSchBtnAdd(_schBtn, const_btns[i]);
  }
  return _schBtn;
}

function initSchBtnAdd(_schBtn, item) {
  //隐藏按钮直接返回
  if (item.hide) return;
  //添加按钮
  _schBtn.push({
    type: const_btn_type.includes(item.type) ? item.type : "primary",
    fCode: item.fCode,
    label: item.label,
    tip: item.tip,
    icon: item.icon,
    color: item.color,
    disabled: _.isBoolean(item.disabled) ? item.disabled : false
  });
}
