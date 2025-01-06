//区域
import area from "./area/area.vue";
//描述
import desc from "./desc/desc.vue";
//小数位和千分位符
import dot from "./dot/dot.vue";
//底部状态
import footStatus from "./footStatus/footStatus.vue";
//高亮代码
import hlt from "./hlt/hlt.vue";
import hltDiv from "./hlt/hltDiv.vue";
//帮助提示
import helpTip from "./helpTip/helpTip.vue";
//分页组件
import pagination from "./pagination/pagination.vue";
//input输入框
import input from "./input/input.vue";
import inputCtrl from "./input/inputCtrl.vue";
import inputDesc from "./input/inputDesc.vue";
import inputFormItem from "./input/inputFormItem.vue";
import inputFormItemCol from "./input/inputFormItemCol.vue";
//inputNumber输入框
import inputNumber from "./inputNumber/inputNumber.vue";
import inputNumberCtrl from "./inputNumber/inputNumberCtrl.vue";
import inputNumberFormItem from "./inputNumber/inputNumberFormItem.vue";
import inputNumberFormItemCol from "./inputNumber/inputNumberFormItemCol.vue";
//date输入框
import date from "./date/date.vue";
import dateCtrl from "./date/dateCtrl.vue";
import dateFormItem from "./date/dateFormItem.vue";
import dateFormItemCol from "./date/dateFormItemCol.vue";
//time输入框
import time from "./time/time.vue";
import timeCtrl from "./time/timeCtrl.vue";
import timeFormItem from "./time/timeFormItem.vue";
import timeFormItemCol from "./time/timeFormItemCol.vue";
//textArea多行文本
import textarea from "./textarea/textarea.vue";
import textareaCtrl from "./textarea/textareaCtrl.vue";
import textareaFormItem from "./textarea/textareaFormItem.vue";
import textareaFormItemCol from "./textarea/textareaFormItemCol.vue";
//password输入框
import password from "./password/password.vue";
import passwordCtrl from "./password/passwordCtrl.vue";
import passwordFormItem from "./password/passwordFormItem.vue";
import passwordFormItemCol from "./password/passwordFormItemCol.vue";
//下拉框
import select from "./select/select.vue";
import selectCtrl from "./select/selectCtrl.vue";
import selectFormItem from "./select/selectFormItem.vue";
import selectFormItemCol from "./select/selectFormItemCol.vue";
//单选
import radio from "./radio/radio.vue";
import radioCtrl from "./radio/radioCtrl.vue";
import radioFormItem from "./radio/radioFormItem.vue";
import radioFormItemCol from "./radio/radioFormItemCol.vue";
//复选框
import checkbox from "./checkbox/checkbox.vue";
import checkboxCtrl from "./checkbox/checkboxCtrl.vue";
import checkboxFormItem from "./checkbox/checkboxFormItem.vue";
import checkboxFormItemCol from "./checkbox/checkboxFormItemCol.vue";
//按钮
import button from "./button/button.vue";
import buttonCtrl from "./button/buttonCtrl.vue";
//Tabs多标签组
import tabsWrap from "./tabsWrap/tabsWrap.vue";
import tabsFold from "./tabsWrap/tabsFold.vue";
//高级搜索帮助
import seniorSch from "./seniorSearch/seniorSearch.vue";
import seniorSchFormItem from "./seniorSearch/seniorSearchFormItem.vue";
import seniorSchFormItemCol from "./seniorSearch/seniorSearchFormItemCol.vue";
import seniorSchArea from "./seniorSearch/seniorSearchArea.vue";
//svg图标
import svgIcon from "./svgIcon/svgIcon.vue";
//table组件
import table from "./table/table.vue";
//列表头替换
import tableColHeader from "./tableColHeader/tableColHeader.vue";
//iframe或组件渲染
import ifr from "./ifr/ifr.vue";
//富文本编辑
import szdEditor from "./editor/editor.vue";
//文件预览
import fileView from "./fileView/fileView.vue";

const installComponent = app => {
  app.component("szd-area", area);
  app.component("szd-desc", desc);
  app.component("szd-dot", dot);
  app.component("szd-hlt", hlt);
  app.component("szd-hlt-div", hltDiv);
  app.component("szd-help-tip", helpTip);
  app.component("szd-foot-status", footStatus);
  app.component("szd-pagination", pagination);
  app.component("szd-input", input);
  app.component("szd-input-ctrl", inputCtrl);
  app.component("szd-input-desc", inputDesc);
  app.component("szd-input-form-item", inputFormItem);
  app.component("szd-input-form-item-col", inputFormItemCol);
  app.component("szd-input-number", inputNumber);
  app.component("szd-input-number-ctrl", inputNumberCtrl);
  app.component("szd-input-number-form-item", inputNumberFormItem);
  app.component("szd-input-number-form-item-col", inputNumberFormItemCol);
  app.component("szd-date", date);
  app.component("szd-date-ctrl", dateCtrl);
  app.component("szd-date-form-item", dateFormItem);
  app.component("szd-date-form-item-col", dateFormItemCol);
  app.component("szd-time", time);
  app.component("szd-time-ctrl", timeCtrl);
  app.component("szd-time-form-item", timeFormItem);
  app.component("szd-time-form-item-col", timeFormItemCol);
  app.component("szd-textarea", textarea);
  app.component("szd-textarea-ctrl", textareaCtrl);
  app.component("szd-textarea-form-item", textareaFormItem);
  app.component("szd-textarea-form-item-col", textareaFormItemCol);
  app.component("szd-password", password);
  app.component("szd-password-ctrl", passwordCtrl);
  app.component("szd-password-form-item", passwordFormItem);
  app.component("szd-password-form-item-col", passwordFormItemCol);
  app.component("szd-select", select);
  app.component("szd-select-ctrl", selectCtrl);
  app.component("szd-select-form-item", selectFormItem);
  app.component("szd-select-form-item-col", selectFormItemCol);
  app.component("szd-radio", radio);
  app.component("szd-radio-ctrl", radioCtrl);
  app.component("szd-radio-form-item", radioFormItem);
  app.component("szd-radio-form-item-col", radioFormItemCol);
  app.component("szd-checkbox", checkbox);
  app.component("szd-checkbox-ctrl", checkboxCtrl);
  app.component("szd-checkbox-form-item", checkboxFormItem);
  app.component("szd-checkbox-form-item-col", checkboxFormItemCol);
  app.component("szd-button", button);
  app.component("szd-button-ctrl", buttonCtrl);
  app.component("szd-tabs-wrap", tabsWrap);
  app.component("szd-tabs-fold", tabsFold);
  app.component("szd-sch", seniorSch);
  app.component("szd-sch-form-item", seniorSchFormItem);
  app.component("szd-sch-form-item-col", seniorSchFormItemCol);
  app.component("szd-sch-area", seniorSchArea);
  app.component("szd-svg", svgIcon);
  app.component("szd-table", table);
  app.component("szd-table-col-header", tableColHeader);
  app.component("szd-ifr", ifr);
  app.component("szd-editor", szdEditor);
  app.component("szd-file-view", fileView);
};
export default installComponent;
