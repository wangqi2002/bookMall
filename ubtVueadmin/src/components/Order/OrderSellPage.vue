<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="first"></el-tab-pane>
        <el-tab-pane label="待收" name="second"></el-tab-pane>
        <el-tab-pane label="已收" name="third"></el-tab-pane>
        <el-tab-pane label="已完成" name="fourth"></el-tab-pane>
        <el-tab-pane label="缺书" name="fifth"></el-tab-pane>
      </el-tabs>
      <div class="filter-box">
        <el-form :inline="true" v-model="filterForm" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input class="filter-input" v-model="filterForm.order_sn" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="出书人">
            <el-input class="filter-input" v-model="filterForm.consignee" placeholder="请输入出书人"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitFilter">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-table-box">
        <el-checkbox-group>
          <div v-for="item in tableData" :key="item.index" class="list-wrap clearfix">
            <div class="header clearfix">
              <div class="left">
                <div class="status-text">{{ item.sellerorder_status }}</div>
                <div class="add-time">上传时间：{{ item.sellerorder_date }}</div>
                <div class="order-id">订单号：{{ item.sellerorder_id }}</div>
              </div>
              <div class="right">
                <div class="price-wrap">上传价格：{{ item.bookA_price }}元</div>
              </div>
            </div>
            <div class="content-wrap clearfix">
              <div class="left">
                <div class="goods-list">
                  <img :src="'https://serve.sirbook.top' + item.book_cover" class="goods-img" />
                  <div class="goods-name">{{ item.book_name }}</div>
                  <div class="goods-number"><label>数量：</label>1</div>
                </div>
              </div>
              <div class="user-wrap">
                <div class="avatar-wrap">
                  <img :src="'https://serve.sirbook.top' + item.user_image" class="avatar-img" />
                  <div class="nickname">{{ item.user_nickname }}</div>
                </div>
                <div class="mobile">手机：{{ item.user_telphone }}</div>
              </div>
              <div class="main">
                <div class="m1">
                  <div class="user-name">收书人</div>
                  <div class="user-mobile">收书人手机号</div>
                </div>
                <div class="user-address">卖家地址</div>
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div class="page-box">
        <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="6"
          layout="total, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import VueBarcode from '../../../node_modules/vue-barcode'
import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'

export default {
  data() {
    return {
      page: 1,
      total: 0,
      filterForm: {
        order_sn: '',
        consignee: '',
        name: ''
      },
      tableData: [],
      activeName: 'second',
      order_status: 0,
      order_sn: 0,
      order_id: 0
    }
  },
  methods: {
    handleClick(tab, event) {
      this.page = 1
      let pindex = tab._data.index
      if (pindex == 0) {
        this.order_status = '0,1,2,3'
      } else if (pindex == 1) {
        this.order_status = 0
      } else if (pindex == 2) {
        this.order_status = 1
      } else if (pindex == 3) {
        this.order_status = 2
      } else if (pindex == 4) {
        this.order_status = 3
      }
      this.getList()
    },

    handlePageChange(val) {
      this.page = val
      //保存到localStorage
      localStorage.setItem('orderSellPage', this.page)
      localStorage.setItem('orderSellFilterForm', JSON.stringify(this.filterForm))
      this.getList()
    },
    onSubmitFilter() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.axios
        .get('/sellerorder/status_page', {
          params: {
            orderSn: this.filterForm.order_sn,
            consignee: this.filterForm.consignee,
            page: this.page,
            status: this.order_status
          }
        })
        .then(response => {
          console.log(response.data.results)
          this.tableData = response.data.results.orderData
          console.log(this.tableData)
          this.page = parseInt(response.data.results.page)
          this.total = response.data.results.count
        })
    },
  },
  components: { ElButton, barcode: VueBarcode },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped>
.filter-input {
  width: 200px !important;
}

.float-right {
  float: right;
}

.d-btn {
  margin-bottom: 10px;
}

.btn-beihuo {
  margin-bottom: 22px;
}

.btn-fahuo {
  margin-bottom: 22px;
  margin-left: 30px;
}

.box-check {
  float: left;
}

.filter-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.filter-box .box {
  margin-right: 20px;
  margin-bottom: 10px;
}

.demo-form-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-wrap {
  width: 100%;
  border: 1px solid #dfe5ed;
  margin-bottom: 10px;
}

.goods-img {
  width: 40px;
  height: 40px;
}

.list-wrap .header {
  width: 100%;
  height: 40px;
  background-color: rgba(236, 245, 255, 0.51);
  line-height: 40px;
  color: #1f2d3d;
  font-size: 13px;
  padding: 0 10px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header .left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.header .right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.status-text {
  color: #f0797f;
  margin-right: 10px;
}

.add-time {
  margin-right: 20px;
}

.pay-time {
  margin-right: 20px;
}


.price-wrap {
  float: right;
  margin-right: 20px;
}

.content-wrap {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.content-wrap .left {
  width: 30%;
  border-right: 1px solid #d1dbe5;
  padding: 20px 10px;
}

.content-wrap .user-wrap {
  width: 16%;
  border-right: 1px solid #d1dbe5;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
}

.content-wrap .user-wrap .avatar-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}

.content-wrap .user-wrap .avatar-wrap .avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 100px;
  margin-right: 10px;
}

.content-wrap .user-wrap .avatar-wrap .nickname {
  font-size: 14px;
}

.content-wrap .user-wrap .name {
  width: 100%;
  font-size: 14px;
}

.content-wrap .user-wrap .mobile {
  width: 100%;
  font-size: 14px;
}

.content-wrap .main {
  width: 36%;
  border-right: 1px solid #d1dbe5;
  padding: 20px 10px;
}

.content-wrap .right {
  width: 12%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.right .right-detail {
  margin-left: 0;
  margin-top: 6px;
}

.goods-list {
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #f1f1f1;
  padding: 6px 0;
  align-items: center;
}

.goods-list:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.goods-list:first-child {
  padding-top: 0;
}

.goods-name {
  color: #5e7382;
  font-size: 14px;
  margin: 0 20px 0 10px;
  width: 180px;
}

.goods-spec {
  color: #0066cc;
  font-size: 14px;
  margin-right: 30px;
  width: 60px;
}

.goods-number {
  color: #ff3456;
  font-size: 14px;
  margin-right: 20px;
}

.goods-number label {
  color: #666;
}

.goods-price {
  color: #333;
  font-size: 14px;
  margin-right: 20px;
}

.m1 {
  display: flex;
  justify-content: flex-start;
}

.user-name {
  color: #000000;
  font-size: 14px;
  margin-right: 10px;
  line-height: 20px;
}

.user-mobile {
  color: #000000;
  font-size: 14px;
  line-height: 20px;
  margin-right: 20px;
}

.user-address {
  color: #333;
  font-size: 13px;
  line-height: 20px;
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
}

.el-input {
  width: 300px;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>
