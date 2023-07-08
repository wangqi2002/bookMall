<template>
  <div class="collection">
    <div class="collection_wrap">
      <div class="title">
        <h3>
          收藏夹 <span>全部：({{ tableData.length }})</span>
        </h3>
      </div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="书籍名称" width="120">
          <template slot-scope="scope">
            <p style="verticalalign: middle">{{ scope.row.book_name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="书籍图片" width="120">
          <template slot-scope="scope">
            <img style="width: 60px; height: 90px" :src="scope.row.book_cover" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="单价" width="120">
          <template slot-scope="scope">
            {{ scope.row.bookA_price }}
          </template>
        </el-table-column>

        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

        <el-table-column label="详情" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)">跳转</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="单价" width="120">
          <template slot="header">
            <el-button size="mini" type="danger" @click="handleDeleteAll()">清空收藏夹</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      payBol: false,
      price: "0.00",
      collectionValue: null,
    };
  },

  methods: {
    // 将书籍从收藏夹删除
    async handleDelete(index, row) {
      let _id = row.bookA_id;
      // let { data } = await this.$axios.get(
      //   "/node/user/getCollections/" + this.$store.state.userInfo.user_id
      // );
      // console.log(data);
      // this.collectionValue = data[0].user_collection;
      let collectArr = this.collectionValue.split(" ");
      if (collectArr.length > 1) {
        collectArr.pop();
      }
      let tag = collectArr.indexOf(row.bookA_id);
      if (tag > -1) {
        collectArr.splice(tag, 1);
      }
      if (collectArr.length > 0) {
        let valueC = collectArr.join(" ");
        this.collectionValue = valueC.concat(" ");
      } else {
        this.collectionValue = null;
      }
      this.tableData.splice(index, 1);
      let { data: res } = await this.$axios.post("/node/user/collect", {
        user_collection: this.collectionValue,
        user_id: this.$store.state.userInfo.user_id,
      });
      if (res.code) this.$message.success("从收藏夹移出");
      if (!res.code) this.$message.error("操作失败");
    },

    async handleDetail(index, row) {
      this.$router.push({ path: "/bookdetails", query: row });
    },

    // 清空收藏夹
    async handleDeleteAll() {
      this.tableData = [];
      let { data } = await this.$axios.get(
        "/node/user/deleteCollectionAll/" + this.$store.state.userInfo.user_id
      );
      if (data.code) return this.$message.success(data.value);
      this.$message.erroe(data.value);
    },

    // 获取收藏的书籍数据
    async getCollections(_id) {
      let { data } = await this.$axios.get("/node/user/getCollections/" + _id);
      console.log("collect", data);
      this.collectionValue = data[0].user_collection;
      if (this.collectionValue == null) {
        this.tableData = [];
      } else {
        let collectArr = this.collectionValue.split(" ");
        collectArr.pop();
        let newData = [];
        let valueC = "";
        for (let i = 0; i < collectArr.length; i++) {
          let { data: item } = await this.$axios.get(
            "/node/bookabout/idTrue/" + collectArr[i]
          );
          if (item.results.length != 0) {
            item = item.results[0];
            valueC = valueC.concat(`${item.bookA_id} `);
            item.book_cover = this.$store.state.imgUrl + item.book_cover;
            item = { ...item, bol: false };
            newData.push(item);
          }
        }
        if (valueC == "") {
          valueC = null;
        }
        this.collectionValue = valueC;
        this.tableData = newData;
      }
    },
  },
  async mounted() {
    this.getCollections(this.$store.state.userInfo.user_id);
  },
};
</script>

<style lang="less" scoped>
.collection {
  height: calc(100vh - 40px);
  background: rgb(233, 228, 227);
  overflow: hidden;

  .page {
    position: absolute;
    bottom: 10px;
    right: 0;
  }

  .collection_wrap {
    position: relative;
    max-width: 800px;
    height: calc(100% - 200px);
    background: #fff;
    margin: 30px auto;
    // border-radius: 20px;/
    padding: 60px 30px 60px;
    overflow: auto;

    .title {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 60px;
      padding: 0 20px;
      display: flex;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #333;

      span {
        margin-left: 4px;
      }

      .title_right {
        display: flex;
        align-items: center;
        font-family: 16px;

        .money {
          color: red;
          margin: 0 10px;
          font-size: 20px;
        }

        .pay {
          width: 80px;
          height: 40px;
          border-radius: 20px;
          background: rgb(170, 170, 170);
          color: #fff;
          font-size: 16px;
          font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
          cursor: pointer;
        }

        .active {
          background: #ff6700;
        }
      }

      .book_info {
        display: flex;
      }
    }
  }
}

.collection_wrap::-webkit-scrollbar {
  width: 2px;
  height: 16px;
  background-color: #f5f5f5;
}

/*定义滚动条的轨道，内阴影及圆角*/
.collection_wrap::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

/*定义滑块，内阴影及圆角*/
.collection_wrap::-webkit-scrollbar-thumb {
  /*width: 10px;*/
  height: 1px;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgb(64, 158, 255);
  background-color: #555;
}
</style>
