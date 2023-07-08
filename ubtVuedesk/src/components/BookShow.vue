<template>
  <div class="bookShow" @scroll.passive="getScroll($event)">
    <!-- 搜索框 -->
    <div class="isbn_wrap">
      <input class="isbn_input" placeholder="请输入想要查找的书名" @keyup.enter="handerSelect" v-model="select" />
      <img src="@/assets/imgs/select_isbn1.png" @click="handerSelect" alt="" />
    </div>
    <!-- 分类列表 -->
    <div class="classify_wrap">
      <ul class="classify_list">
        <li :class="item.class" @click="handerClass(index)" v-for="(item, index) of list" :key="index">
          {{ item.label }}
        </li>
      </ul>
    </div>
    <!-- 商品展示列表 -->
    <div class="book_shop">
      <ul class="book_list">
        <li class="book_item" v-for="(item, index) of book_list" :key="index" @click="handerBookTab(index)">
          <img :src="$store.state.imgUrl + item.book_cover" alt="" />
          <p class="name">{{ item.book_name }}</p>
          <p class="author">{{ item.book_author }}</p>
          <p class="price">￥{{ item.bookA_price }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookShow",
  data() {
    return {
      select: "",
      list: [
        {
          value: "全部",
          label: "全部",
          class: "classify_item active",
        },
        {
          value: "通用",
          label: "通用",
          class: "classify_item",
        },
        {
          value: "计算机",
          label: "计算机",
          class: "classify_item",
        },
        {
          value: "经管",
          label: "经管",
          class: "classify_item",
        },
        {
          value: "土木",
          label: "土木",
          class: "classify_item",
        },
        {
          value: "新闻",
          label: "新闻",
          class: "classify_item",
        },
        {
          value: "数统",
          label: "数统",
          class: "classify_item",
        },
        {
          value: "物理",
          label: "物理",
          class: "classify_item",
        },
        {
          value: "化工",
          label: "化工",
          class: "classify_item",
        },
        {
          value: "电气",
          label: "电气",
          class: "classify_item",
        },
        {
          value: "机械",
          label: "机械",
          class: "classify_item",
        },
        {
          value: "动力",
          label: "动力",
          class: "classify_item",
        },
        {
          value: "材料",
          label: "材料",
          class: "classify_item",
        },
        {
          value: "建筑",
          label: "建筑",
          class: "classify_item",
        },
        {
          value: "其他",
          label: "其他",
          class: "classify_item",
        },
      ],
      book_list: [],
      book_list_copy: [],
      LazyLoding: true,
      total: 0,
      classify: "全部",
    };
  },
  computed: {
  },
  methods: {
    // 点击其他分类样式变化
    handerClass(index) {
      this.book_list = [];
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].class = "classify_item";
      }
      this.list[index].class = "classify_item active";
      let classify = this.list[index].label;
      this.classify = classify;
      this.getBooks();
    },
    // 点击搜索图书
    handerSelect() {
      if (this.select == "") {
        return (this.book_list = this.book_list_copy);
      }
      this.book_list = this.book_list_copy.filter(
        (item) => {
          item.book_name.indexOf(this.select) != -1
        });
    },
    // 点击图书跳转至书籍详情页
    handerBookTab(index) {
      this.$router.push(
        {
          path: "/bookdetails",
          query: this.book_list[index]
        });
    },
    // 触底获取图书
    getScroll(event) {
      //  滚动条距离底部的距离scrollBottom
      let scrollBottom =
        event.target.scrollHeight -
        event.target.scrollTop -
        event.target.clientHeight;
      if (scrollBottom <= 10) {
        if (this.book_list.length >= this.total) return;
        if (this.LazyLoding) {
          this.LazyLoding = false;
          this.getBooks();
        }
      }
    },
    //获取批量图书
    async getBooks() {
      let { data } = await this.$axios.get("/node/bookabout/link", {
        params: {
          onset: this.book_list.length,
          offset: 9,
          classify: this.classify,
        },
      });
      // console.log("bookshow.vue", data.results);
      this.book_list = [...this.book_list, ...data.results.books];
      if (this.book_list_copy.length == 0) {
        this.book_list_copy = this.book_list;
      }
      this.LazyLoding = true;
      if (this.classify == "全部") return;
      this.total = data.results.count;
    },
  },

  // 初始化获取所有图书信息
  async mounted() {
    // 获取图书的全部数量
    this.getBooks();
    let { data } = await this.$axios.get("/node/bookabout/allnum");
    // console.log("bookshow.vue", data);
    this.total = data.results[0].total;
  },
};
</script>

