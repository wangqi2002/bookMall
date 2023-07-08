<template>
  <div class="setAccount">
    <!-- 基本信息展示 -->
    <div class="header">
      <div class="account_info">
        <div class="avatar" :style="styleVar"></div>
        <div class="info">
          <p>账户昵称:</p>
          <p class="name" ref="name">{{ $store.state.userInfo.user_nickname }}</p>
        </div>
      </div>
      <div class="address">
        <p>我的收货地址:</p>
        <p class="address_item">
          {{
            $store.state.userInfo.user_loacation
            ? $store.state.userInfo.user_loacation
            : address
          }}
        </p>
      </div>
    </div>
    <!-- 修改信息 -->
    <div class="classify_item">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="昵称:" prop="name">
          <el-input type="text" v-model="ruleForm.name" autocomplete="off" :disabled="inputBol"></el-input>
        </el-form-item>
        <!-- <el-form-item label="QQ号:" prop="qq">
          <el-input
            type="text"
            v-model="ruleForm.qq"
            autocomplete="off"
            :disabled="inputBol"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="收货地址:" prop="address">
          <el-input type="text" v-model="ruleForm.address" autocomplete="off" :disabled="inputBol"></el-input>
        </el-form-item>
        <el-form-item label="头像:" prop="pass">
          <el-upload class="avatar-uploader" action="/node/user/avater" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :disabled="inputBol">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inputBol = !inputBol">编辑资料</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 昵称验证规则
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("昵称不能为空"));
      } else {
        callback();
      }
    };
    // QQ号验证规则
    var validateQQ = (rule, value, callback) => {
      let reg = /^[1-9]\d{4,9}$/;
      if (value === "") {
        callback(new Error("请输入QQ号"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确的QQ号"));
      } else {
        callback();
      }
    };
    // 收货地址验证规则
    var validateAddress = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入收货地址"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      nowImg: "",
      address: "您还没有添加收货地址哦！",
      inputBol: true,
      imageUrl: "",
      ruleForm: {
        name: "",
        qq: "",
        address: "",
      },
      // 表单验证规则
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        qq: [{ validator: validateQQ, trigger: "blur" }],
        address: [{ validator: validateAddress, trigger: "blur" }],
      },
    };
  },
  computed: {
    styleVar() {
      return {
        "--avatar": this.nowImg
          ? `url(/node${this.nowImg})`
          : `url(/node${this.$store.state.userInfo.user_image})`,
      };
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  watch: {
    userInfo: {
      deep: true,
      handler(newValue, oldvalue) {
        console.log(newValue, oldvalue);
        let info = {
          name: newValue.user_nickname,
          qq: newValue.qqaccount,
          address: newValue.user_loacation,
        };
        let ruleForm = JSON.parse(JSON.stringify(info));
        this.ruleForm = ruleForm;
        this.imageUrl = newValue.user_image;
      },
    },
  },
  methods: {
    handleAvatarSuccess(obj, res, file) {
      this.imageUrl = "/images/userImg/" + res.response.data.filename;
    },
    // 封面图片上传前个钩子函数
    beforeAvatarUpload(file) {
      console.log(file.type);
      const isJPG = file.type === ("image/webp" || "image/jpg" || "image/png");
      console.log(isJPG);
      const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 WEBP 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      return true;
    },
    // 处理用户修改资料
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log("成功");
          let { data } = await this.$axios.post("/node/user/updateInfo", {
            user_nickname: this.ruleForm.name,
            user_loacation: this.ruleForm.address,
            user_image: this.imageUrl,
            user_id: this.$store.state.userInfo.user_id,
          });
          this.$refs.name.innerHTML = this.ruleForm.name;
          this.inputBol = true;
          let userData = this.$store.state.userInfo;
          userData.user_image = this.imageUrl;
          this.$store.dispatch("changeuserinfo", userData)
          this.nowImg = this.imageUrl;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    let userInfo = this.$store.state.userInfo;
    if (userInfo.user_loacation) {
      let info = {
        name: userInfo.user_nickname,
        qq: userInfo.qqaccount,
        address: userInfo.user_loacation,
      };
      let ruleForm = JSON.parse(JSON.stringify(info));
      this.ruleForm = ruleForm;
      this.imageUrl = userInfo.user_image;
    }
  },
};
</script>

<style lang="less" scoped>
.setAccount {
  width: 100%;
  max-height: calc(100vh - 90px);
  padding: 40px 0;
  box-sizing: border-box;

  .header {
    max-width: 700px;
    height: 120px;
    border: 1px solid black;
    box-sizing: border-box;
    padding: 0 30px;
    margin: 0 auto 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .account_info {
      width: 180px;
      height: 18px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: var(--avatar) no-repeat center/cover;
        border: 1px solid black;
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .name {
          color: red;
        }
      }
    }

    .address {
      width: 150px;

      .address_item {
        font-size: 13px;
        color: red;
        margin-top: 5px;
      }
    }
  }
}

.classify_item {
  max-width: 700px;
  margin: 0 auto;
  overflow: hidden;

  .avatar {
    width: 100px;
  }

  /deep/ .el-input {
    max-width: 80% !important;
  }

  // /deep/ .el-input__inner{
  //   border: none;
  // }
  /deep/ .el-input__suffix {
    display: none;
  }

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
  }
}
</style>