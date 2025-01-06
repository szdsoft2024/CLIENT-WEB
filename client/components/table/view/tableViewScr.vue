<template>
  <!-- 输出列-字段 -->
  <div class="app-sub-container szd__tb__wrapper app-collapse ova">
    <el-row>
      <template v-for="(fCat, index) in viewCat">
        <!-- 折叠详情页 -->
        <template v-if="fCat.children">
          <el-col :span="24" :style="{ display: 'flex', marginTop: index === 0 ? 0 : '2px', marginBottom: '2px' }">
            <szd-tabs-fold :label="fCat.label">
              <tableViewScr v-model:scope="_scope" :layout="layout" :viewCat="fCat.children" @handleRowEvent="handleRowEventImp" />
            </szd-tabs-fold>
          </el-col>
        </template>

        <!-- 子表 -->
        <template v-else-if="fCat.fieldCat && fCat.fieldCat.length > 0">
          <el-col :span="24" class="flex ovh" :style="handleSubTableStyle(fCat)">
            <szd-table
              ref="refTable1"
              :layout="fCat.layout"
              :toolbar="fCat.toolbar"
              :fieldCat="fCat.fieldCat"
              :sortRule="fCat.sortRule"
              :oper="handleSubTableOper(fCat.field)"
              v-model:data="_scope.row[fCat.field]"
              :row-key="fCat.layout.rowKey"
              border
              stripe
              @handleRowEvent="handleSubRowEventImp($event, fCat.field)"
              @handleEvent="handleSubEventImp($event, fCat.field)" />
          </el-col>
        </template>

        <!-- 详情字段 -->
        <template v-else>
          <el-col :span="12">
            <el-form-item :label="fCat.label" :label-width="fCat.labelWidth" :required="fCat.required">
              <template v-if="fCat.helpTip" #label>
                <div>
                  <span>{{ fCat.label }}</span>
                  <el-icon class="main-help-tip">
                    <QuestionFilled @click.prevent.stop="handleHelpTip(fCat.helpTip)" />
                  </el-icon>
                </div>
              </template>
              <!--  控件类型 input -->
              <template v-if="fCat.ctrlType === 'input'">
                <szd-input-ctrl
                  v-model="_scope.row[fCat.field]"
                  :ctrl="handleCtrlParam(fCat, _scope.row)"
                  :desc="fCat.ctrlParam.descField ? _scope.row[fCat.ctrlParam.descField] : ''"
                  @help="handleRowHelp(fCat, _scope.row, _scope.$index)"
                  @change="handleRowChange(fCat, _scope.row, _scope.$index)"
                  @dblclick="handleRowClick(fCat, _scope.row, _scope.$index)" />
              </template>
              <!--  控件类型 input-number -->
              <template v-else-if="fCat.ctrlType === 'input-number'">
                <szd-input-number-ctrl
                  v-model="_scope.row[fCat.field]"
                  :ctrl="handleCtrlParam(fCat, _scope.row)"
                  @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
              </template>
              <!--  控件类型 date -->
              <template v-else-if="fCat.ctrlType === 'date'">
                <szd-date-ctrl
                  v-model="_scope.row[fCat.field]"
                  :ctrl="handleCtrlParam(fCat, _scope.row)"
                  @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
              </template>
              <!--  控件类型 time -->
              <template v-else-if="fCat.ctrlType === 'time'">
                <szd-time-ctrl
                  v-model="_scope.row[fCat.field]"
                  :ctrl="handleCtrlParam(fCat, _scope.row)"
                  @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
              </template>
              <!--  控件类型 checkbox -->
              <template v-else-if="fCat.ctrlType === 'checkbox'">
                <szd-checkbox-ctrl
                  v-model="_scope.row[fCat.field]"
                  :ctrl="handleCtrlParam(fCat, _scope.row)"
                  @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
              </template>
              <!--  控件类型 radio -->
              <template v-else-if="fCat.ctrlType === 'radio'">
                <szd-radio-ctrl
                  v-model="_scope.row[fCat.field]"
                  :ctrl="handleCtrlParam(fCat, _scope.row)"
                  @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
              </template>
              <!--  控件类型 select -->
              <template v-else-if="fCat.ctrlType === 'select'">
                <szd-select-ctrl
                  v-model="_scope.row[fCat.field]"
                  :ctrl="handleCtrlParam(fCat, _scope.row)"
                  @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
              </template>
              <!--  控件类型 textarea -->
              <template v-else-if="fCat.ctrlType === 'textarea'">
                <szd-textarea-ctrl
                  v-model="_scope.row[fCat.field]"
                  :ctrl="handleCtrlParam(fCat, _scope.row)"
                  @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
              </template>
              <!--  控件类型 svg -->
              <template v-else-if="fCat.ctrlType === 'svg'">
                <szd-svg
                  :name="_scope.row[fCat.ctrlParam.nameField]"
                  :fixed="fCat.ctrlParam.fixed"
                  :color="fCat.ctrlParam.colorField ? _scope.row[fCat.ctrlParam.colorField] : fCat.ctrlParam.color"
                  :fontSize="fCat.ctrlParam.fontSize"
                  :label="fCat.ctrlParam.labelField ? _scope.row[fCat.labelField] : ''"
                  :clicked="fCat.ctrlParam.click"
                  @click="handleRowChange(fCat, _scope.row, _scope.$index)" />
              </template>
              <!--  控件类型 button -->
              <template v-else-if="fCat.ctrlType === 'button'">
                <template v-for="ctrl in fCat.ctrlParam">
                  <szd-button-ctrl
                    :ctrl="handleCtrlParamButton(fCat, ctrl, _scope.row)"
                    @click="handleRowButton(ctrl.fCode, fCat, _scope.row, _scope.$index)" />
                </template>
              </template>
              <!--  控件类型 click 按钮 -->
              <template v-else-if="fCat.click">
                <el-button type="primary" text @click="handleRowClick(fCat, _scope.row, _scope.$index)">
                  <szd-dot v-if="fCat.$SZDDot" v-model="_scope.row[fCat.field]" :numDec="fCat.numDec" :numDot="fCat.numDot" :noZero="fCat.noZero" />
                  <div v-else>{{ _scope.row[fCat.field] }}</div>
                </el-button>
              </template>
              <!-- 千分位符 -->
              <template v-else-if="fCat.$SZDDot">
                <szd-dot v-model="_scope.row[fCat.field]" :numDec="fCat.numDec" :numDot="fCat.numDot" :noZero="fCat.noZero" />
              </template>
              <!-- 文本输出 -->
              <template v-else>
                <div :class="'right' === fCat.align ? 'div-align-right' : ''">{{ _scope.row[fCat.field] }}</div>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </template>
    </el-row>
  </div>
