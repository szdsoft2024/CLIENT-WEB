import _ from "lodash";
import { $m, $t } from "../../../common/utils/globalConfig";

export function initDataLayout(lay, laySta) {
  laySta.value.catsAll = []; //全部字段
  laySta.value.catsDim = []; //维度字段
  laySta.value.catsTar = []; //指标字段
  //全部字段
  initStaCat(laySta, lay.value.fCatCol);
  //维度字段
  if (lay.value.fCatDim.length > 0) {
    laySta.value.catsDim = _.cloneDeep(lay.value.fCatDim);
  }
  //指标字段
  if (lay.value.fCatTar.length > 0) {
    laySta.value.catsTar = _.cloneDeep(lay.value.fCatTar);
    laySta.value.catsTar.forEach((item, index) => {
      item.$SZDId = index + 1;
    });
  }
  setPos(laySta); //设置位置
}

function initStaCat(laySta, fCatCol) {
  for (let i = 0; i < fCatCol.length; i++) {
    const item = fCatCol[i];
    if (item.children && _.isArray(item.children)) {
      if (item.children.length > 0) {
        initStaCat(laySta, item.children);
      }
    } else {
      laySta.value.catsAll.push({
        field: item.field,
        label: item.label,
        labelAndParent: item.labelAndParent,
        align: item.align,
        type: item.type,
        //内部参数
        $SZDPos: 0, //内部参数-输出位置
        $SZDCol: true, //内部传输-true 数据列 false 多表头表头
        $SZDParent: item.$SZDParent, //存在多表头赋值，否则为false
        $SZDDot: item.$SZDDot //内部参数-是否设置小数位和千分位
      });
    }
  }
}

//字段拖拽设置
export function handleOnEndAreaALL(evt, laySta) {
  //检查目标区域是否正确
  let domElement = evt.to;
  let areaTable = 0;
  let i = 0;
  while (i < 15) {
    if (domElement.getElementsByClassName("m-drag").length > 0) {
      break;
    }
    if (domElement.getElementsByClassName("drag-area-dim").length > 0) {
      areaTable = 1;
      break;
    }
    if (domElement.getElementsByClassName("drag-area-tar").length > 0) {
      areaTable = 2;
      break;
    }
    domElement = domElement.parentNode;
    i++;
  }
  if (areaTable === 0) return;
  const itemAll = laySta.value.catsAll[evt.oldIndex];
  //按区域添加内容
  if (areaTable === 1) {
    const itemDim = laySta.value.catsDim.find(item => item.field === itemAll.field);
    if (itemDim) {
      $m("CORE_CLIENT.W040"); //字段已存在不允许重复
    } else {
      const _dim = {
        field: itemAll.field,
        label: "",
        labelAndParent: itemAll.labelAndParent,
        align: itemAll.align,
        type: itemAll.type,
        order: "",
        //内部参数
        $SZDPos: 0 //内部参数-输出位置
      };
      if (evt.newIndex >= laySta.value.catsDim.length || evt.to.tagName !== "TBODY") {
        laySta.value.catsDim.push(_dim);
      } else {
        laySta.value.catsDim.splice(evt.newIndex, 0, _dim);
      }
    }
  } else if (areaTable === 2) {
    let maxTar = 0;
    for (let i = 0; i < laySta.value.catsTar.length; i++) {
      if (laySta.value.catsTar[i].field === itemAll.field) {
        maxTar = maxTar + 1;
      }
    }
    if ((itemAll.type === "number" && maxTar >= 5) || (itemAll.type !== "number" && maxTar >= 3)) {
      $m("CORE_CLIENT.W041"); //字段已超过允许的指标数，不允许再添加
    } else {
      let _id = 0;
      laySta.value.catsTar.forEach(itemTar => {
        if (itemTar.$SZDId > _id) _id = itemTar.$SZDId;
      });
      const _tar = {
        field: itemAll.field,
        label: "",
        labelAndParent: itemAll.labelAndParent,
        align: itemAll.align,
        type: itemAll.type,
        order: "",
        doSum: "",
        //内部参数
        $SZDId: _id + 1, //内部参数-唯一值
        $SZDPos: 0 //内部参数-输出位置
      };
      if (evt.newIndex >= laySta.value.catsTar.length || evt.to.tagName !== "TBODY") {
        laySta.value.catsTar.push(_tar);
      } else {
        laySta.value.catsTar.splice(evt.newIndex, 0, _tar);
      }
    }
  }
  //删除移动过来的DOM
  evt.to.removeChild(evt.item);
  //设置位置
  setPos(laySta);
}

