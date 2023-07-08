<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item :to="{ name: 'admin' }">管理员</el-breadcrumb-item>
        <el-breadcrumb-item>添加管理员</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
      </div>
    </div>
    <div class="content-main">
      <div class="form-table-box">
        <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
          <el-form-item label="管理员账号" prop="account">
            <el-input v-model="infoForm.account"></el-input>
          </el-form-item>
          <el-form-item label="管理员姓名" prop="username">
            <el-input v-model="infoForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="infoForm.password"></el-input>
          </el-form-item>
          <el-form-item label="管理员级别" prop="permission">
            <el-input v-model="infoForm.permission"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addAdminInfo">确定添加</el-button>
            <el-button @click="goBackPage">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      change: false,
      infoForm: {
        account: '',
        username: '',
        password: '',
        permission: ''
      },
      infoRules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入级别', trigger: 'blur' }]
      }
    }
  },
  methods: {
    goBackPage() {
      this.$router.go(-1)
    },
    addAdminInfo() {
      let user = this.infoForm
      //   console.log(user)
      let password = user.password
      if (password == undefined) {
        user.password = ''
      }
      if (password != undefined && password.replace(/(^\s*)|(\s*$)/g, '').length < 4) {
        this.$message({
          type: 'error',
          message: '密码请大于4个字符'
        })
        return false
      }
      this.$refs['infoForm'].validate(valid => {
        if (valid) {
          this.axios
            .post('/admin/addAdmin', {
              user: user
            })
            .then(response => {
              console.log(response.data)
              if (response.data.code === 1) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.$router.push({ name: 'admin' })
              } else {
                this.$message({
                  type: 'error',
                  message: '添加失败(' + response.data.value + ')'
                })
              }
            })
        } else {
          return false
        }
      })
    }
  },
  components: {},
  mounted() {}
}
</script>

<style>
.image-uploader {
  height: 105px;
}

.image-uploader .el-upload {
  border: 1px solid #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.image-uploader .image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 187px;
  height: 105px;
  line-height: 105px;
  text-align: center;
}

.image-uploader .image-show {
  width: 187px;
  height: 105px;
  display: block;
}

.image-uploader.new-image-uploader {
  font-size: 28px;
  color: #8c939d;
  width: 165px;
  height: 105px;
  line-height: 105px;
  text-align: center;
}

.image-uploader.new-image-uploader .image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 165px;
  height: 105px;
  line-height: 105px;
  text-align: center;
}

.image-uploader.new-image-uploader .image-show {
  width: 165px;
  height: 105px;
  display: block;
}
</style>
