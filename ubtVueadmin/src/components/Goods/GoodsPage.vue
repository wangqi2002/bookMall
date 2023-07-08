<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部商品" name="first"> </el-tab-pane>
        <el-tab-pane label="已上架" name="second"></el-tab-pane>
        <el-tab-pane label="待收" name="third"></el-tab-pane>
        <el-tab-pane label="待入库" name="fourth"></el-tab-pane>
        <el-tab-pane label="已下单" name="fifth"></el-tab-pane>
        <el-tab-pane label="运输中" name="sixth"></el-tab-pane>
        <el-tab-pane label="已签收" name="seventh"></el-tab-pane>
        <el-tab-pane label="拒收" name="eighth"></el-tab-pane>
      </el-tabs>
      <div class="filter-box">
        <el-form :inline="true" :model="filterForm" class="form-inline">
          <el-form-item label="商品ISBN">
            <el-input size="small" v-model="filterForm.ISBN" placeholder="输入ISBN号查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="onSubmitFilter">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-table-box">
        <el-table :data="tableData" style="width: 100%" stripe>
          <el-table-column prop="bookA_id" label="ID" width="120"></el-table-column>
          <el-table-column prop="book_cover" label="商品图片" width="80">
            <template slot-scope="scope">
              <img :src="'https://serve.sirbook.top' + scope.row.book_cover" alt="" style="width: 40px; height: 40px" />
            </template>
          </el-table-column>
          <el-table-column prop="book_name" label="商品名称"></el-table-column>
          <el-table-column prop="bookA_kind" label="类别"></el-table-column>
          <el-table-column prop="bookA_date" label="上传时间"></el-table-column>
          <el-table-column prop="bookA_state" label="状态" width="80" sortable> </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="size"
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
      size: 6,
      total: 0,
      filterForm: {
        ISBN: ''
      },
      tableData: [],
      activeName: 'second',
      pIndex: 0,
      activeClass: 0
    }
  },
  methods: {
    handleClick(tab, event) {
      let pindex = tab._data.index
      this.page = 1
      this.activeClass = 0
      if (pindex == 0) {
        this.getAllList()
        this.pIndex = 0
      } else if (pindex == 1) {
        this.getList(2)
        this.pIndex = 1
      } else if (pindex == 2) {
        this.getList(0)
        this.pIndex = 2
      } else if (pindex == 3) {
        this.getList(1)
        this.pIndex = 3
      } else if (pindex == 4) {
        this.getList(3)
        this.pIndex = 4
      } else if (pindex == 5) {
        this.getList(4)
        this.pIndex = 5
      } else if (pindex == 6) {
        this.getList(5)
        this.pIndex = 6
      } else if (pindex == 7) {
        this.getList(6)
        this.pIndex = 7
      }
    },
    handlePageChange(val) {
      this.page = val
      let nIndex = this.pIndex
      if (nIndex == 0) {
        this.getAllList()
      } else if (nIndex == 1) {
        this.getList(2)
      } else if (nIndex == 2) {
        this.getList(0)
      } else if (nIndex == 3) {
        this.getList(1)
      } else if (nIndex == 4) {
        this.getList(3)
      } else if (nIndex == 5) {
        this.getList(4)
      } else if (nIndex == 6) {
        this.getList(5)
      } else if (nIndex == 7) {
        this.getList(6)
      }
    },
    onSubmitFilter() {
      this.findBooks()
    },
    getAllList() {
      this.axios
        .get('/bookabout/all_page', {
          params: {
            page: this.page
          }
        })
        .then(response => {
          console.log(response.data.results)
          this.tableData = response.data.results.bookData
          this.page = parseInt(response.data.results.page)
          this.total = response.data.results.count
        })
    },
    findBooks() {
      this.axios.get(`/bookabout/isbn_page/${this.filterForm.ISBN}`).then(response => {
        console.log(response.data.results)
        this.tableData = response.data.resultsbookData
        this.page = 1
        this.total = response.data.results.count
      })
    },
    getList(state) {
      this.axios
        .get('/bookabout/state', {
          params: {
            state: state,
            page: this.page
          }
        })
        .then(response => {
          console.log(response.data.results)
          this.tableData = response.data.results.bookData
          this.page = parseInt(response.data.results.page)
          this.total = response.data.results.count
        })
    }
  },
  components: {},
  mounted() {
    this.getList(2)
  }
}
</script>

<style scoped>
.sort-width {
  width: 90px;
}

.right {
  float: right;
}

.form-inline {
  margin-top: 2px;
  height: 40px;
  margin-right: 20px;
}

.block {
  margin-bottom: 10px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.active {
  border-color: #ff4949;
  color: #ff4949;
}

.marginRight {
  margin-right: 20px;
}
</style>
