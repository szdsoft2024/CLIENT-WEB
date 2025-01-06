<template>
  <!-- 通用描述标签 -->
  <div>
    <div v-text="val" class="code-desc-scrollbar" />
  </div>
</template>

<script>
  export default {
    props: ["modelValue"],
    data() {
      return {
        val: this.modelValue
      };
    },
    watch: {
      modelValue(val) {
        this.val = val;
      }
    }
  };
</script>

<style scoped>
  /* 滑动显示文字 */
  .code-desc-scrollbar {
    padding-left: 5px;
    display: block;
    white-space: nowrap;
    overflow: auto;
    color: #606266;
    /* text-overflow: ellipsis; */
  }

  .code-desc-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