//设置拖拽顺序
export function handleOnEndAreaDim(evt, laySta) {
  if (evt.newIndex !== evt.oldIndex) {
    const movedItem = laySta.value.catsDim.splice(evt.oldIndex, 1)[0];
    laySta.value.catsDim.splice(evt.newIndex, 0, movedItem);
    setPos(laySta); //设置位置
  }
}

//设置拖拽顺序
export function handleOnEndAreaTar(evt, laySta) {
  if (evt.newIndex !== evt.oldIndex) {
    const movedItem = laySta.value.catsTar.splice(evt.oldIndex, 1)[0];
    laySta.value.catsTar.splice(evt.newIndex, 0, movedItem);
    setPos(laySta); //设置位置
  }
}

//设置位置
export function setPos(laySta) {
  let pos = 0;
  laySta.value.catsDim.forEach((item, index) => {
    pos = pos + 1;
    item.$SZDPos = pos;
  });
  laySta.value.catsTar.forEach((item, index) => {
    pos = pos + 1;
    item.$SZDPos = pos;
  });
}

//检查数据
export function checkLayData(laySta) {
  if (laySta.value.catsDim.length === 0 && laySta.value.catsTar.length === 0) {
    $m("CORE_CLIENT.E042"); //维度和指标不能同时为空
    return false;
  }
  //维度检查
  let orderNoAct = false;
  for (let i = 0; i < laySta.value.catsDim.length; i++) {
    let item = laySta.value.catsDim[i];
    if (!["1", "2", "3", "4"].includes(item.order)) {
      orderNoAct = true;
    }
    if (item.order === "2" || item.order === "4") {
      if (orderNoAct) {
        $m("CORE_CLIENT.E043", item.labelAndParent); //维度中[排序/小计]行 & 选择小计,之前行必须选择排序，否则小计行输出位置错误
        return false;
      }
    }
  }
  //指标检查
  let _tarCk = [];
  for (let i = 0; i < laySta.value.catsTar.length; i++) {
    const _colField = laySta.value.catsTar[i].field + "_" + laySta.value.catsTar[i].doSum;
    if (_tarCk.includes(_colField)) {
      $m("CORE_CLIENT.E044", laySta.value.catsTar[i].labelAndParent); //指标中的指标规则不能重复 &
      return false;
    } else {
      _tarCk.push(_colField);
    }
  }
  return true;
}

