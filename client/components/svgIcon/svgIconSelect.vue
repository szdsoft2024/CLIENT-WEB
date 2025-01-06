<!-- svgIcon选择页面 -->
<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative" placeholder="请输入图标名称" @clear="filterIcons" @input="filterIcons">
      <template #suffix>
        <i class="el-icon-search el-input__icon"></i>
      </template>
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <szd-svg :name="item.svgId" style="height: 30px; width: 16px; margin-right: 3px" />
        <span>{{ item.svgId }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { listSvg } from "../api/svg.js";

  export default {
    name: "IconSelect",
    data() {
      return {
        name: "",
        iconList: [],
        iconListCopy: []
      };
    },
    methods: {
      initSvgList() {
        listSvg(this.queryParams).then(response => {
          this.iconList = response.data;
          this.iconListCopy = _.cloneDeep(this.iconList);
        });
      },
      filterIcons() {
        if (this.name) {
          this.iconList = this.iconListCopy.filter(item => item.svgId.indexOf(this.name) === 0);
        } else {
          this.iconList = this.iconListCopy;
        }
      },
      selectedIcon(name) {
        this.$emit("selected", name.svgId);
        document.body.click();
      },
      reset() {
        this.name = "";
        this.iconList = this.iconListCopy;
      }
    },
    mounted() {
      this.initSvgList();
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-body {
    width: 100%;
    padding: 10px;

    .icon-list {
      height: 200px;
      overflow-y: scroll;

      div {
        height: 30px;
        line-height: 30px;
        margin-bottom: -5px;
        cursor: pointer;
        width: 33%;
        float: left;
        display: flex;
      }

      span {
        display: inline-block;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
    }
  }
</style>