</template>

<script setup>
  import "../css/tableView.scss";
  import { defineProps, defineEmits, computed } from "vue";
  import { setRowHelp } from "../js/tableFunc";
  import szdTool from "../../../common/tools/tool";
  import { getCtrlSubTableOper, getCtrlParam, getCtrlParamButton } from "../js/tableParamCtrl";

  //回调事件
  const emit = defineEmits(["update:scope", "handleRowEvent"]);

  const props = defineProps({
    layout: {
      type: Object
    },
    viewCat: {
      type: Array,
      default: []
    },
    scope: {
      type: Object
    },
    oper: {
      type: Object
    }
  });

  //行数据
  const _scope = computed({
    get: () => props.scope,
    set: val => {
      emit("update:scope", val);
    }
  });

  //设置容器大小
  const handleSubTableStyle = fCat => {
    let style = { padding: "3px" };
    if (fCat.containerStyle) {
      if (fCat.containerStyle.height > 0) style["height"] = fCat.containerStyle.height + "px";
      if (fCat.containerStyle.minHeight > 0) style["minHeight"] = fCat.containerStyle.minHeight + "px";
    }
    return style;
  };

  //设置单元格是否可编辑
  const handleCtrlParam = (fCat, row) => {
    return getCtrlParam(props.layout, fCat, row);
  };

  //设置按钮操作状态
  const handleCtrlParamButton = (fCat, ctrlParam, row) => {
    return getCtrlParamButton(props.layout, fCat, ctrlParam, row);
  };

  //获取子表oper权限
  const handleSubTableOper = field => {
    return getCtrlSubTableOper(props.oper, field);
  };

  //搜索帮助
  const handleRowHelp = (fCat, row, rowIndex) => {
    if (fCat.ctrlParam.showHelp) {
      if (fCat.ctrlParam.baseField) {
        setRowHelp(props.layout, fCat, row).then(res => {
          if (res) {
            callEmitRowEvent("$change", fCat.field, row, rowIndex);
          }
        });
      } else {
        callEmitRowEvent("$help", fCat.field, row, rowIndex); //搜索帮助回调
      }
    }
  };
  //行事件-按钮
  const handleRowButton = (fCode, fCat, row, rowIndex) => {
    callEmitRowEvent(fCode, fCat.field, row, rowIndex);
  };
  //行事件-数据更改 $change
  const handleRowChange = (fCat, row, rowIndex) => {
    callEmitRowEvent("$change", fCat.field, row, rowIndex);
  };
  //行事件-数据单击 $click
  const handleRowClick = (fCat, row, rowIndex) => {
    callEmitRowEvent("$click", fCat.field, row, rowIndex);
  };

  //显示文字帮助事件
  const handleHelpTip = helpTip => {
    szdTool.helpDoc(helpTip);
  };

  //调用父级功能-行处理事件
  const callEmitRowEvent = (fCode, field, row, index) => {
    emit("handleRowEvent", { fCode: fCode, field: field, row: row, index: index });
  };

  //行回调事件
  const handleRowEventImp = obj => {
    emit("handleRowEvent", obj);
  };

  //行事件-数据更改
  const handleSubRowEventImp = (obj, field) => {
    emit("handleRowEvent", {
      fCode: "$sub-table",
      field: field,
      row: _scope.value.row,
      index: _scope.value.$index,
      handle: { event: "handleRowEvent", obj: obj }
    });
  };

  //按钮事件
  const handleSubEventImp = (obj, field) => {
    emit("handleRowEvent", {
      fCode: "$sub-table",
      field: field,
      row: _scope.value.row,
      index: _scope.value.$index,
      handle: { event: "handleEvent", obj: obj }
    });
  };
</script>
