<template lang="html">
  <div :val="value_">
    <div>
      <el-radio v-model="type" label="1" size="default" border>{{ $t("每年") }}</el-radio>
    </div>
    <div>
      <el-radio v-model="type" label="2" size="default" border>{{ $t("周期") }}</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">{{ $t("从") }}</span>
      <el-input-number @change="type = '2'" v-model="cycle.start" :min="2000" size="default"></el-input-number>
      <span style="margin-left: 5px; margin-right: 5px">{{ $t("至") }}</span>
      <el-input-number @change="type = '2'" v-model="cycle.end" :min="2000" size="default"></el-input-number>
      年
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      modelValue: {
        type: String,
        default: "*"
      }
    },
    data() {
      let year = new Date().getFullYear();
      return {
        type: "1", // 类型
        cycle: {
          // 周期
          start: year,
          end: year
        },
        loop: {
          // 循环
          start: 0,
          end: 0
        },
        week: {
          // 指定周
          start: 0,
          end: 0
        },
        work: 0,
        last: 0,
        appoint: [] // 指定
      };
    },
    computed: {
      value_() {
        let result = [];
        switch (this.type) {
          case "1": // 每秒
            result.push("*");
            break;
          case "2": // 年期
            result.push(`${this.cycle.start}-${this.cycle.end}`);
            break;
          case "3": // 循环
            result.push(`${this.loop.start}/${this.loop.end}`);
            break;
          case "4": // 指定
            result.push(this.appoint.join(","));
            break;
          case "6": // 最后
            result.push(`${this.last === 0 ? "" : this.last}L`);
            break;
          default: // 不指定
            result.push("?");
            break;
        }
        this.$emit("update:modelValue", result.join(""));
        this.$emit("check");
        return result.join("");
      }
    },
    watch: {
      value(nv, ov) {
        this.updateVal(nv);
      }
    },
    methods: {
      updateVal(nv) {
        if (!nv) {
          return;
        }
        if (nv === "?") {
          this.type = "5";
        } else if (nv.indexOf("-") !== -1) {
          // 2周期
          if (nv.split("-").length === 2) {
            this.type = "2";
            this.cycle.start = Number(nv.split("-")[0]);
            this.cycle.end = Number(nv.split("-")[1]);
          }
        } else if (nv.indexOf("/") !== -1) {
          // 3循环
          if (nv.split("/").length === 2) {
            this.type = "3";
            this.loop.start = Number(nv.split("/")[0]);
            this.loop.end = Number(nv.split("/")[1]);
          }
        } else if (nv.indexOf("*") !== -1) {
          // 1每
          this.type = "1";
        } else if (nv.indexOf("L") !== -1) {
          // 6最后
          this.type = "6";
          this.last = nv.replace("L", "");
        } else if (nv.indexOf("#") !== -1) {
          // 7指定周
          if (nv.split("#").length === 2) {
            this.type = "7";
            this.week.start = Number(nv.split("#")[0]);
            this.week.end = Number(nv.split("#")[1]);
          }
        } else if (nv.indexOf("W") !== -1) {
          // 8工作日
          this.type = "8";
          this.work = nv.replace("W", "");
        } else {
          // *
          this.type = "4";
          this.appoint = nv.split(",");
        }
      }
    },
    created() {
      this.updateVal(this.modelValue);
    }
  };
</script>

<style lang="css" scoped>
  .el-checkbox + .el-checkbox {
    margin-left: 10px;
  }
</style>
