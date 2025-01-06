<template>
  <div @click="handleClick">
    <szd-svg :name="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" />
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import screenfull from "screenfull";
  import { ElMessage } from "element-plus"; //全屏插件

  const isFullscreen = ref(false);
  //设置全屏
  const handleClick = () => {
    if (!screenfull.isEnabled) {
      ElMessage.warning("you browser can not work");
      return;
    }
    screenfull.toggle();
    //发生改变进行回调
    screenfull.on("change", () => {
      isFullscreen.value = screenfull.isFullscreen;
    });
  };
</script>
