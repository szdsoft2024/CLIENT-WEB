import _ from "lodash";

//初始化Layout数据
export function initDataLayout(lay, colCat, sortObj, filterObj) {
  //初始化目录数据-数组
  initColCat(lay, colCat);
  //初始化排序数据
  initSortObj(lay, sortObj);
  //初始化过滤数据
  initFilterObj(lay, filterObj);
}

//初始化目录数据
function initColCat(lay, colCat) {
  colCat.value = [];
  colCat.value = initColCatImp(lay.value.fCatCol);
  //设置位置
  setColCatPos(colCat);
}

function initColCatImp(fCatCol) {
  let _colCat = [];
  for (let i = 0; i < fCatCol.length; i++) {
    const fCat = fCatCol[i];
    if (fCat.children && _.isArray(fCat.children)) {
      let colCatChild = initColCatImp(fCat.children);
      if (colCatChild.length > 0) {
        _colCat.push({
          field: fCat.field,
          label: fCat.label,
          type: "", //数据类型
          hide: fCat.hide, //隐藏
          doSum: "", //统计规则
          fixed: "", //固定列
          align: "", //对齐方式
          children: colCatChild,
          //内部参数
          $SZDId: fCat.field,
          $SZDPos: 0, //输出位置
          $SZDCol: fCat.$SZDCol, //内部传输-true 数据列 false 多表头表头
          $SZDParent: fCat.$SZDParent //存在多表头赋值，否则为false
        });
      }
    } else {
      _colCat.push({
        field: fCat.field,
        label: fCat.label,
        type: fCat.type, //数据类型
        hide: fCat.hide, //隐藏
        doSum: fCat.doSum, //统计规则
        fixed: fCat.fixed ? fCat.fixed : "", //固定列
        align: fCat.align, //对齐方式
        //内部参数
        $SZDId: fCat.field,
        $SZDPos: 0, //输出位置
        $SZDCol: fCat.$SZDCol, //内部传输-true 数据列 false 多表头表头
        $SZDParent: fCat.$SZDParent //存在多表头赋值，否则为false
      });
    }
  }
  return _colCat;
}

//设置位置
export function setColCatPos(colCat) {
  let pos = { $SZDPos: 0 };
  setColCatPosImp(colCat.value, pos);
}

function setColCatPosImp(pColCat, pos) {
  for (let i = 0; i < pColCat.length; i++) {
    pos.$SZDPos = pos.$SZDPos + 1;
    pColCat[i].$SZDPos = pos.$SZDPos;
    if (pColCat[i].children && _.isArray(pColCat[i].children)) {
      setColCatPosImp(pColCat[i].children, pos);
    }
  }
  //设置排序
  pColCat.sort((a, b) => {
    if (a.$SZDPos > b.$SZDPos) {
      return 1;
    } else if (a.$SZDPos < b.$SZDPos) {
      return -1;
    } else {
      return 0;
    }
  });
}

//初始化排序数据
function initSortObj(lay, sortObj) {
  sortObj.value.cats = []; //排序字段
  sortObj.value.rule = []; //排序规则
  //所有可排序的字段
  initSortObjImp(sortObj, lay.value.fCatCol);
  //已设置的排序字段
  for (let i = 0; i < lay.value.sortRule.length; i++) {
    const ruleItem = lay.value.sortRule[i];
    let catsItem = sortObj.value.cats.find(item => item.field === ruleItem.field);
    if (catsItem) {
      catsItem.show = false;
      //添加排序数据
      sortObj.value.rule.push({
        field: catsItem.field,
        labelAndParent: catsItem.labelAndParent,
        order: ruleItem.order,
        $SZDPos: 0
      });
    }
  }
  //设置位置
  sortObj.value.rule.forEach((item, index) => {
    item.$SZDPos = index + 1;
  });
}

function initSortObjImp(sortObj, fCatCol) {
  for (let i = 0; i < fCatCol.length; i++) {
    const item = fCatCol[i];
    if (item.children && _.isArray(item.children)) {
      if (item.children.length > 0) {
        initSortObjImp(sortObj, item.children);
      }
    } else if (item.sort) {
      sortObj.value.cats.push({
        field: item.field,
        label: item.label,
        labelAndParent: item.labelAndParent,
        show: true
      });
    }
  }
}

