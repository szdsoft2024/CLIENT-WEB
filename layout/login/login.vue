<template>
  <div class="g-logBg">
    <img class="u-logo" src="../../client/assets/image/logo.png" />
    <!-- 多语言选择 -->
    <div class="login-top">
      <el-select v-model="dg.language" @change="handleChangeLanguage">
        <el-option :value="key" :label="val" v-for="(val, key) in langs" />
      </el-select>
    </div>

    <!-- 主屏幕区 -->
    <div class="login-main" :class="{ flexCenter: dg.isMobile }">
      <div class="login-wrapper" id="logPos">
        <h3 class="login-main-title">用户登录</h3>
        <div class="login-content">
          <!-- 用户名密码 -->
          <login-user ref="loginUser" />
          <!-- 微信 -->
        </div>
      </div>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <div class="footer-text">河北尚智得信息技术有限公司版权所有</div>
    </div>
  </div>
</template>

<script>
  import { getLoginConfig, getSvg } from "../../client/common/api/login";
  import loginUser from "./loginUser.vue";
  import szdStoreCookie from "../../client/common/store/storeCookie";
  import szdStoreLocal from "../../client/common/store/storeLocal";

  export default {
    name: "Login",
    components: {
      loginUser
    },
    data() {
      return {
        dg: {
          loginType: "A", //登录类型
          language: "",
          isMobile: false //设备类型
        },
        langs: {} //多语言选择
      };
    },
    created() {
      this.getCookie();
      this.getDevice();
      this.getConfig();
    },

    methods: {
      //Cookie信息
      getCookie() {
        this.dg.language = szdStoreCookie.getLanguage();
        if (!this.dg.language) this.dg.language = "zh-CN";
      },
      //设备类型
      getDevice() {
        this.dg.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(navigator.userAgent);
      },
      //登录配置
      getConfig() {
        getLoginConfig().then(res => {
          if (res.data.langs) this.langs = res.data.langs;
          //下载svg图标库
          this.downloadSvg(res.data.svgMd5);
        });
      },
      //设置Cookie登录语言
      handleChangeLanguage() {
        szdStoreCookie.setLanguage(this.dg.language);
      },
      //下载svg图标库
      downloadSvg(svgMd5) {
        if (szdStoreLocal.getSvgMd5(svgMd5) || !szdStoreLocal.getSvg()) {
          getSvg().then(res => {
            szdStoreLocal.setSvg(res);
            szdStoreLocal.setSvgMd5(svgMd5);
          });
        }
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .g-logBg {
    //新版登录须打开一下一条样式
    background: url("../../client/assets/image/loginBg.jpg") no-repeat;
    background-size: 100% 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    overflow: auto;
    min-width: 500px;
  }

  .login-top {
    padding: 40px 100px 20px 30px;
    max-width: 1920px;
    margin: 0 auto;
    width: 100%;
    height: 110px;
    min-width: 500px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .u-pos {
    position: absolute;
    width: 1920px;
    text-align: right;
    left: 50%;
    transform: translate(-50%, 0);
    padding-right: 100px;
  }

  .login-main {
    display: flex;
    max-width: 1920px;
    margin: 0 auto;
    width: 100%;
    min-width: 500px;
    overflow: auto;
    height: 600px;
    justify-content: flex-end;
    padding: 5px 100px 100px 30px;
    background: url("../../client/assets/image/loginImg.png") no-repeat 100px top;
    //新版登录须注释一下一条样式
    //background-size: cover;
    &.flexCenter {
      padding: 0 30px;
      justify-content: center;
    }

    .login-wrapper {
      position: relative;

      width: 450px;
      height: 400px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 20px 25px 50px 25px;
      background: #ffffff;
      border-radius: 5px;

      .login-content {
        flex-grow: 1;
      }

      .other-login {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 50px;
        align-items: center;
        border-top: 1px solid #eee;
        display: flex;
        padding: 0 30px;
        cursor: pointer;

        .icon-wrapper {
          margin-left: 20px;
          font-size: 30px;

          &.phone {
            font-size: 28px;
          }

          &.pc {
            font-size: 28px;
          }
        }

        .label {
          font-size: 14px;
          color: #666;
        }

        .svg-icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .login-main-title {
    text-align: center;
    color: #707070;
  }

  .el-login-footer {
    position: relative;
    height: 100px;
    line-height: 100px;
    width: 100%;

    .footer-text {
      display: flex;
      text-align: center;
      justify-content: center;
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      bottom: 20px;
      color: #666666;
      letter-spacing: 0.5px;
    }
  }

  .u-logo {
    position: fixed;
    left: 60px;
    top: 40px;
  }
</style>
