<template>
  <div class="navbar">
    <!-- 导航栏左部分 -->
    <div class="navbar-left"></div>

    <!-- 导航栏右部分 -->
    <div class="navbar-right" style="margin-right: 15px">
      <span class="navbar-right-span">{{ $t("欢迎您！") }}</span>
      <el-tooltip :content="$t('个人中心')" placement="bottom">
        <div class="navbar-right-item" style="font-weight: bolder">
          {{ loginUser.user.userName }}
        </div>
      </el-tooltip>

      <el-tooltip :content="$t('操作手册')" placement="bottom">
        <handleDoc class="navbar-right-item" style="font-size: 23px" />
      </el-tooltip>

      <el-tooltip :content="$t('全屏')" placement="bottom">
        <screenfull id="screenfull" class="navbar-right-item" style="font-size: 16px" />
      </el-tooltip>

      <el-tooltip :content="$t('注销')" placement="bottom">
        <div class="navbar-right-item" @click="logout">
          <szd-svg name="logout" style="font-size: 23px; cursor: pointer" />
        </div>
      </el-tooltip>

      <el-tooltip v-if="!szdLicense" :content="$t('官网')" placement="bottom">
        <div class="navbar-right-item" @click="goSzdSoft" style="padding-left: 2px">
          <img src="../../../client/assets/image/szd.png" style="width: 48px; cursor: pointer" />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import store from "~store";
  import { $t } from "../../../client/common/utils/globalConfig";
  import screenfull from "./navbar/screenfull.vue";
  import handleDoc from "./navbar/handleDoc.vue";
  import { ElMessageBox } from "element-plus";
  //用户登录信息
  const loginUser = ref(store.state.loginUser);
  const szdLicense = ref(store.state.loginUser.homeConfig.license);

  //退出登录
  const logout = async () => {
    ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        store.dispatch("LogOut").then(() => {
          location.reload();
        });
      })
      .catch(() => {
      });
  };

  //导航公司官网
  const goSzdSoft = () => {
    window.open("https://www.szdsoft.cn", "_blank");
  };
</script>

<style lang="scss" scoped>
  .navbar {
    display: flex;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    background: $navbar;
    box-shadow: 0px 1px 4px rgba(0, 24, 48, 0.1);

    .navbar-left {
      display: flex;
      align-items: center;
      flex: 1;
      height: 49px;
      line-height: 49px;
      overflow-x: auto;

      :deep(.el-menu-item) {
        height: 49px;
        font-size: 14px;
        font-weight: 700;

        &.is-active {
          background-color: rgba(64, 158, 255, 0.1);
        }
      }
    }

    .navbar-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
      line-height: 50px;
      flex-shrink: 0;

      .navbar-right-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 6px;
        font-size: 14px;
        //color: #53565e;
        cursor: pointer;

        .msg-num {
          position: absolute;
          top: -5px;
          right: 0;
          padding: 0px;
          width: 16px;
          height: 16px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: red;
          color: #fff;
          font-size: $fz;
          line-height: 1.2;
        }

        &:hover {
          color: #1879ff;
          font-weight: bolder;
        }
      }

      .navbar-right-span {
        font-size: 14px;
        padding-left: 8px;
      }

      .navbar-right-icon {
        font-size: 20px;
        font-weight: 500;
      }

      .navbar-right-icon-ms {
        font-size: 20px;
        font-weight: 500;
        color: #1890ff;
        cursor: pointer;

        &:hover {
          color: #1879ff;
        }
      }
    }
  }

  .layui-nav .layui-nav-item {
    position: relative;
    display: inline-block;
    margin-top: 0;
    list-style: none;
    vertical-align: middle;
    line-height: 60px;
  }
</style>