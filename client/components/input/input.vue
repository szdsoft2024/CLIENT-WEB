<template>
  <el-input
    v-if="!_fst.hide"
    ref="inputRef"
    v-model="_modelValue"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :readonly="_fst.readonly || _fst.disabled"
    :clearable="clearable"
    :input-style="{ textAlign: _align }"
    :class="[dblclick ? 'dblclickFont' : '', _fst.disabled ? 'disabledBg' : '']"
    :oninput="handleOninput"
    :ondblclick="dblclick ? handleOnDblClick : ''"
    @keydown.enter="enter ? handleKeydownEnter() : ''"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur">
    <template #suffix>
      <el-icon v-if="showHelp">
        <Search @click.prevent.stop="_fst.disabled ? '' : handleHelp()" />
      </el-icon>
    </template>
  </el-input>
  <!--     :disabled="disabled" -->
</template>

<script setup>
  import { ElMessage } from "element-plus";
  import _ from "lodash";
  import { $m, $t } from "../../common/utils/globalConfig";
  import { addThousandSeparator, removeThousandSeparator } from "pixiu-number-toolkit";
  import { defineProps, defineEmits, computed, ref, nextTick, watch } from "vue";
  import { szdSh } from "../searchHelp/serchHelp";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    modelValue: {
      type: [String, Number]
    },
    //类型支持string,number
    type: {
      type: String,
      default: "string"
    },
    numDot: {
      type: Boolean,
      default: false
    },
    numDec: {
      type: [Number, String]
    },
    numMax: {
      type: Number
    },
    numMin: {
      type: Number
    },
    placeholder: {
      type: String
    },
    maxlength: {
      type: [Number, String]
    },
    showHelp: {
      type: [Boolean, String],
      default: false
    },
    help: {
      type: Object
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    align: {
      type: String
    },
    noZero: {
      type: Boolean,
      default: false
    },
    format: {
      type: [Object, String]
    },
    dblclick: {
      type: Boolean,
      default: false
    },
    enter: {
      type: Boolean,
      default: false
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    }
  });
  const inputRef = ref();
  //定义事件
  const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur", "help", "dblclick", "keydownEnter"]);
  //值数据
  const _modelValue = ref();
  const numFormat = ref(false);
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled, props.readonly);
  });
  //对齐方式 文本默认左对齐，数值默认右对齐
  const _align = computed(() => {
    let alignTemp = "left";
    if (props.align) {
      alignTemp = props.align;
    } else if (props.type === "number") {
      alignTemp = "right";
    }
    return alignTemp;
  });
  //数值不显示0
  const _noZero = computed(() => {
    return _fst.value.disabled || _fst.value.readonly ? props.noZero : true;
  });
  //数据格式化
  const _format = computed(() => {
    if (_fst.value.disabled || _fst.value.readonly || !props.format || props.type === "number") {
      return false;
    } else {
      return setFormatObj();
    }
  });

  //监听值数据
  watch(
    () => props.modelValue,
    () => {
      _modelValue.value = props.modelValue;
      if (props.type === "number") {
        nextTick(() => {
          setNumFormat();
        });
      }
    },
    { immediate: true }
  );
  //设置千分位和小数位
  const setNumFormat = () => {
    if (props.type === "number") {
      numFormat.value = true;
      if (_noZero.value && !_modelValue.value) {
        nextTick(() => {
          if (inputRef.value) inputRef.value.input.value = "";
        });
      } else {
        // 小数位设置
        if (!isNaN(props.numDec) && props.numDec >= 0 && props.numDec !== null && props.numDec !== undefined && !isNaN(_modelValue.value)) {
          _modelValue.value = Number(_modelValue.value).toFixed(props.numDec);
        }
        // 千分位设置
        if (props.numDot && _modelValue.value) {
          nextTick(() => {
            if (inputRef.value && !inputRef.value.input.value.includes(",")) {
              inputRef.value.input.value = addThousandSeparator(inputRef.value.input.value);
            }
          });
        }
      }
    }
  };
  //顺序1.当选择器的输入框获得焦点时触发
  const handleFocus = e => {
    //数值型
    if (props.type === "number") {
      numFormat.value = false;
      //去除千分位符
      if (props.numDot && e.target.value && e.target.value.includes(",")) {
        e.target.value = removeThousandSeparator(e.target.value);
      }
      //格式化小数位
      if (!isNaN(props.numDec) && props.numDec >= 0 && e.target.value) {
        e.target.value = Number(e.target.value).toFixed(props.numDec);
      }
    }
    //赋值
    _modelValue.value = e.target.value;
    emit("focus", e);
  };
  //顺序2.原生输入事件
  const handleOninput = e => {
    if (props.type === "number") {
      //包含,直接替换
      e.target.value = e.target.value.replace(/,/g, "");
      // 非输入.和-和数字 || 自动恢复数据 检测2个. || 检测2个以上负号 || 检测负号出现在非首位 || 负号后边不允许出现连续0
      if (
        /[^\-\d.]/.test(e.target.value) ||
        /(\.\d*)\./.test(e.target.value) ||
        /\-{2,}/.test(e.target.value) ||
        /(\d+|\.)-/.test(e.target.value) ||
        /-(0){2,}/.test(e.target.value)
      ) {
        e.target.value = _modelValue.value;
      } else {
        _modelValue.value = e.target.value; //赋值
      }
    } else {
      if (_format.value && !_format.value.error && !_format.value.regex.test(e.target.value)) {
        e.target.value = _modelValue.value;
      } else {
        _modelValue.value = e.target.value; //赋值
      }
    }
  };
  //顺序4.文本输入事件
  const handleInput = v => {
    emit("input", v);
  };
  //顺序5.更改事件
  const handleChange = v => {
    if (props.type === "number") {
      let val = v;
      //包含,直接替换
      val = val.replace(/,/g, "");
      //检查数据 非输入.和-和数字 || 自动恢复数据 检测2个. || 检测2个以上负号 || 检测负号出现在非首位 || 负号后边不允许出现连续0
      if (/[^\-\d.]/.test(val) || /(\.\d*)\./.test(val) || /\-{2,}/.test(val) || /(\d+|\.)-/.test(val) || /-(0){2,}/.test(val)) {
        $m("CORE_CLIENT.E070", val); //数据 & 格式错误
        val = "0";
      }
      //检查大小
      if (!isNaN(props.numMax) && Number(val) > props.numMax) {
        //检查数值是否超过最大值
        $m("CORE_CLIENT.E071", props.numMax); //最大值为 &
        val = props.numMax;
      } else if (!isNaN(props.numMin) && Number(val) < props.numMin) {
        //检查数值是否超过最小值
        $m("CORE_CLIENT.E072", props.numMin); //最小值为 &
        val = props.numMin;
      }
      //最多允许输入的小数位
      if (!isNaN(props.numDec) && props.numDec >= 0) {
        if (new RegExp("\\.\\d{" + (props.numDec + 1) + ",}$").test(val)) {
          $m("CORE_CLIENT.E073", props.numDec); //小数位超过 & 位，数据被更正
          val = Number(val).toFixed(props.numDec);
        }
      }
      //字符串格式化为数字
      val = Number(val);
      //更新数据
      emit("update:modelValue", val);
      emit("change", val);
    } else {
      if (_format.value) {
        if (!_format.value.regex.test(v)) {
          ElMessage.error(_format.value.errMsg);
          v = "";
          if (inputRef.value) inputRef.value.input.value = "";
        }
        if (v) {
          if (_format.value.convert === "upper") {
            v = v.toUpperCase();
          } else if (_format.value.convert === "lower") {
            v = v.toLowerCase();
          }
        }
      }
      //更新数据
      emit("update:modelValue", v);
      emit("change", v);
    }
  };
  //顺序6.当选择器的输入框失去焦点时触发,不对数据变更返回到存储对象
  const handleBlur = e => {
    // 数值类型进行检查
    if (props.type === "number" && !numFormat.value && !e.target.value.includes(",")) {
      numFormat.value = true;
      if (_noZero.value && !Number(_modelValue.value)) {
        e.target.value = "";
      } else {
        //添加小数位，与千分位符顺序不能错
        if (!isNaN(props.numDec) && props.numDec >= 0) {
          e.target.value = Number(e.target.value).toFixed(props.numDec);
        } else {
          e.target.value = Number(e.target.value);
        }
        //设置千分位付
        if (props.numDot && e.target.value) {
          e.target.value = addThousandSeparator(e.target.value);
        }
      }
    }
    emit("blur", e);
  };

  //调用搜索帮助事件
  const handleHelp = () => {
    if (!props.help || !props.help.a) {
      emit("help");
    } else {
      szdSh(props.help).then(res => {
        if (res && res.data.length > 0) {
          //未给数据对象,此处直接复制
          if (!props.help.b || !props.help.c) {
            handleChange(res.chgValue);
          } else if (res.chgFlag) {
            setTimeout(() => {
              handleChange(_modelValue.value);
            }, 0);
          }
        }
      });
    }
  };

  //双击事件
  const handleOnDblClick = () => {
    emit("dblclick");
  };

  //回车事件
  const handleKeydownEnter = () => {
    setTimeout(() => {
      emit("keydownEnter");
    });
  };

  //设置数据检查正则规则
  const setFormatObj = () => {
    if (_.isObject(props.format)) {
      if (props.format.regex) {
        //{regex正则 convert：转化大写和小写upper、lower  error：true 报错 false 替换和报错 errMsg：报错的消息}
        return setFormatObjJson(props.format.regex, props.format.convert, props.format.error, props.format.errMsg);
      } else {
        return false;
      }
    } else {
      switch (props.format) {
        case "upper": //大写  字母、数字、下划线、中划线、点
          return setFormatObjJson("^[A-Za-z0-9._-]*$", "upper", false, $t("请输入字母、数字、下划线、中划线、点"));
        case "upper_": //大写  字母、数字、下划线、中划线
          return setFormatObjJson("^[A-Za-z0-9_-]*$", "upper", false, $t("请输入字母、数字、下划线、中划线"));
        case "upperAlp": //大写  字母
          return setFormatObjJson("^[A-Za-z]*$", "upper", false, $t("请输入字母"));
        case "upperAlpNum": //大写  字母、数字、
          return setFormatObjJson("^[A-Za-z0-9]*$", "upper", false, $t("请输入字母和数字"));
        case "lower": //小写  字母、数字、下划线、中划线、点
          return setFormatObjJson("^[A-Za-z0-9._-]*$", "lower", false, $t("请输入字母、数字、下划线、中划线、点"));
        case "lower_": //小写  字母、数字、下划线、中划线
          return setFormatObjJson("^[A-Za-z0-9_-]*$", "lower", false, $t("请输入字母、数字、下划线、中划线"));
        case "lowerAlp": //小写  字母
          return setFormatObjJson("^[A-Za-z]*$", "lower", false, $t("请输入字母"));
        case "lowerAlpNum": //小写  字母、数字、
          return setFormatObjJson("^[A-Za-z0-9]*$", "lower", false, $t("请输入字母和数字"));
        case "num": //数字  数字
          return setFormatObjJson("^[0-9]*$", "", false, $t("请输入数字"));
        case "alp": //字母
          return setFormatObjJson("^[A-Za-z0-9]*$", "", false, $t("请输入字母"));
        case "alpNum": //字母、数字
          return setFormatObjJson("^[A-Za-z0-9]*$", "", false, $t("请输入字母和数字"));
        default:
          return false;
      }
    }
  };
  const setFormatObjJson = (_regex, _convert, _error, _errMsg) => {
    return {
      regex: new RegExp(_regex),
      convert: ["upper", "lower"].includes(_convert) ? _convert : "",
      error: _.isBoolean(_error) ? _error : false,
      errMsg: _errMsg ? _errMsg : $t("数据格式错误")
    };
  };
</script>
