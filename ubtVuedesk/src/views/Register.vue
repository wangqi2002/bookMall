<template>
  <div class="register">
    <div class="register_item">
      <h2>注册</h2>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="手机号码" prop="tele">
          <el-input type="text" v-model="ruleForm.tele" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="svg" class="svg">
          <el-input type="text" v-model="ruleForm.svg" autocomplete="off" class="svg_item"></el-input>
          <div class="getSvg" @click="handerSvg">获取验证码</div>
        </el-form-item>
        <p class="tip" @click="handerLogin">已有账号?立即登录</p>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 电话号码验证规则
    var validateTele = (rule, value, callback) => {
      let reg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else if (!reg.test(value)) {
        callback(new Error("请正确填写您的手机号"));
      } else {
        callback();
      }
    };
    // 密码验证规则
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
      } else if (this.text != value) {
        callback(new Error("验证码输入错误"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      ruleForm: {
        tele: "",
        pass: "",
        svg: "",
        text: "",
      },
      // 表单验证规则
      rules: {
        tele: [{ validator: validateTele, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        svg: [{ validator: validateSvg, trigger: "blur" }],
      },
    };
  },
  methods: {
    // 处理用户注册
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(async (valid) => {
        // console.log(valid);
        if (valid) {
          let { data } = await this.$axios.post("/node/user", {
            user_login_account: this.ruleForm.account,
            user_login_password: this.ruleForm.pass,
            user_telphone: this.ruleForm.tele,
          });
          this.$refs[formName].resetFields();
          if (!data.code) {
            return this.$message.error(data.value);
          }
          this.$message.success(data.value);
          setTimeout(function () {
            that.$router.push({ name: "login" });
          }, 1500);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取短信验证码
    async handerSvg() {
      if (!this.ruleForm.tele) {
        return this.$message.error("请输入手机号");
      }
      let { data } = await this.$axios.post("/node/user/getSvg", {
        user_telphone: this.ruleForm.tele,
      });
      this.text = data;
      // this.text = data.sms;
      console.log(data);
    },
    // 已有账号，立即登录
    handerLogin() {
      this.$router.push({ name: "login" });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.register {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: url("../assets/imgs/book_register.jpg") no-repeat center/cover;

  .register_item {
    position: relative;
    background: #fff;
    width: 400px;
    height: 400px;
    padding-top: 20px;
    box-sizing: border-box;
    margin: 100px auto;
    box-shadow: 0px 0px 10px #b0b0b0;

    .tip {
      position: absolute;
      bottom: 21%;
      right: 15%;
      color: red;
      font-size: 12px;
      cursor: pointer;
    }

    /deep/ .el-button {
      width: 100%;
      margin-top: 10px;
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
    }

    /deep/ .el-form-item__content {
      display: flex;
      width: 60%;
    }

    /deep/ .el-input__suffix {
      display: none;
    }

    .svg {
      .getSvg {
        width: 150px;
        margin-left: 20px;
        color: #409eff;
        border: 1px solid #409eff;
        background: #fff;
        text-align: center;
        cursor: pointer;
      }

      .svg_item {
        width: 50% !important;
      }
    }
  }
}
</style>
