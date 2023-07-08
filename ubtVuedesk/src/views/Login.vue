<template>
  <div class="login">
    <div class="login_wrap">
      <div class="login_img">
        <img src="@/assets/imgs/book_login.jpg" alt="" />
      </div>
      <div class="login_item">
        <div class="tabs" ref="tab">
          <p @click="handerTab" class="p1 active">密码登录</p>
          <p @click="handerTab" class="p2">短信登录</p>
        </div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
          v-if="tabBol">
          <el-form-item label="手机号" prop="user_telphone" class="el_input_book">
            <el-input type="text" v-model="ruleForm.user_telphone" autocomplete="off" placeholder="手机号码"
              class="input_place">
            </el-input>
            <img class="single_img" src="@/assets/imgs/login_user.png" alt="" />
          </el-form-item>
          <el-form-item label="密码" prop="user_login_password" class="el_input_book">
            <el-input type="password" v-model="ruleForm.user_login_password" autocomplete="off" placeholder="密码"
              class="input_place"></el-input>
            <img src="@/assets/imgs/login_pass.png" alt="" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormM('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
          v-else>
          <el-form-item label="手机号" prop="newTele" class="el_input_book">
            <el-input type="text" v-model="ruleForm.user_telphone" autocomplete="off" placeholder="请输入手机号码"
              class="input_place">
            </el-input>
            <img class="single_img" src="@/assets/imgs/login_user.png" alt="" />
          </el-form-item>
          <el-form-item label="验证码" prop="svg" class="svg">
            <el-input type="text" v-model="ruleForm.svg" autocomplete="off" placeholder="请输入验证码"
              class="svg_item"></el-input>
            <div class="getSvg" @click="handerSvg">获取验证码</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormS('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validateAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    // 验证码验证规则
    var validateSvg = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (this.ruleForm.text != value) {
        callback(new Error("验证码输入错误"));
      } else {
        callback();
      }
    };

    return {
      tabBol: true,
      ruleForm: {
        user_telphone: "",
        user_login_password: "",
        text: "",
        svg: "",
      },
      rulesT: {
        user_telphone: [
          {
            validator: validateAccount,
            trigger: "blur",
          },
        ],
      },
      rulesM: {
        user_telphone: [
          {
            validator: validateAccount,
            trigger: "blur",
          },
        ],
        user_login_password: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
      },
      rulesS: {
        user_telphone: [
          {
            validator: validateAccount,
            trigger: "blur",
          },
        ],
        svg: [
          {
            validator: validateSvg,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    rules: function () {
      let flag = 0;
      if (JSON.stringify(this.$refs) == "{}") {
        return this.rulesM;
      } else {
        let childTabs = this.$refs.tab.childNodes;
        for (let i = 0; i < childTabs.length; i++) {
          if (childTabs[i].getAttribute("class")) {
            if (childTabs[i].classList.length == 1) {
              flag = i;
            }
          }
        }
        switch (flag) {
          case 0:
            return this.rulesM;
          // break;
          case 1:
            return this.rulesS;
          // break;
          default:
            return this.rulesT;
        }
      }
    },
  },
  methods: {
    handerTab(e) {
      let childTabs = this.$refs.tab.childNodes;
      for (let i = 0; i < childTabs.length; i++) {
        if (childTabs[i].getAttribute("class")) {
          childTabs[i].classList.remove("active");
        }
      }
      this.tabBol = !this.tabBol;
      e.target.classList.add("active");
    },
    //获取短信验证码
    async handerSvg() {
      if (!this.ruleForm.user_telphone)
        return this.$message.error("请输入手机号");
      let { data } = await this.$axios.post("/node/user/getSvg", {
        user_telphone: this.ruleForm.user_telphone,
      });
      this.ruleForm.text = data;
      console.log("login", data);
    },
    // 处理登录
    submitFormM(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let { data } = await this.$axios.post("/node/login/userLogin", {
            user_telphone: this.ruleForm.user_telphone,
            user_login_password: this.ruleForm.user_login_password,
          });
          console.log("login", data);
          if (!data.code) return this.$message.error(data.value);
          this.$message.success(data.value);
          localStorage.setItem("token", data.token);
          this.$store.dispatch("changeuserinfo", data.data);
          this.$router.push({
            path: "/",
            params: {
              userInfo: data.data,
            },
          });
        } else {
          this.$message.error("输入的账号或密码有误！");
          return false;
        }
      });
    },
    submitFormS(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let { data } = await this.$axios.post("/node/login/userLoginS", {
            user_telphone: this.ruleForm.user_telphone,
          });
          console.log("login", data);
          if (!data.code) return this.$message.error(data.value);
          this.$message.success(data.value);
          localStorage.setItem("token", data.token);
          this.$store.dispatch("changeuserinfo", data.data);
          this.$router.push({
            path: "/",
            params: {
              userInfo: data.data,
            },
          });
        } else {
          this.$message.error("输入的账号或验证码有误！");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .login_wrap {
    width: 70%;
    height: 500px;
    margin: 100px auto;
    display: flex;
    box-shadow: 0px 0px 10px #b0b0b0;

    .login_img {
      width: 50%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .login_item {
      flex-grow: 1;
      padding: 30px;
      box-sizing: border-box;
      background: rgb(233, 233, 242);

      .tabs {
        width: 200px;
        margin: 20px auto;
        display: flex;
        font-size: 18px;
        font-weight: bold;

        p {
          padding-bottom: 5px;
          cursor: pointer;

          &:first-child {
            margin-left: -40px;
            margin-right: 20px;
          }
        }

        .active {
          border-bottom: 2px solid black;
        }
      }

      /deep/ .el-form-item__content {
        display: flex;
        width: 70%;
      }

      .el_input_book {
        position: relative;

        img {
          position: absolute;
          top: 14px;
          left: 8px;
          width: 20px;
        }

        .single_img {
          width: 50px;
          left: -5px;
          top: 10px;
        }
      }

      /deep/ .el-button {
        width: 100%;
        height: 50px;
        margin-top: 10px;
      }

      .svg {
        .getSvg {
          width: 120px;
          margin-left: 20px;
          color: #409eff;
          border: 1px solid #409eff;
          background: #fff;
          text-align: center;
          cursor: pointer;
        }

        .svg_item {
          width: 60% !important;
        }
      }

      /deep/ input::-webkit-input-placeholder {
        font-size: 18px;
      }

      /deep/ .el-form-item__label {
        display: none;
      }

      /deep/ .el-input__suffix {
        display: none;
      }

      /deep/ .el-input__inner {
        height: 50px;
        padding: 0 35px;

        &::placeholder {
          font-size: 16px;
        }
      }

      h2 {
        text-align: center;
        margin-bottom: 30px;
        font-size: 35px;
      }
    }
  }
}
</style>
