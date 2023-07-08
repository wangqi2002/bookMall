<template>
  <div class="orderItem">
    <div class="header">
      <p>{{ orderDetail.buyerorder_id }}</p>
      <p>{{ orderDetail.buyerorder_time }}</p>
    </div>
    <div class="center">
      <div class="center_left">
        <img :src="$store.state.imgUrl + booksDetail.book_cover" alt="" />
        <div class="book_info">
          <p>书名：{{ booksDetail.book_name }}</p>
          <p>作者：{{ booksDetail.book_author }}</p>
          <p>价格：{{ bookADetail.bookA_price }}</p>
        </div>
      </div>
      <div class="book_state">
        {{ handerInfo(orderDetail.buyerorder_trading_status) }}
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  name: "OrderItem",
  data() {
    return {
      orderDetail: {},
      bookADetail: {},
      booksDetail: {},
    };
  },
  props: {
    // message用于接收
    message: {
      type: Object, //验证类型，也可以验证其他类型
      default: "", //如果父组件传值，则用父组件的值渲染，反之使用默认值
    },
  },
  methods: {
    handerInfo(states) {
      switch (states) {
        case 0:
          return "待发货";
        case 1:
          return "运输中";
        case 2:
          return "已签收";
        case 3:
          return "拒收";
        default:
          break;
      }
    },
    async getbookDetial(isbn) {
      // console.log(isbn);
      let { data } = await this.$axios.get(`/node/book/getIsbn/${isbn}`);
      this.booksDetail = data.book;
    },
  },
  async mounted() {
    this.orderDetail = this.message;

    await this.$axios
      .get(`/node/bookabout/id/${this.message.buyerorder_bookid}`)
      .then(async (res) => {
        this.bookADetail = res.data.results[0];
        await this.getbookDetial(res.data.results[0].bookA_isbn);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style lang="less" scopd>
.orderItem {
  width: 90%;
  height: 150px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
  box-shadow: 0 0 10px #b0b0b0;

  .header {
    padding: 0 20px;
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #333;
  }

  .center {
    padding: 0 20px;
    box-sizing: border-box;
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .center_left {
      display: flex;

      img {
        width: 70px;
        height: 70px;
      }

      .book_info {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        p {
          font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
        }
      }
    }

    .book_state {
      font-weight: bold;
    }
  }
}
</style>
