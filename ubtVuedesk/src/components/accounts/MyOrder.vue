<template>
  <div class="myOrder">
    <div class="myOrder_wrap">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">
          <li v-for="(item, index) of orderListCopy" :key="index">
            <OrderItem v-if="isShow == 'first'" :message="item" />
          </li>
        </el-tab-pane>
        <el-tab-pane label="交易中" name="second">
          <li v-for="(item, index) of orderListCopy" :key="index">
            <OrderItem v-if="isShow == 'second'" :message="item" />
          </li>
        </el-tab-pane>
        <el-tab-pane label="交易完成" name="third">
          <li v-for="(item, index) of orderListCopy" :key="index">
            <OrderItem v-if="isShow == 'third'" :message="item" />
          </li>
        </el-tab-pane>
        <el-tab-pane label="已取消" name="fourth">
          <li v-for="(item, index) of orderListCopy" :key="index">
            <OrderItem v-if="isShow == 'fourth'" :message="item" />
          </li>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import OrderItem from "../OrderItem.vue";
export default {
  name: "MyOrder",
  components: { OrderItem },
  data() {
    return {
      activeName: "first",
      isShow: "first",
      orderList: [],
      orderListCopy: [],
    };
  },
  methods: {
    // 点击其他分类数据变化
    handleClick(tab) {
      if (tab.index == 0) {
        this.orderListCopy = this.orderList;
      } else if (tab.index == 1) {
        this.orderListCopy = this.orderList.filter(
          (item) => item.buyerorder_status == 0 || item.buyerorder_status == 1
        );
      } else {
        this.orderListCopy = this.orderList.filter(
          (item) => item.buyerorder_status == tab.index
        );
      }
      this.activeName = tab.name;
      this.isShow = tab.name;
    },
  },
  async mounted() {
    await this.$axios
      .get(`/node/buyerorder/buyer_id/${this.$store.state.userInfo.user_id}`)
      .then((res) => {
        // console.log(res.data.results);
        this.orderList = res.data.results;
        this.orderListCopy = this.orderList;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style lang="less" scoped>
.myOrder {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;

  .myOrder_wrap {
    max-width: 800px;
    margin: 20px auto;
  }
}
</style>
