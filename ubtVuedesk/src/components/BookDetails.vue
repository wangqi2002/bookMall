<template>
  <div class="books_detail">
    <div class="detail_head">
      <img :src="$store.state.imgUrl + book_detail.bookA_image" alt="" />
      <div class="detail_buy">
        <div class="book_name">
          <p class="book_name_name">{{ book_detail.book_name }}</p>
          <p class="price">￥{{ book_detail.bookA_price }}</p>
        </div>
        <p class="author">{{ book_detail.book_author }}</p>
        <div class="buyCar">
          <button class="join_btn" @click="handlePlOrder()">购买</button>
          <div class="love" @click="handleCollection">
            <img v-if="!collection" src="@/assets/imgs/love_light.png" alt="" />
            <img v-else src="@/assets/imgs/love_dark.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="books_desc_wrap">
      <ul class="books_desc_list">
        <li>
          <span class="jia">+</span><span>ISBN编号</span><span>{{ book_detail.book_isbn }}</span>
        </li>
        <li>
          <span class="jia">+</span><span>出版社</span><span>{{ book_detail.book_press }}</span>
        </li>
        <li>
          <span class="jia">+</span><span>出版时间</span><span>{{ book_detail.book_publication_time }}</span>
        </li>
        <li>
          <span>+</span><span>装帧方式</span><span>{{ book_detail.book_framing }}</span>
        </li>
        <li>
          <span>+</span><span>分类</span><span>{{ book_detail.bookA_kind }}</span>
        </li>
        <li>
          <span>+</span><span>定价</span><span>{{ book_detail.book_publiction_price }}</span>
        </li>
        <li>
          <span>+</span><span>图书介绍</span><span class="book_long_desc">{{ book_detail.book_abstract }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import merge from "webpack-merge";
export default {
  name: "BookDetails",
  data() {
    return {
      book_detail: {},
      collectionValue: "",
      collection: false,
    };
  },
  methods: {
    // 路由跳转
    handlePlOrder() {
      if (!localStorage.getItem("token")) {
        return this.$message.error("请登录...");
      }
      this.$router.push({
        path: "/Order",
        query: {
          book_detail: JSON.stringify(this.book_detail),
        },
      });
    },
    // 收藏/取消收藏
    async handleCollection() {
      if (!localStorage.getItem("token")) {
        return this.$message.error("请登录...");
      }
      if (!this.collection) {
        if (this.collectionValue == null) {
          this.collectionValue = `${this.book_detail.bookA_id} `;
        } else {
          this.collectionValue = this.collectionValue.concat(
            `${this.book_detail.bookA_id} `
          );
        }
      } else {
        let collectArr = this.collectionValue.split(" ");
        if (collectArr.length > 1) {
          collectArr.pop();
        }
        let index = collectArr.indexOf(this.book_detail.bookA_id);
        if (index > -1) {
          collectArr.splice(index, 1);
        }
        if (collectArr.length > 0) {
          let valueC = collectArr.join(" ");
          this.collectionValue = valueC.concat(" ");
        } else {
          this.collectionValue = null;
        }
      }
      this.collection = !this.collection;

      // console.log("bookdetail.vue" + this.collectionValue);
      let { data } = await this.$axios.post("/node/user/collect", {
        user_collection: this.collectionValue,
        user_id: this.$store.state.userInfo.user_id,
      });
      this.$router.push({
        query: merge(this.$route.query, { bookA_collection: this.collection }),
      });
      if (data.code && this.collection) {
        this.$message.success("收藏成功");
      }
      if (!data.code) {
        this.$message.error("操作失败");
      }
    },
    async handleGetCollect() {
      if (!localStorage.getItem("token")) {
        return
      }
      let { data: res } = await this.$axios.get(
        `/node/user/getCollections/${this.$store.state.userInfo.user_id}`
      );
      this.collectionValue = res[0].user_collection;
      if (this.collectionValue == null) {
        this.collection = false;
      } else {
        let collectArr = this.collectionValue.split(" ");
        if (collectArr.length > 1) {
          collectArr.pop();
        }
        // console.log("bookdetail.vue" + collectArr);
        for (let i = 0; i < collectArr.length; i++) {
          if (collectArr[i] === this.book_detail.bookA_id) {
            this.collection = true;
          }
        }
      }
    }
  },
  async mounted() {
    this.$store.dispatch("changehomebol", false);
    this.book_detail = this.$route.query;
    this.handleGetCollect()
  },
  beforeRouteLeave(from, to, next) {
    this.$store.dispatch("changehomebol", true);
    next();
  },
};
</script>

<style lang="less" scoped>
.books_detail {
  max-width: 600px;
  padding: 20px;
  margin: 20px auto;
  box-sizing: border-box;
  // border: 1px solid #333;
  max-height: calc(100vh - 40px);

  .detail_head {
    width: 100%;
    display: flex;
    justify-content: space-between;

    img {
      width: 160px;
    }

    .detail_buy {
      width: 300px;

      .book_name {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .price {
          font-weight: bold;
          font-size: 20px;
        }

        .book_name_name {
          width: 140px;
          font-size: 12px;
          font-weight: bold;
          -webkit-line-clamp: 2; //显示2行
          overflow: hidden; //超出隐藏
          white-space: pre-wrap; //允许换行
          display: -webkit-box; //盒子模型
          -webkit-box-orient: vertical; //元素的排列方式
          text-overflow: ellipsis; //省略号显示超出部分
        }
      }

      .author {
        font-size: 10px;
        color: #b0b0b0;
        margin-top: 20px;
      }

      .buyCar {
        display: flex;
        margin-top: 35px;

        .join_btn {
          width: 150px;
          height: 40px;
          border-radius: 20px;
          background: rgb(0, 89, 170);
          color: #fff;
          cursor: pointer;
        }

        .love {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-left: 20px;
          background: #b0b0b0;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;

          img {
            width: 50%;
          }
        }
      }
    }
  }

  .books_desc_wrap {
    width: 100%;

    .books_desc_list {
      width: 100%;

      li {
        .book_long_desc {
          -webkit-line-clamp: 4; //显示2行
          overflow: hidden; //超出隐藏
          white-space: pre-wrap; //允许换行
          display: -webkit-box; //盒子模型
          -webkit-box-orient: vertical; //元素的排列方式
          text-overflow: ellipsis; //省略号显示超出部分
          margin-top: 5px;
        }

        span {
          margin-top: 17px;
        }

        span:nth-child(1) {
          margin-right: 10px;
          font-weight: bold;
        }

        span:nth-child(2) {
          display: inline-block;
          width: 100px;
          margin-right: 10px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>