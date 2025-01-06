<template>
  <svg v-if="iconName" :class="svgClass" v-bind="$attrs" :style="setStyle" viewbox="0 0 128 128" @click="clicked ? emit('click') : ''">
    <use :xlink:href="iconName" />
  </svg>
  <div v-if="label" style="padding-left: 2px">{{ label }}</div>
</template>

<script setup>
  import { defineProps, computed, defineEmits } from "vue";

  const props = defineProps({
    name: {
      type: String
    },
    //内置程序svg
    fixed: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ""
    },
    fontSize: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    clicked: {
      type: Boolean,
      default: false
    }
  });

  //定义事件
  const emit = defineEmits(["click"]);

  const iconName = computed(() => {
    if (props.name) {
      return props.fixed ? `#icon-${props.name}` : `#${props.name}`;
    } else {
      return "";
    }
  });
  const svgClass = computed(() => {
    let _class = ["svg-icon"];
    if (props.name) _class.push(`icon-${props.name}`);
    if (props.clicked) _class.push("svg-chick");
    return _class;
  });
  //设置样式
  const setStyle = computed(() => {
    let _style = {};
    if (props.color) _style["color"] = props.color;
    if (props.fontSize) _style["fontSize"] = props.fontSize;
    return _style;
  });
</script>

<style lang="scss">
  .svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
  }

  .svg-chick {
    cursor: pointer;

    &:hover {
      color: rgb(32, 160, 255);
      font-weight: 600;
    }
  }
</style>
