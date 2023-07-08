<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <div style="margin-left: 10px"></div>
      </div>
    </div>
    <div class="content-main">
      <div class="filter-box">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
          <el-form-item label="用户昵称">
            <el-input v-model="filterForm.nickname" placeholder="用户昵称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitFilter">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-table-box" v-if="fake == 0">
        <el-table :data="tableData" style="width: 100%" border stripe>
          <el-table-column prop="user_id" label="ID" width="60"> </el-table-column>
          <el-table-column label="头像" width="80">
            <template slot-scope="scope">
              <img :src="'https://serve.sirbook.top' + scope.row.user_image" alt="" style="width: 50px; height: 50px" />
            </template>
          </el-table-column>
          <el-table-column prop="user_nickname" label="昵称"></el-table-column>
          <el-table-column prop="user_telphone" label="手机号"></el-table-column>
          <el-table-column prop="user_registration_time" label="注册时间" width="180"> </el-table-column>
          <el-table-column prop="user_loacation" label="注册时间" width="180"> </el-table-column>
        </el-table>
      </div>
      <div class="page-box" v-if="fake == 0">
        <el-pagination background @current-change="handlePageChange" :current-page.sync="page" :page-size="6"
          layout="total, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      total: 0,
      filterForm: {
        nickname: ''
      },
      tableData: [],
      fake: 0,
      loginInfo: null,
      username: ''
    }
  },
  methods: {
    fakeShow() {
      this.fake = 1
    },
    realShow() {
      this.fake = 0
    },
    handlePageChange(val) {
      this.page = val
      //保存到localStorage
      localStorage.setItem('userPage', this.page)
      this.getList()
    },
    onSubmitFilter() {
      this.findUser()
    },
    getList() {
      // console.log(this.page)
      this.axios
        .get('user', {
          params: {
            page: this.page
          }
        })
        .then(response => {
          console.log(response.data)
          this.tableData = response.data.userData
          this.page = response.data.page
          this.total = response.data.count
        })
      if (!this.loginInfo) {
        this.loginInfo = JSON.parse(window.localStorage.getItem('userInfo') || null)
        this.username = this.loginInfo.admin_name
      }
    },
    findUser() {
      console.log(this.filterForm.nickname)
      this.axios
        .get('user/find', {
          params: {
            nickname: this.filterForm.nickname
          }
        })
        .then(response => {
          console.log(response)
          this.tableData = response.data.userData
          this.page = response.data.page
          this.total = response.data.count
        })
    }
  },
  components: {},
  mounted() {
    let thePage = localStorage.getItem('userPage')
    if (thePage == null) {
      thePage = 1
    }
    this.page = Number(thePage)
    // console.log(this.page)
    this.getList()
  }
}
</script>

<style scoped></style>