//设置选择的数据
export function setSelData(lay, laySta) {
  //维度字段
  lay.value.fCatDim = [];
  if (laySta.catsDim) {
    laySta.catsDim.forEach(item => {
      if (lay.value.fCatUse[item.field] && lay.value.fCatUse[item.field].$SZDCol) {
        lay.value.fCatDim.push(_.cloneDeep(item));
      }
    });
  }
  //指标字段
  lay.value.fCatTar = [];
  if (laySta.catsTar) {
    laySta.catsTar.forEach(item => {
      if (lay.value.fCatUse[item.field] && lay.value.fCatUse[item.field].$SZDCol) {
        const _tarCk = lay.value.fCatTar.find(itemTar => itemTar.field === item.field && itemTar.doSum === item.doSum);
        if (!_tarCk) {
          lay.value.fCatTar.push(_.cloneDeep(item));
        }
      }
    });
  }
  //统计分析列字段
  lay.value.fCatSta = []; //分析字段
  //统计分析列字段-维度字段
  for (let i = 0; i < lay.value.fCatDim.length; i++) {
    const item = lay.value.fCatDim[i];
    const fCat = lay.value.fCatUse[item.field];
    //添加到根节点还是子节点
    let _fCatStaParent = setSelDataParent(lay.value.fCatSta, fCat, 0);
    //添加元素
    _fCatStaParent.push(setSelDataAddFCat(item, fCat));
  }
  //统计分析列字段-指标字段
  for (let i = 0; i < lay.value.fCatTar.length; i++) {
    const item = lay.value.fCatTar[i];
    const fCat = lay.value.fCatUse[item.field];
    //添加到根节点还是子节点
    let _fCatStaParent = setSelDataParent(lay.value.fCatSta, fCat, 0);
    //添加元素
    let _fCatCol = setSelDataAddFCat(item, fCat);
    _fCatCol.field = _fCatCol.field + "_" + item.doSum;
    _fCatStaParent.push(_fCatCol);
  }
}

//获取节点数据-父级到子集递归
function setSelDataParent(parent, fCat, level) {
  if (fCat.$SZDParent && fCat.$SZDParent.length > level) {
    let parentNode = parent.find(item => item.field === fCat.$SZDParent[level].field);
    if (parentNode) {
      return setSelDataParent(parentNode.children, fCat, level + 1);
    } else {
      let _child = {
        field: fCat.$SZDParent[level].field, //字段
        label: fCat.$SZDParent[level].label, //列名称
        children: []
      };
      parent.push(_child);
      return setSelDataParent(_child.children, fCat, level + 1);
    }
  } else {
    return parent;
  }
}

//添加列目录
function setSelDataAddFCat(item, fCat) {
  let _fCat = {
    field: item.field, //字段
    label: "", //列名称
    width: fCat.width, //宽度
    minWidth: fCat.minWidth, //最小宽度
    align: item.align, //对齐方式:left center right
    fixed: item.fixed, //固定列
    //数据维护
    edit: false, //编辑
    type: fCat.type, //数据类型
    numDot: fCat.numDot, //千分位符
    numDec: fCat.numDec, //小数位位数
    //列汇总 0.不汇总 1.合计 2.平均值 3.最小值 4.最大值 5.统计行数
    doSum: "0",
    //控件类型
    ctrlType: undefined, //控件类型
    ctrlParam: undefined, //控件参数
    //点击事件
    click: false,
    //表头设置
    required: false, //必输
    helpTip: "", //表头提示
    sort: true, //排序
    merge: fCat.merge, //合并单元格
    filter: true //过滤
  };

  if (item.label) {
    _fCat.label = item.label;
  } else {
    switch (item.doSum) {
      case "1":
        _fCat.label = fCat.label + $t("(合计)");
        break;
      case "2":
        _fCat.label = fCat.label + $t("(平均值)");
        break;
      case "3":
        _fCat.label = fCat.label + $t("(最小值)");
        break;
      case "4":
        _fCat.label = fCat.label + $t("(最大值)");
        break;
      case "5":
        _fCat.label = fCat.label + $t("(行数)");
        break;
      default:
        _fCat.label = fCat.label;
        break;
    }
  }
  return _fCat;
}

//设置样式
export function setLayVar(lay, varObj) {
  if (!varObj.varJson) return;
  //设置变式代码和名称
  lay.value.layout.$SZDVar = {
    variant: varObj.variant ? varObj.variant : "",
    varName: varObj.varName ? varObj.varName : "",
    varMode: varObj.varMode ? varObj.varMode : "",
    varDefault: varObj.varDefault,
    userId: varObj.userId ? varObj.userId : ""
  };
  //获取配置信息{fCatCol表格列目录 sortRule排序规则 fRanges过滤数据}
  const varLay = JSON.parse(varObj.varJson);
  //设置选择的数据
  setSelData(lay, varLay);
}
