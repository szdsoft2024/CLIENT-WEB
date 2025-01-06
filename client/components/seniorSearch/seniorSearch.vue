<template>
  <!--限制为input-->
  <div class="g-seniorWrap">
    <template v-if="_selectOpt">
      <szd-select v-model="_selectVal" :baseField="props.help.a" :disabled="readonly || disabled" @change="changeSelect" :clearable="clearable" />
    </template>
    <template v-else-if="type === 'string' || type === 'number'">
      <szd-input
        v-model="ranges[0].low"
        :type="type"
        :num-dot="numDot"
        :num-dec="numDec"
        :show-help="_showHelp"
        @help="dealSingleHelp('low')"
        :readonly="readonly"
        :disabled="onlyNull.includes(ranges[0].option) || disabled"
        :clearable="!_showHelp && clearable"
        :enter="enter"
        @keydownEnter="enter ? emit('keydownEnter') : ''"
        @change="changeSingle" />
      <span v-if="!noTo" class="u-sp"> - </span>
      <szd-input
        v-if="!noTo"
        v-model="ranges[0].high"
        :type="type"
        :num-dot="numDot"
        :num-dec="numDec"
        :show-help="_showHelp"
        @help="dealSingleHelp('high')"
        :readonly="readonly"
        :disabled="onlyNull.includes(ranges[0].option) || disabled"
        :clearable="!_showHelp && clearable"
        :enter="enter"
        @keydownEnter="enter ? emit('keydownEnter') : ''"
        @change="changeSingle" />
    </template>
    <!-- 限制为boolean类型   -->
    <template v-else-if="type === 'boolean'">
      <szd-radio
        v-model="_boolean"
        :baseArr="[
          { svalue: 'A', sname: $t('全选') },
          { svalue: '1', sname: $t('是') },
          { svalue: '0', sname: $t('否') }
        ]"
        :disabled="readonly || disabled"
        @change="changeBoolean" />
    </template>
    <!-- 限制为时间 -->
    <template v-else-if="type === 'time'">
      <szd-time
        v-model="ranges[0].low"
        :readonly="readonly"
        :disabled="onlyNull.includes(ranges[0].option) || disabled"
        @change="changeSingle"
        :clearable="clearable" />
      <span v-if="!noTo" class="u-sp"> - </span>
      <szd-time
        v-if="!noTo"
        v-model="ranges[0].high"
        :readonly="readonly"
        :disabled="onlyNull.includes(ranges[0].option) || disabled"
        @change="changeSingle"
        :clearable="clearable" />
    </template>
    <!--限制为日期或日期时间-->
    <template v-else>
      <szd-date
        v-model="ranges[0].low"
        :type="type"
        :readonly="readonly"
        :disabled="onlyNull.includes(ranges[0].option) || disabled"
        @change="changeSingle"
        :clearable="clearable" />
      <span v-if="!noTo" class="u-sp"> - </span>
      <szd-date
        v-model="ranges[0].high"
        :type="type"
        :readonly="readonly"
        :disabled="onlyNull.includes(ranges[0].option) || disabled"
        @change="changeSingle"
        :clearable="clearable" />
    </template>
    <!--高级搜索按钮 固定占位 -->
    <div v-if="type !== 'boolean' && !_selectOpt" class="u-btnWrap">
      <el-button v-if="!noExt" class="u-open" :class="['u-ruleBtn', modelValue.length > 0 ? 'active' : '']" @click="showDialog" icon="Switch" />
    </div>
  </div>
  <!--高级查询条件弹框-->
  <el-dialog
    draggable
    align-center
    v-model="visible"
    append-to-body
    :title="$t('高级查询')"
    :before-close="cancel"
    destroy-on-close
    class="app-dialog-container">
    <div v-szd-dialog="[800, 500]" />
    <div class="main-table-title">
      <div class="main-table-title-left" style="width: 100%">
        <span>{{ $t("注意：高级查询条件行之间是或的关系，维护查询条件时请注意是否存在影响。") }}</span>
      </div>
    </div>
    <div class="szd__tb__wrapper">
      <el-table :data="ranges" border>
        <el-table-column prop="option" :label="$t('操作符')" width="150">
          <template v-slot="scope">
            <el-select v-model="scope.row.option" @change="changeOperator($event, scope.row)" :disabled="readonly || disabled" clearable>
              <el-option
                v-for="item in filterOperators"
                :disabled="scope.row.high === '' && onlyHigh.includes(item.value)"
                :key="item.value"
                :value="item.value"
                :label="item.label" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="low" :label="$t(!noTo ? '低值' : '值')">
          <template v-slot="scope">
            <szd-input
              v-if="type === 'string' || type === 'number'"
              v-model="scope.row.low"
              :type="type"
              :num-dot="numDot"
              :num-dec="numDec"
              :show-help="_showHelp"
              @help="dealMultiHelp('low', scope.$index)"
              :readonly="readonly"
              :disabled="onlyNull.includes(scope.row.option) || disabled"
              :clearable="!_showHelp && clearable"
              @change="changeLow($event, scope.row)"
              @click="focusRow(scope.$index)" />
            <szd-time
              v-else-if="type === 'time'"
              v-model="scope.row.low"
              :readonly="readonly"
              :disabled="onlyNull.includes(scope.row.option) || disabled"
              @change="changeLow($event, scope.row)"
              @focus="focusRow(scope.$index)"
              :clearable="clearable" />
            <szd-date
              v-else
              v-model="scope.row.low"
              :type="type"
              :readonly="readonly"
              :disabled="onlyNull.includes(scope.row.option) || disabled"
              @change="changeLow($event, scope.row)"
              @focus="focusRow(scope.$index)"
              :clearable="clearable" />
          </template>
        </el-table-column>
        <el-table-column v-if="!noTo" prop="high" :label="$t('高值')">
          <template v-slot="scope">
            <szd-input
              v-if="type === 'string' || type === 'number'"
              v-model="scope.row.high"
              :type="type"
              :num-dot="numDot"
              :num-dec="numDec"
              :show-help="_showHelp"
              @help="dealMultiHelp('high', scope.$index)"
              :readonly="readonly"
              :disabled="onlyNull.includes(scope.row.option) || disabled"
              :clearable="!_showHelp && clearable"
              @change="changeHigh($event, scope.row)"
              @click="focusRow(scope.$index)" />
            <szd-time
              v-else-if="type === 'time'"
              v-model="scope.row.high"
              :readonly="readonly"
              :disabled="onlyNull.includes(scope.row.option) || disabled"
              @change="changeHigh($event, scope.row)"
              @focus="focusRow(scope.$index)"
              :clearable="clearable" />
            <szd-date
              v-else
              v-model="scope.row.high"
              :type="type"
              :readonly="readonly"
              :disabled="onlyNull.includes(scope.row.option) || disabled"
              @change="changeHigh($event, scope.row)"
              @focus="focusRow(scope.$index)"
              :clearable="clearable" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" align="center" width="100">
          <template v-slot="scope">
            <szd-button label="删除" type="primary" link @click="remove(scope.$index)" :disabled="readonly" icon="Delete" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <szd-button label="新增" type="primary" @click="addRanges" :disabled="readonly" />
      <szd-button label="粘贴" type="primary" @click="paste" :disabled="readonly" />
      <szd-button label="清空" type="primary" @click="clearRanges" :disabled="readonly" />
      <szd-button label="确认" type="primary" @click="confirm" :disabled="readonly" />
      <szd-button label="取消" type="primary" @click="cancel" />
    </template>
  </el-dialog>
