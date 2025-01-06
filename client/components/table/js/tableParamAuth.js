import _ from "lodash";

//初始化权限对象
export function initOper(oper, _lay) {
  let _oper = {
    szdopt: "U",
    szdkey: "",
    szdfst: {},
    szdfstF: false,
    szdbtn: {},
    szdbtnF: false
  };
  if (!oper) return _oper;

  if (_.isObject(oper)) {
    if (["V", "U", "C"].includes(oper.szdopt)) _oper.szdopt = oper.szdopt;
    //主表key
    if (oper.szdkey) _oper.szdkey = oper.szdkey;
    //字段状态
    if (oper.szdfst && _.isObject(oper.szdfst)) {
      _oper.szdfst = oper.szdfst;
      _oper.szdfstF = Object.keys(_oper.szdfst).length > 0;
    }
    //按钮
    if (oper.szdbtn && _.isObject(oper.szdbtn)) {
      _oper.szdbtn = oper.szdbtn;
      _oper.szdbtnF = Object.keys(_oper.szdbtn).length > 0;
    }
  } else {
    if (["V", "U", "C"].includes(oper)) _oper.szdopt = oper;
  }
  return _oper;
}

//布局设置权限对象
export function initLayAuth(lay, oper) {
  //工具栏按钮
  if (!lay.value.tBar.hide && lay.value.tBar.btns.length > 0) {
    initLayAuthBtn(lay.value.tBar, oper.value);
  }
  //列字段
  initLayAuthFCat(lay.value.fCatCol, lay.value.fCatUse, oper.value);
}

//工具栏按钮
function initLayAuthBtn(bar, oper) {
  //检查按钮状态： 1.正常  3.禁用、4.隐藏
  for (let i = 0; i < bar.btns.length; i++) {
    let item = bar.btns[i];
    item.fstHide = false;
    //父级按钮
    if (oper.szdbtnF) {
      if (oper.szdbtn[item.fCode] === "1") {
        item.disabled = false;
      } else if (["3", "4"].includes(oper.szdbtn[item.fCode])) {
        item.disabled = true;
        item.fstHide = true;
        continue;
      }
    }
    //szdopt权限检查
    if (oper.szdopt === "V" && item.noAuth !== true) {
      item.fstHide = true;
      continue;
    }
    //检查子按钮
    if (item.children && _.isArray(item.children)) {
      for (let j = 0; j < item.children.length; j++) {
        let child = item.children[j];
        child.fstHide = false;
        if (oper.szdbtnF) {
          if (oper.szdbtn[child.fCode] === "1") {
            child.disabled = false;
          } else if (["3", "4"].includes(oper.szdbtn[child.fCode])) {
            child.disabled = true;
            child.fstHide = true;
            continue;
          }
        }
        //szdopt权限检查
        if (oper.szdopt === "V" && child.noAuth !== true) {
          child.fstHide = true;
        }
      }
    }
  }
}

//列字段权限
function initLayAuthFCat(fCats, fCatUse, oper) {
  const szdfst = oper.szdkey ? oper.szdfst[oper.szdkey] : undefined;
  for (let i = 0; i < fCats.length; i++) {
    let fCat = fCats[i];
    //字段状态： 1.可选  2.必输  3.仅显示、4.隐藏、5.隐藏-清空
    let fstVal = szdfst && szdfst[fCat.field] ? szdfst[fCat.field] : "";
    //设置字段状态-列状态 4.隐藏、5.隐藏-清空
    if (fstVal === "4" || fstVal === "5") {
      fCats.splice(i, 1);
      i--;
      continue;
    }
    //设置字段状态-列状态 1.可选  2.必输  3.仅显示
    if (_.isArray(fCat.children) && fCat.children.length > 0) {
      initLayAuthFCat(fCat.children, fCatUse, oper);
      if (fCat.children.length === 0) {
        fCats.splice(i, 1);
        i--;
      }
    } else {
      //设置字段状态-列状态 字段状态： 1.可选  2.必输  3.仅显示
      if (fstVal === "1") {
        fCat.edit = true;
        fCat.hide = false;
        fCat.required = false;
      } else if (fstVal === "2") {
        fCat.edit = true;
        fCat.hide = false;
        fCat.required = true;
      } else if (fstVal === "3") {
        fCat.edit = false;
        fCat.hide = false;
        fCat.required = false;
      }
      //设置字段状态-控制参数
      if (fCat.type !== "button") {
        if (!fCat.ctrlParam) fCat.ctrlParam = {};
        fCat.ctrlParam["szdfst"] = fstVal;
        fCat.ctrlParam["szdopt"] = oper.szdopt;
      } else {
        for (let i = 0; i < fCat.ctrlParam.length; i++) {
          let item = fCat.ctrlParam[i];
          item["szdfst"] = oper.szdbtn && oper.szdbtn[item.fCode] ? oper.szdbtn[item.fCode] : "";
          item["szdopt"] = oper.szdopt;
        }
      }
    }
  }
}
