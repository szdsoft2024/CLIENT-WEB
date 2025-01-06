<template lang="html">
  <div>
    <div>
      <el-radio v-model="type" label="1" size="small" border>{{ $t("每周") }}</el-radio>
    </div>
    <div>
      <el-radio v-model="type" label="5" size="small" border>{{ $t("不指定") }}</el-radio>
    </div>
    <div>
      <el-radio v-model="type" label="2" size="small" border>{{ $t("周期") }}</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">{{ $t("从星期") }}</span>
      <el-input-number @change="type = '2'" v-model="cycle.start" :min="1" :max="7" size="small" style="width: 100px"></el-input-number>
      <span style="margin-left: 5px; margin-right: 5px">{{ $t("至星期") }}</span>
      <el-input-number @change="type = '2'" v-model="cycle.end" :min="2" :max="7" size="small" style="width: 100px"></el-input-number>
    </div>
    <div>
      <el-radio v-model="type" label="3" size="small" border>{{ $t("循环") }}</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">{{ $t("从星期") }}</span>
      <el-input-number @change="type = '3'" v-model="loop.start" :min="1" :max="7" size="small" style="width: 100px"></el-input-number>
      <span style="margin-left: 5px; margin-right: 5px">{{ $t("开始") }}，{{ $t("每") }}</span>
      <el-input-number @change="type = '3'" v-model="loop.end" :min="1" :max="7" size="small" style="width: 100px"></el-input-number>
      {{ $t("天执行一次") }}
    </div>
    <div>
      <el-radio v-model="type" label="7" size="small" border>{{ $t("指定周") }}</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">{{ $t("本月第") }}</span>
      <el-input-number @change="type = '7'" v-model="week.start" :min="1" :max="4" size="small" style="width: 100px"></el-input-number>
      <span style="margin-left: 5px; margin-right: 5px">{{ $t("周") }}，星期</span>
      <el-input-number @change="type = '7'" v-model="week.end" :min="1" :max="7" size="small" style="width: 100px"></el-input-number>
    </div>
    <div>
      <el-radio v-model="type" label="6" size="small" border>{{ $t("本月最后一个") }}</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">{{ $t("星期") }}</span>
      <el-input-number @change="type = '6'" v-model="last" :min="1" :max="7" size="small" style="width: 100px"></el-input-number>
    </div>
    <div>
      <el-radio v-model="type" label="4" size="small" border>{{ $t("指定") }}</el-radio>
      <el-checkbox-group v-model="appoint" style="margin-left: 50px; line-height: 25px">
        <el-checkbox @change="type = '4'" v-for="i in 7" :key="i" :label="i.toString()"></el-checkbox>
      </el-checkbox-group>
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
      return {
        type: "1", // 类型
        cycle: {
          // 周期
          start: 0,
          end: 0
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
        const { cycle, loop, appoint, last, week, type, work } = this;
        return { cycle, loop, appoint, last, week, type, work };
      }
    },
    watch: {
      value(nv, ov) {
        this.updateVal();
      },
      value_: {
        handler(val) {
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
            case "7": // 指定周
              result.push(`${this.week.start}#${this.week.end}`);
              break;
            default: // 不指定
              result.push("?");
              break;
          }
          this.$emit("update:modelValue", result.join(""));
          this.$emit("check");
        },
        deep: true
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
