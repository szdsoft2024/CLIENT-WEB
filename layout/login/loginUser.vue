<template>
  <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-main-form">
    <el-form-item prop="userId">
      <el-input v-model="loginForm.userId" text auto-complete="off" placeholder="账号">
        <template #prefix>
          <szd-svg name="user" fixed class="el-input__icon input-icon" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码">
        <template #prefix>
          <szd-svg name="password" fixed class="el-input__icon input-icon" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%">
        <template #prefix>
          <szd-svg name="validCode" fixed class="el-input__icon input-icon" />
        </template>
      </el-input>
      <div class="login-code">
        <img :src="dg.codeUrl" @click="getCode" />
      </div>
    </el-form-item>
    <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 0">记住密码</el-checkbox>
    <el-form-item style="width: 100%">
      <el-button
        :loading="dg.loading"
        size="default"
        type="primary"
        style="width: 100%; height: 36px"
        @click="handleLogin"
        @keydown.enter="keyDown(e)">
        <span v-if="!dg.loading">登 录</span>
        <span v-else>登 录 中...</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { getCodeImg, login } from "../../client/common/api/login";
  import Cookies from "js-cookie";
  import { encrypt, decrypt } from "./jsencrypt.js";
  import szdStoreSession from "../../client/common/store/storeSession";
  import storeCookie from "../../client/common/store/storeCookie";

  export default {
    data() {
      return {
        dg: {
          loading: false, //加载中
          codeUrl: "", //验证码地址
          loginType: "1"
        },
        loginForm: {
          userId: "",
          password: "",
          rememberMe: false,
          code: "",
          uuid: ""
        },
        loginRules: {
          userId: [{ required: true, trigger: "blur", message: "用户名不能为空" }],
          password: [{ required: true, trigger: "blur", message: "密码不能为空" }],
          code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
        }
      };
    },
    mounted() {
      window.addEventListener("keydown", this.keyDown); //绑定监听事件
    },
    destroyed() {
      window.removeEventListener("keydown", this.keyDown, false); //销毁事件
    },
    created() {
      this.getCode();
      this.getCookie();
    },
    methods: {
      initData(type) {
        this.dg.loginType = type;
      },
      keyDown(e) {
        if (e.keyCode == 13 || e.keyCode == 100) {
          this.handleLogin();
        }
      },
      //验证码地址
      getCode() {
        getCodeImg().then(res => {
          this.dg.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        });
      },
      //获取Cookie信息
      getCookie() {
        const userId = Cookies.get("userId");
        const password = Cookies.get("password");
        const rememberMe = Cookies.get("rememberMe");
        this.loginForm = {
          userId: userId === undefined ? this.loginForm.userId : userId,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        };
      },
      //登录系统
      handleLogin() {
        if (this.dg.loginType !== "1") return;
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.dg.loading = true;
            //设置cookie
            this.setCookie();
            //系统登录
            login(this.loginForm).then(res => {
              if (res.code === 200) {
                szdStoreSession.removeCoreLogin();
                storeCookie.setToken(res.token); //给token赋值
                location.reload(); //重新加载当前页面
              } else {
                this.getCode();
              }
              this.dg.loading = false;
            });
          }
        });
      },
      //设置cookie
      setCookie() {
        if (this.loginForm.rememberMe) {
          Cookies.set("userId", this.loginForm.userId, { expires: 30 });
          Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
          Cookies.set("rememberMe", this.loginForm.rememberMe, { expires: 30 });
        } else {
          Cookies.remove("userId");
          Cookies.remove("password");
          Cookies.remove("rememberMe");
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .login-main-form {
    border-radius: 5px;
    background: #ffffff;
    width: 400px;
    min-width: 340px;

    .el-input {
      height: 36px;
      line-height: 36px;
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }

  .login-code {
    width: 33%;
    height: 38px;
    float: right;
    text-align: right;

    .img {
      cursor: pointer;
      vertical-align: middle;
    }
  }
</style>