</template>
<script setup>
  import { ref, watch, computed, defineProps, defineEmits } from "vue";
  import { $m, $t } from "../../common/utils/globalConfig";
  import { szdSh, szdShShow } from "../searchHelp/serchHelp";
  import _ from "lodash";

  const props = defineProps({
    //类型支持string,number,boolean,date,datetime,time,year,month
    type: {
      type: String,
      default: "string" //默认字符串
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    numDot: {
      type: Boolean
    },
    numDec: {
      type: Number
    },
    //[基础字段-单值,要回填的字段-单值,查询条件(数组)]
    //{a:baseField, c:mapping, d:baseSelect}
    help: {
      type: Object
    },
    //无范围
    noTo: {
      type: Boolean,
      default: false
    },
    //无多选
    noExt: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    selectOpt: {
      type: Boolean,
      default: false
    },
    enter: {
      type: Boolean,
      default: true
    }
  });
  //单值操作符
  const onlyLow = ["EQ", "NE", "GE", "LE", "GT", "LT", "SP", "NS", "CP", "NC", "EN", "NN"];
  //范围操作符
  const onlyHigh = ["BT", "NB"];
  //日期和数值不允许使用的操作符
  const onlyLike = ["SP", "NS", "CP", "NC"];
  //空操作符禁用输入框框
  const onlyNull = ["EN", "NN"];
  //操作符描述
  const operators = [
    { value: "EQ", label: $t("等于") },
    { value: "NE", label: $t("不等于") },
    { value: "GE", label: $t("大于或等于") },
    { value: "LE", label: $t("小于或等于") },
    { value: "GT", label: $t("大于") },
    { value: "LT", label: $t("小于") },
    { value: "SP", label: $t("包含") },
    { value: "NS", label: $t("不包含") },
    { value: "CP", label: $t("*通配符包含") },
    { value: "NC", label: $t("*通配符不包含") },
    { value: "BT", label: $t("范围内") },
    { value: "NB", label: $t("范围外") },
    { value: "EN", label: $t("等于空") },
    { value: "NN", label: $t("不等于空") }
  ];
  //boolean数据类型
  const _boolean = ref("A");
  //下拉框数据类型
  const _selectVal = ref();
  //是否显示搜索帮助
  const _showHelp = computed(() => {
    return props.help && props.help.a;
  });
  //是否下拉框
  const _selectOpt = computed(() => {
    return props.selectOpt && props.type !== "boolean" && props.help && props.help.a;
  });
  //查询数据
  const ranges = ref([
    {
      type: props.type,
      option: "",
      low: "",
      high: ""
    }
  ]);
  //初始化行数据
  const addRanges = () => {
    ranges.value.push({
      type: props.type,
      option: "",
      low: "",
      high: ""
    });
  };
  //显示Dialog
  const visible = ref(false);
  //克隆原始值
  const initRanges = ref([]);
  //光标当前行
  const cursorRowIndex = ref(0);
  //更新数据对象返回值
  const emit = defineEmits(["update:modelValue", "keydownEnter"]);

  //单输入框值改变索帮助
  const dealSingleHelp = key => {
    const _c = props.help.c ? props.help.c : "*";
    szdSh({
      a: props.help.a,
      b: ranges.value[0],
      c: [key + "-" + _c],
      d: props.help.d
    }).then(res => {
      if (res && res.chgFlag) {
        changeSingle();
      }
    });
  };
  //单输入框值改变处理
  const changeSingle = () => {
    changeRowCheck(ranges.value[0]);
    const result = delDuplicate();
    emit("update:modelValue", result);
  };
  //boolean入框值改变处理
  const changeBoolean = () => {
    let _boolResult = [];
    if (_boolean.value === "0" || _boolean.value === "1") {
      _boolResult.push({
        type: props.type,
        option: "EQ",
        low: _boolean.value === "1",
        high: undefined
      });
    }
    emit("update:modelValue", _boolResult);
  };
  //下拉框值改变处理
  const changeSelect = () => {
    let _selectResult = [];
    if (_selectVal.value !== undefined && _selectVal.value !== null && _selectVal.value !== "") {
      _selectResult.push({
        type: props.type,
        option: "EQ",
        low: _selectVal.value,
        high: undefined
      });
    }
    emit("update:modelValue", _selectResult);
  };
  //弹出Dialog对话框
  const showDialog = () => {
    //初始化光标行
    cursorRowIndex.value = 0;
    //克隆原始值
    initRanges.value = _.cloneDeep(ranges.value);
    //显示弹窗
    visible.value = true;
  };
  //下拉框显示设置
  const filterOperators = computed(() => {
    if (props.type === "string") {
      return operators;
    } else {
      //不显示匹配数据
      return operators.filter(item => !onlyLike.includes(item.value));
    }
  });
  //操作符改变时值处理，当运算符清空时高低值随之清空
  const changeOperator = (e, row) => {
    if (e === "" || e == null || onlyNull.includes(row.option)) {
      row.low = row.high = undefined;
    } else if (!onlyHigh.includes(e)) {
      row.high = undefined;
    }
  };
  //低值改变时触发业务
  const changeLow = (e, row) => {
    changeRowCheck(row);
  };
  //高值改变时触发业务
  const changeHigh = (e, row) => {
    changeRowCheck(row);
  };
  //点击按钮处理，获取光标当前所在行
  const focusRow = rowIndex => {
    cursorRowIndex.value = rowIndex;
  };
  //删除行数据
  const remove = index => {
    ranges.value.splice(index, 1);
    if (ranges.value.length === 0) {
      addRanges();
    }
  };
  //清空数据
  const clearRanges = () => {
    ranges.value = [];
    for (let i = 0; i < 10; i++) {
      addRanges();
    }
  };
  //取消事件，还原初始值
  const cancel = () => {
    ranges.value = _.cloneDeep(initRanges.value);
    visible.value = !visible.value;
  };
  //确认数据
  const confirm = () => {
    //检查有效性
    if (checkValidate.value > -1) {
      $m("CORE_CLIENT.E077", [ranges.value[checkValidate.value].low, ranges.value[checkValidate.value].high]); //低值 & 不能大于高值 &
      return;
    }
    //删除无效行和重复行
    const result = delDuplicate();
    emit("update:modelValue", result);
    cancel();
  };
  //检查数据维护是否正确
  const checkValidate = computed(() => {
    let passedIndex = -1;
    passedIndex = ranges.value.findIndex(item => {
      const low = props.type === "number" ? Number(item.low) : item.low;
      const high = props.type === "number" ? Number(item.high) : item.high;
      return onlyHigh.includes(item.option) && low > high;
    });
    return passedIndex;
  });
  //删除无效行和重复行
  const delDuplicate = () => {
    const res = ranges.value.filter(item => item.option !== "");
    return Array.from(new Set(res.map(JSON.stringify)), JSON.parse);
  };
  //多选数据进行处理
  const dealMultiHelp = (key, index) => {
    szdShShow({ a: props.help.a, d: props.help.d, f: key === "low" ? 2 : 1 }).then(res => {
      if (res) {
        let idx = index;
        const _c = props.help.c ? props.help.c : res.param.defFieldId;
        res.data.forEach(item => {
          ranges.value[idx][key] = item[_c];
          //检查设置数据
          changeRowCheck(ranges.value[idx]);
          //设置下一行
          idx++;
          if (idx >= ranges.value.length) {
            addRanges();
          }
        });
      }
    });
  };
  //监听数值变化
  watch(
    () => props.modelValue,
    val => {
      ranges.value = _.cloneDeep(val);
      if (ranges.value.length < 10) {
        for (let i = 0, len = 10 - ranges.value.length; i < len; i++) {
          addRanges();
        }
      }
      //记录初始值
      initRanges.value = _.cloneDeep(ranges.value);
      //boolean类型复制
      if (props.type === "boolean") {
        if (Array.isArray(props.modelValue) && props.modelValue.length > 0 && _.isBoolean(props.modelValue[0].low)) {
          _boolean.value = props.modelValue[0].low ? "1" : "0";
        } else {
          _boolean.value = "A";
        }
      }
      //下拉框赋值
      if (_selectOpt) {
        if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
          _selectVal.value = props.modelValue[0].low;
        } else {
          _selectVal.value = undefined;
        }
      }
    },
    //监听器会在初始化时立即执行
    { deep: true, immediate: true }
  );
  //检查数据和设置已操作符
  const changeRowCheck = row => {
    //选择空
    if (onlyNull.includes(row.option)) {
      row.low = row.high = undefined;
      return;
    }
    //检查大小
    if (!props.noTo) {
      if (row.high) {
        const low = props.type === "number" ? Number(row.low) : row.low;
        const high = props.type === "number" ? Number(row.high) : row.high;
        if (low > high) {
          $m("CORE_CLIENT.E077", [row.low, row.high]); //低值 & 不能大于高值 &
          row.high = undefined;
        }
      }
    } else {
      if (row.high) row.high = undefined;
    }
    //设置操作符号
    if (row.high) {
      row.option = onlyHigh.includes(row.option) ? row.option : "BT";
    } else {
      if (row.low) {
        row.option = onlyLow.includes(row.option) ? row.option : "EQ";
        if (props.type === "string") {
          if (row.option === "EQ" && row.low.includes("*")) row.option = "CP";
          if ((row.option === "CP" || row.option === "NC") && !row.low.includes("*")) row.option = "EQ";
        }
      } else {
        row.option = "";
      }
    }
  };
  //粘贴事件
  const paste = async () => {
    try {
      const res = await navigator.clipboard.readText();
      const rows = res
        .replace(/"((?:[^"]*(?:\r\n|\n\r|\n|\r))+[^"]+)"/gm, function (match, p1) {
          return p1.replace(/""/g, '"').replace(/\r\n|\n\r|\n|\r/g, " ");
        })
        .split(/\r\n|\n\r|\n|\r/g);
      //检查最后一行是否为空
      if (rows.length > 0 && rows[rows.length - 1] === "") {
        rows.splice(rows.length - 1, 1);
      }
      if (rows.length === 0) return;
      //处理数据
      if (pasteCheck(rows)) {
        let idx = cursorRowIndex.value;
        rows.forEach(item => {
          const arrVal = item.split("\t");
          //检查是否存在值
          if (arrVal.length > 0) {
            if (props.noTo) {
              ranges.value[idx].option = "EQ";
              ranges.value[idx].low = arrVal[0];
              ranges.value[idx].high = undefined;
            } else {
              if (arrVal.length > 1 && arrVal[1]) {
                ranges.value[idx].option = "BT";
                ranges.value[idx].low = arrVal[0];
                ranges.value[idx].high = arrVal[1];
              } else {
                ranges.value[idx].option = "EQ";
                ranges.value[idx].low = arrVal[0];
                ranges.value[idx].high = undefined;
              }
            }
          } else {
            ranges.value[idx].option = "";
            ranges.value[idx].low = undefined;
            ranges.value[idx].high = undefined;
          }
          //数值格式化
          if (props.type === "number") {
            ranges.value[idx].low = Number(ranges.value[idx].low);
            ranges.value[idx].high = Number(ranges.value[idx].high);
          }
          //检查设置数据
          changeRowCheck(ranges.value[idx]);
          //设置下一行
          idx++;
          if (idx >= ranges.value.length) {
            addRanges();
          }
        });
      }
    } catch (err) {
      console.error("粘贴数据失败: ", err);
    }
  };
  //检查粘贴的数据
  const pasteCheck = rows => {
    if (props.type === "string") return true;
    //检查数据合规正则
    let regex = "";
    if (props.type === "number") {
      regex = /^\d+(\.\d+)?$/;
    } else if (props.type === "date") {
      regex = /^\d{4}-\d{2}-\d{2}$/;
    } else if (props.type === "datetime") {
      regex = /^\d{4}-\d{2}-\d{2} ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    } else if (props.type === "time") {
      regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    } else if (props.type === "year") {
      regex = /^\d{4}$/;
    } else if (props.type === "month") {
      regex = /^\d{4}-\d{2}$/;
    }
    //检查数据是否合规
    for (let i = 0; i < rows.length; i++) {
      if (props.type === "number") rows[i] = rows[i].replaceAll(",", "");
      const arrTemp = rows[i].split("\t");
      if (arrTemp.length > 0 && arrTemp[0] && !regex.test(arrTemp[0])) {
        $m("CORE_CLIENT.E070", arrTemp[0]); //数据 & 格式错误
        return false;
      }
      if (arrTemp.length > 1 && arrTemp[1] && !regex.test(arrTemp[1])) {
        $m("CORE_CLIENT.E070", arrTemp[1]); //数据 & 格式错误
        return false;
      }
    }
    return true;
  };
</script>
<style scoped lang="scss">
  .g-seniorWrap {
    display: flex;
    width: 100%;
    align-items: center;

    :deep(.el-input) {
      flex: 1;
    }

    .u-sp {
      padding: 0 5px;
    }

    .u-open {
      width: 26px;
      height: 26px;
      margin: 0;
    }
  }

  .m-btn {
    text-align: right;
    padding-bottom: 5px;
  }

  .u-ruleBtn {
    margin-left: 5px;
    font-weight: 600;

    &.active {
      color: #008f01;
      background-color: #b3e19d;
      border-color: #b3e19d;
    }
  }

  :deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
    width: 100%;
  }

  .el-select-dropdown__item {
    font-size: $fz;
  }

  .u-btnWrap {
    height: 26px;
    width: 35px;
    line-height: 26px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }
</style>
