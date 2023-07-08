<template>
  <!-- 下单页 -->
  <div class="order">
    <!-- 下单详情 -->
    <div class="order_wrap">
      <h3>订单</h3>
      <div class="order_wrap_center">
        <!-- 支付方式 -->
        <div class="paymentMethod">
          <p>支付方式</p>
          <!-- 模拟下拉列表 -->
          <div id="select_time">
            {{ selectValue }}
            <i class="el-icon-arrow-down" @click="handleDis"></i>
            <ul class="select_list" ref="select_list">
              <li class="active" @click="handleClickOption">微信支付</li>
              <!-- <li @click="handleClickOption">支付宝支付</li>
              <li @click="handleClickOption">银行卡支付</li> -->
            </ul>
          </div>
        </div>
        <!-- 收货地址 -->
        <div class="address">
          <p>收货地址</p>
          <input type="text" v-model="addressTrue" placeholder="填写位置" />
        </div>
        <!-- 图书信息 -->
        <div class="book_wrap">
          <div class="cover">
            <img :src="$store.state.imgUrl + book_detail.book_cover" alt="" />
          </div>
          <div class="book_content">
            <p>
              书名: <span>{{ book_detail.book_name }}</span>
            </p>
            <p>
              价格: <span>{{ book_detail.bookA_price }}</span>
            </p>
          </div>
        </div>
        <!-- 付款按钮 -->
        <button class="payment" @click="handlePlOrder()">付款</button>
        <!-- 分享展示, 预览的二维码的弹层  -->
        <el-dialog title="微信支付二维码 (1分钟内未支付订单取消)" :visible="showCodeDialog" @close="handleClose()">
          <el-row type="flex" justify="center">
            <div id="qrcode" ref="qrcode"></div>
          </el-row>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "Order",
  components: { QRCode },
  data() {
    return {
      showCodeDialog: false,
      addressTrue: this.$store.state.userInfo.user_loacation,
      book_detail: {},
      selectValue: "微信支付",
      orderId: null,
      tradeState: null
    };
  },
  methods: {
    handleDis() {
      this.display = !this.display;
      if (this.display) {
        this.$refs.select_list.style.display = "block";
      } else {
        this.$refs.select_list.style.display = "none";
      }
    },
    handleClickOption(e) {
      this.selectValue = e.target.innerText;
      let list = this.$refs.select_list.children;
      for (let i = 0; i < list.length; i++) {
        list[i].classList.remove("active");
      }
      e.target.classList.add("active");
      this.display = false;
      this.$refs.select_list.style.display = "none";
    },
    handleClose() {
      this.showCodeDialog = false
    },
    qrcode(url) {
      this.$refs.qrcode.innerHTML = "";
      let qrcode = new QRCode("qrcode", {
        width: 232, // 设置宽度
        height: 232, // 设置高度
        text: url,
      });
    },
    handlePayback(callback) {
      const _this = this
      const nowTime = new Date()
      let trade_state = null
      const intervalId = setInterval(async function () {
        let newTime = new Date()
        if (newTime - nowTime > 60000) {
          _this.handleClose()
          trade_state = 'NOTPAY'
        }
        if (!_this.showCodeDialog) {
          clearInterval(intervalId);
          callback({ trade_state: trade_state })
        }
        await _this.$axios
          .post("/node/payBack", {
            orderId: _this.orderId
          })
          .then((res) => {
            if (res.data.value.trade_state === 'SUCCESS') {
              trade_state = 'SUCCESS'
              _this.handleClose()
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 3000);
    },
    async handlePlOrder() {
      this.showCodeDialog = true;
      const _this = this
      await this.$axios
        .post("/node/payPc", {
          description: _this.book_detail.book_name,
          total: _this.book_detail.bookA_price,
        })
        .then((res) => {
          this.orderId = res.data.orderId
          this.$nextTick(() => {
            let url = res.data.value.code_url;
            this.qrcode(url);
          });
          this.handlePayback(async (result) => {
            console.log("order.vue", result)
            if (result.trade_state == "SUCCESS") {
              await _this.$axios
                .post(`/node/buyerorder`, {
                  buyerorder_id: _this.orderId,
                  buyerorder_buyerid: _this.$store.state.userInfo.user_id,
                  buyerorder_bookid: _this.book_detail.bookA_id,
                  buyerorder_sellerid: _this.book_detail.bookA_stand,
                  buyerorder_address: _this.addressTrue,
                  buyerorder_price: _this.book_detail.bookA_price
                })
                .then((res) => {
                  console.log(res, "buyerorder");
                })
                .catch((err) => {
                  console.log(err);
                });
              await _this.$axios
                .put(`/node/bookabout/state/${_this.book_detail.bookA_id}`, {
                  bookA_state: 3,
                })
                .then((res) => {
                  console.log(res, "bookabout");
                })
                .catch((err) => {
                  console.log(err);
                });
              await _this.$axios
                .post("/node/record", {
                  r_userId: _this.$store.state.userInfo.user_id,
                  r_url: 4,
                  r_result: 1,
                })
                .then((res) => {
                  console.log(res, "record");
                })
                .catch((err) => {
                  console.log(err);
                });
              this.$message.success("支付成功");
              this.$router.push({ path: "/" });
            } else if (result.trade_state == "NOTPAY") {
              this.$message.error("订单取消");
            }
          })
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {},
  mounted() {
    this.book_detail = JSON.parse(this.$route.query.book_detail);
    // console.log("order.vue", this.book_detail);
  },
};
</script>
<style lang="less" scoped>
.order {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;

  .order_wrap {
    max-width: 700px;
    height: calc(100vh - 100px);
    margin: 20px auto 60px;
    border: 1px solid #333;
    box-shadow: 0 0 10px #eee;
    display: flex;
    flex-direction: column;

    h3 {
      line-height: 40px;
      background: rgb(189, 235, 177);
      text-align: center;
    }

    .order_wrap_center {
      flex-grow: 1;
      width: 100%;
      padding: 0 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      // 支付方式
      .paymentMethod {
        width: 100%;
        height: 50px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #333;
      }

      // 收货地址
      .address {
        height: 110px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        box-sizing: border-box;
        border: 1px solid #333;
        font-size: 14px;

        input {
          border: 1px solid #333;
          height: 25px;
          padding: 0 4px;
          box-sizing: border-box;
          margin-top: 20px;

          &:focus {
            border: 1px solid blue;
          }
        }
      }

      // 图书信息
      .book_wrap {
        height: 150px;
        border-radius: 10px;
        display: flex;
        justify-content: space-around;
        border: 1px solid #333;
        align-items: center;

        .cover {
          width: 100px;
          height: 100px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        p {
          margin-bottom: 10px;
        }

        span {
          margin-left: 10px;
        }
      }

      // 付款按钮
      .payment {
        width: 150px;
        height: 30px;
        background: rgb(189, 235, 177);
        margin: 0 auto;
      }
    }
  }

  // 模拟下拉列表
  #select_time {
    position: relative;
    height: 20px;
    line-height: 20px;
    outline: none;
    width: 100px;
    font-size: 12px;
    padding: 0 4px;
    border: 1px solid #333;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;

    i {
      cursor: pointer;
    }

    .select_list {
      position: absolute;
      top: calc(100% + 3px);
      left: -1px;
      width: 100px;
      background: #fff;
      box-shadow: 0 0 3px #b0b0b0;
      display: none;

      li {
        width: 100px;
        height: 20px;
        cursor: pointer;
        border-top: none;
        line-height: 20px;
        padding: 0 4px;
        box-sizing: border-box;
        font-size: 12px;
      }

      .active {
        background: rgb(226, 226, 226);
      }
    }
  }
}
</style>