<style lang="less" scoped>
.bookShow {
  width: 100%;
  height: calc(100vh - 40px);
  overflow-y: scroll;

  .isbn_wrap {
    max-width: 700px;
    height: 40px;
    position: relative;
    margin: 20px auto;
    border-right: none;
    padding: 0 25px;
    box-sizing: border-box;
    border-radius: 20px;
    display: flex;
    align-items: center;
    background: #eee;
    box-shadow: 0 0 4px #b0b0b0;

    img {
      position: absolute;
      top: 11px;
      left: 10px;
      width: 18px;
      cursor: pointer;
    }

    .isbn_input {
      width: 400px;
      height: 30px;
      line-height: 30px;
      border-radius: 3px;
      padding: 0 10px;
      box-sizing: border-box;
    }
  }

  // 分类列表
  .classify_wrap {
    max-width: 800px;
    height: 30px;
    margin: 20px auto;

    .classify_list {
      width: 100%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      box-shadow: 0 0 2px #b0b0b0;

      li {
        flex: 1;
        height: 100%;
        border-top: 1px solid #333;
        border-bottom: 1px solid #333;
        border-right: 1px solid #333;
        box-sizing: border-box;
        text-align: center;
        font-size: 12px;
        line-height: 30px;
        cursor: pointer;
      }

      .classify_item:first-child {
        border-left: 1px solid #333;
      }

      .active {
        background: #409eff;
        color: #fff;
      }
    }
  }

  // 商品展示列表
  .book_shop {
    max-width: 800px;
    min-height: 580px;
    // border:1px solid #333;
    margin: 20px auto;

    .book_list {
      width: 98%;
      padding-top: 20px;
      padding-left: 40px;
      padding-right: none;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .book_item {
        position: relative;
        flex: 1;
        height: 250px;
        margin-right: 20px;
        margin-bottom: 20px;
        width: calc((100% - 60px) / 3);
        min-width: calc((100% - 60px) / 3);
        max-width: calc((100% - 60px) / 3);
        display: flex;
        // justify-content: center;
        flex-direction: column;
        align-items: center;

        img {
          width: 100px;
          height: 140px;
          cursor: pointer;
        }

        .price {
          position: absolute;
          bottom: 15px;
          left: 44%;
          transform: translateX(-50%);
          color: red;
        }

        .author {
          color: #999;
          font-size: 12px;
          margin-top: 5px;
          line-height: 14px;
          -webkit-line-clamp: 1; //显示2行
        }

        .name {
          font-size: 14px;
          line-height: 20px;
          margin-top: 10px;
          cursor: pointer;

          &:hover {
            color: #ff6700;
          }
        }

        p {
          width: 140px;
          color: #333;
          user-select: none;
          margin-left: 25px;
          -webkit-line-clamp: 2; //显示2行
          overflow: hidden; //超出隐藏
          white-space: pre-wrap; //允许换行
          display: -webkit-box; //盒子模型
          -webkit-box-orient: vertical; //元素的排列方式
          text-overflow: ellipsis; //省略号显示超出部分
        }
      }

      .book_item:nth-child(3n) {
        margin-right: none !important;
      }
    }
  }
}
</style>
