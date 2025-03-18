<template>
  <div class="all">
    <el-card v-for="item in newList" :key="item.key" class="word-card " :body-style="{ height: '300px', overflow: 'auto' }" shadow="hover">
      <div slot="header" class="header">
        <pre class="text-container" v-html="item.Directions" />
      </div>
      <pre class="text-container" v-html="item.file" />
    </el-card>
    <!-- {
  "Directions": "",
  "file": ""
} -->
    <div v-if="total" class="page">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        background
        :page-size="pageSize"
        :total="total"
        :current-page.sync="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div v-else style="color: #888;">无数据</div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
    },
    list: {
      type: Array,
      default: []
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // list: [{word: 'kkk'},{word: 'kkk'},{word: 'kkk'},{word: 'kkk'},{word: 'kkk'},{word: 'kkk'},{word: 'kkk'},{word: 'kkk'},{word: 'kkk'}],
      newList: [],
      currentPage: 1,
      loading: false,
      pageSize: 4
    }
  },
  watch: {
    list(val) {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      // this.$emit('create') // for test
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.loading = false
      // })
      this.newList = this.list.slice(0, this.pageSize)
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.newList = this.list.slice((val - 1) * this.pageSize, val * this.pageSize)
    },
    toKnow(item) {
      item.know = true
      this.$emit('learn')
      this.$message('添加至已熟悉列表')
    },
    toGrasp(item) {
      item.grasp = true
      this.$emit('learn')
      this.$message('添加至已掌握列表')
    },
    toForget(item) {
      if (this.type === 'recite') {
        item['know'] = false
        item['grasp'] = false
        this.$emit('learn')
        this.$message(`取消已背词`)
      } else {
        item[this.type] = false
        this.$emit('learn')
        this.$message(`取消已${this.type === 'know' ? '熟悉' : '掌握'}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-card__header {
    // height: calc(100vh - 185px);
    // overflow: auto;
    // background: #ccc;
    // background: rgb(179, 216, 255);
    // background: rgb(217, 236, 255);
    background: rgb(236, 245, 255);
  }
  .word-card {
    display: inline-block;
    // width: 500px;
    // height: 400px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .page {
    text-align: center;
  }
  .text-container {
    white-space: pre-line;
  }
</style>