//初始化过滤参数
function initFilterObj(lay, filterObj) {
  filterObj.value.catsAll = []; //全部字段
  filterObj.value.catsSel = []; //已选字段
  filterObj.value.fRanges = {}; //过滤的数据
  //全部可过滤的字段
  initFilterObjImp(filterObj, lay.value.fCatCol);
  //已选字段和过滤数据
  const rKeys = Object.keys(lay.value.fRanges);
  for (let i = 0; i < rKeys.length; i++) {
    let catsItem = filterObj.value.catsAll.find(item => item.field === rKeys[i]);
    if (catsItem) {
      catsItem.show = false;
      filterObj.value.catsSel.push(catsItem);
      filterObj.value.fRanges[rKeys[i]] = lay.value.fRanges[rKeys[i]];
    }
  }
}

function initFilterObjImp(filterObj, fCatCol) {
  for (let i = 0; i < fCatCol.length; i++) {
    const item = fCatCol[i];
    if (item.children && _.isArray(item.children)) {
      if (item.children.length > 0) {
        initFilterObjImp(filterObj, item.children);
      }
    } else if (item.filter) {
      filterObj.value.catsAll.push({
        field: item.field,
        labelAndParent: item.labelAndParent,
        type: item.type,
        numDot: item.numDot,
        numDec: item.numDec,
        //[基础字段-单值,要回填的字段-单值,查询条件(数组)]
        help: item.ctrlParam && item.ctrlParam.baseField ? [item.ctrlParam.baseField, item.ctrlParam.baseMapping, ""] : [],
        show: true //显示未选中的字段
      });
    }
  }
}

//设置选择的数据
export function setSelData(lay, colCat, sortRule, fRanges) {
  //目录列表赋值
  setSelDataColCat(lay.value.fCatCol, colCat);
  //排序规则赋值
  setSelDataSortRule(lay.value, sortRule);
  //过滤条件赋值
  setSelDataFilterRanges(lay, fRanges);
}

//目录赋值，未存在的放置到最后
function setSelDataColCat(fCatCol, colCat) {
  for (let i = 0; i < fCatCol.length; i++) {
    const fCat = fCatCol[i];
    //查找变化的字段
    const colCatItem = colCat.find(itemCol => itemCol.field === fCat.field);
    if (colCatItem) {
      if (fCat.children && _.isArray(fCat.children)) {
        fCat.hide = colCatItem.hide;
        fCat.$SZDPos = colCatItem.$SZDPos;
        if (fCat.children.length > 0 && colCatItem.children && colCatItem.children.length > 0) {
          setSelDataColCat(fCat.children, colCatItem.children);
        }
        if (!fCat.hide) {
          const _temp = fCat.children.find(itemChild => itemChild.hide === false);
          if (!_temp) fCat.hide = true;
        }
      } else {
        fCat.hide = colCatItem.hide;
        fCat.doSum = colCatItem.doSum;
        fCat.fixed = colCatItem.fixed === "left" || colCatItem.fixed === "right" ? colCatItem.fixed : false;
        fCat.align = colCatItem.align;
        fCat.$SZDPos = colCatItem.$SZDPos;
      }
    } else {
      //未找到排序到最后
      fCat.$SZDPos = 9999;
    }
  }
  //设置排序
  fCatCol.sort((a, b) => {
    if (a.$SZDPos > b.$SZDPos) {
      return 1;
    } else if (a.$SZDPos < b.$SZDPos) {
      return -1;
    } else {
      return 0;
    }
  });
}

//排序规则赋值
export function setSelDataSortRule(lay, sortRule) {
  lay.sortRule = [];
  if (Array.isArray(sortRule)) {
    sortRule.forEach(item => {
      if (lay.fCatUse[item.field] && lay.fCatUse[item.field].sort) {
        lay.sortRule.push({
          field: item.field,
          order: ["descending", "desc"].includes(item.order) ? "descending" : "ascending"
        });
      }
    });
  }
}

//设置返回的过滤数据
function setSelDataFilterRanges(lay, fRanges) {
  lay.value.fRanges = {};
  const rKeys = Object.keys(fRanges);
  for (let i = 0; i < rKeys.length; i++) {
    if (fRanges[rKeys[i]].length > 0 && lay.value.fCatUse[rKeys[i]] && lay.value.fCatUse[rKeys[i]].filter) {
      lay.value.fRanges[rKeys[i]] = _.cloneDeep(fRanges[rKeys[i]]);
    }
  }
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
  setSelData(lay, varLay.fCatCol, varLay.sortRule, varLay.fRanges);
}
