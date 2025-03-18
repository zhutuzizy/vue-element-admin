<template>
  <div class="all">
    <el-card v-for="item in newList" :key="item.wordID" class="word-card">
      <div>
        <span class="word">{{ item.wordContent }}</span>
        <span v-if="item.phonetic_US !== 'nullTag'" class="fayin">{{ item.phonetic_US }}</span>
      </div>
      <div class="translate">{{ item.translation }}</div>
      <!-- <el-divider></el-divider> -->
      <div class="divider" />
      <div v-if="item.exampleSentences !== 'nullTag'" class="sentence" v-html="item.exampleSentences" />
      <div v-if="type == 'noRecite' || type == 'all'" class="action">
        <el-button icon="el-icon-plus" size="mini" @click="toKnow(item)">熟悉</el-button>
        <el-button type="success" icon="el-icon-plus" size="mini" @click="toGrasp(item)">掌握</el-button>
      </div>
      <div v-else class="action">
        <el-button type="warning" icon="el-icon-minus" size="mini" @click="toForget(item)">忘记</el-button>
      </div>
    </el-card>

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
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: '+id'
      },
      loading: false,
      pageSize: 6
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
      // console.log(`当前页: ${val}`)
      this.newList = this.list.slice((val - 1) * this.pageSize, val * this.pageSize)
    },
    toKnow(item) {
      // console.log(item, 'pppppp')
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
  .all {
    height: calc(100vh - 185px);
    overflow: auto;
  }
  .word-card {
    display: inline-block;
    width: 307px;
    height: 400px;
    margin-right: 20px;
    margin-bottom: 10px;
    .word {
      font-size: 18px;
      font-weight: bolder;
    }
    .fayin {
      padding-left: 10px;
      font-size: 14px;
    }
    .translate {
      height: 40px;
      overflow: auto;
    }
    .sentence {
      height: 270px;
      overflow: auto;
    }
    .action {
      margin-top: 10px;
    }
    .divider {
      // border: solid #ccc 1px;
    }
  }
  .page {
    text-align: center;
  }
</style>
