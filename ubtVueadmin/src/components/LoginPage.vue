<template>
  <div class="login">
    <div class="login-box">
      <div class="logo">
        <img src="../static/images/loading2.gif" />
      </div>
      <div class="body">
        <p class="tips">二手书后台管理</p>
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item label="" prop="username">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="startLogin" :loading="loading" style="width: 100%">
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/config/api'

export default {
  data() {
    return {
      root: '',
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, message: '密码不得低于4个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  components: {},
  methods: {
    startLogin() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false
        }
        this.loading = true
        // let root = this.root
        this.axios
          .post('/login/adminLogin', {
            admin_account: this.form.username,
            admin_password: this.form.password
          })
          .then(res => {
            let call = res.data
            console.log(call)
            this.loading = false
            if (call.code == 1) {
              localStorage.setItem('token', call.token)
              localStorage.setItem('userInfo', JSON.stringify(call.data))
              this.$router.push({ name: 'welcome' })
            } else {
              this.$message({
                type: 'error',
                message: call.errmsg
              })
              return false
            }
          })
          .catch(err => {
            this.loading = false
          })
      })
    }
  },
  mounted() {
    this.root = api.rootUrl
  }
}
</script>
<style>
.login {
  height: 100vh;
  width: 100vw;
  /* background: url('http://cdn.jzzz66.cn/shopadmin.jpg'); */
  /* 以上为登录背景,可以自己更换成自己喜欢的 */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  font-family: Lato, Helvetica, sans-serif;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #656565;
  position: relative;
}

.login-box {
  width: 320px;
  background: #ffffff7a;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  box-shadow: 2px 2px 12px #ccc;
}

.login-box .logo {
  height: 100px;
  padding-top: 30px;
  /*background: #324157;*/
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box .logo img {
  width: 80px;
  height: 80px;
}

.login-box .body {
  padding: 10px 30px 30px 30px;
}

.login-box .body .tips {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-bottom: 30px;
}

.login-box .body .author {
  display: block;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #656565;
  margin-bottom: 10px;
  text-decoration: none;
}

.login-box .body .author a {
  text-decoration: none;
}
</style>
