<template>
  <div class="publishBook">
    <!-- 输入书本的ISBN -->
    <div class="isbn_wrap">
      <input class="isbn_input" placeholder="请输入书本的ISBN号码" v-model="isbn" />
      <img src="@/assets/imgs/select_isbn1.png" alt="" />
      <button type="primary" class="isbn_btn" @click="handerISBN">确认</button>
    </div>
    <transition appear name="animate__animated animate__bounce" enter-active-class="animate__bounceInDown"
      leave-active-class="animate__fadeOutDown">
      <div class="book_wrap" v-show="book_show">
        <!-- 书籍详情 -->
        <div class="book_item">
          <div class="book_img">
            <img :src="photoUrl" alt="" />
          </div>
          <div class="book_content">
            <h3>{{ book_content.book_name }}</h3>
            <div>
              <span class="author">{{ author1 }}</span>
              <span class="price">{{
                "￥" + book_content.book_publiction_price
              }}</span>
            </div>
            <div class="desc">{{ book_content.book_abstract }}</div>
          </div>
        </div>
        <!-- 卖书相关 -->
        <div class="sold_book">
          <!-- 设置价格 -->
          <div class="price">
            <span>价格（元）</span>
            <div class="setPrice">
              <button class="btn" @click="price--">-</button>
              <input class="btn" type="text" :value="price" />
              <button class="btn" @click="price++">+</button>
            </div>
          </div>
          <!-- 设置类别 -->
          <div class="classify price">
            <span>类别</span>
            <el-select v-model="value" size="mini" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!-- 备注信息 -->
          <div class="message price">
            <span>备注信息</span>
            <span class="notActuall">*非必填</span>
          </div>
          <div class="textArea">
            <textarea name="" id="" cols="45" rows="5" v-model="message"></textarea>
          </div>
          <!-- 发布时长 -->
          <div class="price">
            <span>发布时长</span>
            <div class="setPrice">
              <button class="btn" @click="days--">-</button>
              <input class="btn" type="text" :value="days" />
              <button class="btn" @click="days++">+</button>
            </div>
          </div>
          <!-- 发布图书 -->
          <el-button type="primary" size="mini" @click="commitBook" class="publish_btn">发布图书</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book_show: false,
      isbn: "",
      price: 15,
      message: "简介：略",
      book_content: {},
      userData: {},
      options: [
        {
          value: "全部",
          label: "全部",
        },
        {
          value: "通用",
          label: "通用",
        },
        {
          value: "计算机",
          label: "计算机",
        },
        {
          value: "经管",
          label: "经管",
        },
        {
          value: "土木",
          label: "土木",
        },
        {
          value: "新闻",
          label: "新闻",
        },
        {
          value: "数统",
          label: "数统",
        },
        {
          value: "物理",
          label: "物理",
        },
        {
          value: "化工",
          label: "化工",
        },
        {
          value: "电气",
          label: "电气",
        },
        {
          value: "机械",
          label: "机械",
        },
        {
          value: "动力",
          label: "动力",
        },
        {
          value: "材料",
          label: "材料",
        },
        {
          value: "建筑",
          label: "建筑",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
      book_sescription: "该书暂时还没有简介",
      value: "通用",
      days: 30,
    };
  },
  computed: {
    author: {
      get: function () {
        if (this.book_content.book_author) {
          return this.book_content.book_author.split(":")[1] + "著";
        } else {
          return "";
        }
      },
      cache: false,
    },
    author1() {
      return this.book_content.book_author + "著";
    },
    photoUrl: {
      get: function () {
        if (this.book_content.book_cover) {
          if (this.book_content.book_cover.includes("bookCover")) {
            return "/node" + this.book_content.book_cover;
          } else {
            return this.book_content.book_cover;
          }
        } else {
          return "";
        }
      },
      cache: false,
    },
  },
  methods: {
    // ISBN查找图书信息
    async handerISBN() {
      await this.$axios.get(`/node/book/getIsbn/${this.isbn}`).then((res) => {
        console.log("publish", res.data);
        if (!res.data.code) return this.$message.error(res.data.value);
        if (!res.data.book.book_abstract) {
          this.book_content = {
            ...res.data.book,
            desc: this.book_sescription,
          };
        } else {
          this.book_content = { ...res.data.book };
        }
        this.book_show = true;
      });
    },
    // 提交设置的图书信息
    async commitBook() {
      // console.log("publish", this.$store.state.userInfo.user_id);
      await this.$axios
        .post("/node/book", {
          ...this.book_content,
        })
        .then((res) => {
          console.log("publish", res);
        })
        .catch((err) => {
          console.log(err);
        });
      const { data: res } = await this.$axios.post("/node/bookabout", {
        bookA_isbn: this.book_content.book_isbn,
        bookA_old_degree: this.message,
        bookA_price: this.price,
        bookA_stand: this.$store.state.userInfo.user_id,
        bookA_kind: this.value,
      });
      this.book_show = false;
      this.$message.success("书籍发布成功");
      this.isbn = "";
      console.log("publish", res);
      await this.$axios
        .post("/node/sellerorder", {
          sellerorder_sellerid: this.userData.user_id,
          sellerorder_book_isbn: this.book_content.book_isbn,
          sellerorder_address: this.userData.user_loacation,
          sellerorder_bookid: res._id
        })
        .then((res) => {
          console.log("publish", res);
        })
        .catch((err) => {
          console.log(err);
        });
      await this.$axios
        .post("/node/record", {
          r_userId: this.userData.user_id,
          r_url: 0,
          r_result: 1,
        })
        .then((res) => {
          console.log("publish", res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  async mounted() {
    this.$store.dispatch("changehomebol", false);
    let { data } = await this.$axios.post("/node/user/getUserInfo", {
      user_id: this.$store.state.userInfo.user_id,
    });
    this.userData = data[0];
  },
  beforeRouteEnter(from, to, next) {
    if (!localStorage.getItem("token")) {
      next((vm) => {
        vm.$router.push({ path: "/" });
      });
    } else {
      next(true);
    }
  },
  beforeRouteLeave(from, to, next) {
    this.$store.dispatch("changehomebol", true);
    next();
  },
};
</script>

<style lang="less" scoped>
.publishBook {
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow: hidden;

  // ISBN号码
  .isbn_wrap {
    max-width: 500px;
    height: 40px;
    position: relative;
    margin: 30px auto;
    border: 1px solid #333;
    border-right: none;
    border-radius: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 0 6px #b0b0b0;

    img {
      position: absolute;
      top: 11px;
      left: 10px;
      width: 18px;
    }

    .isbn_input {
      width: 400px;
      height: 30px;
      line-height: 30px;
      border-radius: 3px;
      padding: 0 20px;
      box-sizing: border-box;
    }

    /deep/ .el-button span {
      margin-top: 0px;
    }

    button {
      width: 70px;
      height: 40px;
      border-radius: 20px;
      background: #333;
      margin-right: -10px;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
  }

  // 书籍详情
  .book_wrap {
    max-width: 500px;
    height: 580px;
    margin: 20px auto;
    border-radius: 5px;
    box-shadow: 0 0 6px #b0b0b0;
    background: #eee;

    // 书籍详情
    .book_item {
      width: 100%;
      height: 200px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-around;
      box-sizing: border-box;

      .book_content {
        width: 300px;

        .desc {
          width: 100%;
          font-size: 12px;
          text-indent: 2px;
          margin-top: 40px;
          -webkit-line-clamp: 4; //显示2行
          overflow: hidden; //超出隐藏
          white-space: pre-wrap; //允许换行
          display: -webkit-box; //盒子模型
          -webkit-box-orient: vertical; //元素的排列方式
          text-overflow: ellipsis; //省略号显示超出部分
        }

        .author {
          float: left;
          font-weight: bold;
        }

        .price {
          float: right;
          color: red;
        }

        h3 {
          margin-bottom: 10px;
        }
      }

      .book_img {
        width: 100px;

        img {
          width: 100%;
        }
      }
    }

    // 卖书相关
    .sold_book {
      width: 90%;
      height: 350px;
      margin: 20px auto;
      background: #fff;
      border-radius: 5px;
      overflow: hidden;

      .publish_btn {
        width: 80%;
        margin: 5px auto;
        display: block;
      }

      .textArea {
        width: 80%;
        margin: 10px auto;

        textarea {
          border: none;
          outline: none;
          resize: none;
          background: #eee;
          padding: 10px;
        }

        // display: block;
      }

      // 设置价格
      .price {
        width: 80%;
        height: 30px;
        margin: 15px auto;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .setPrice {

          // width: 100px;
          .btn {
            width: 30px;
            height: 25px;
            border-radius: 3px;
            background: #e0e0e0;
            margin-left: 3px;
            font-size: 18px;
          }

          input {
            padding: 0 5px;
            box-sizing: border-box;
            font-size: 16px !important;
          }
        }
      }

      // 设置类别
      .classify {
        /deep/ .el-select--mini {
          width: 100px;
        }
      }

      // 备注信息
      .message {
        .notActuall {
          font-size: 14px;
        }
      }
    }
  }
}

.test {
  width: 200px;
  height: 200px;
  background: red;
}
</style>

<style lang="less">
.el-select-dropdown__item {
  height: 20px !important;
  font-size: 12px !important;
  display: flex;
  align-items: center;
}

.el-select-dropdown__wrap {
  max-height: 140px !important;
}
</style>