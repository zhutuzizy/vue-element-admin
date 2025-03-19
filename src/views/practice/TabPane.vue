<template>
  <div class="all">
    <el-card v-for="item in newList" :key="item.title" class="word-card " :body-style="{ height: '460px', overflow: 'auto' }" shadow="hover">
      <div slot="header" class="header clearfix">
        <pre class="text-container" v-html="item.title" />
        <el-button class="download" type="text" @click="toDownloadCard(item.title)">下载答题卡</el-button>

        <el-button class="download" type="text" @click="toDownloadFile(item.title)">下载试卷</el-button>

        <el-button class="download" type="text" @click="toViewFile(item.title)">查看试卷</el-button>
      </div>

      <iframe :src="item.path" width="100%" height="600px" />
      <!-- <pdf :src="item.path" /> -->
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
import pdf from 'vue-pdf'

export default {
  components: { pdf },
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
      newList: [],
      currentPage: 1,
      loading: false,
      pageSize: 1
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
      this.newList = this.list.slice(0, this.pageSize)
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.newList = this.list.slice((val - 1) * this.pageSize, val * this.pageSize)
    },
    toDownloadCard(title) {
      let tit = '六级答题卡'
      if (title.includes('四级')) {
        tit = '四级答题卡'
      }
      const filePath = `/answer/${encodeURIComponent(tit)}.pdf?t=${Date.now()}`
      this.fetchData(tit, filePath)
    },
    toDownloadFile(title) {
      const tit = title
      const filePath = `/pdf/${encodeURIComponent(tit)}.pdf?t=${Date.now()}`
      this.fetchData(tit, filePath)
    },
    toViewFile(title) {
      const tit = title
      const filePath = `/pdf/${encodeURIComponent(tit)}.pdf?t=${Date.now()}`
      window.open(filePath, '_blank')
    },
    fetchData(title, filePath) {
      const fileName = `${title}.pdf` // 下载时的文件名
      const link = document.createElement('a')
      link.href = filePath
      // link.download = fileName // 设置下载的文件名
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click() // 触发点击下载
      document.body.removeChild(link) // 移除 <a> 标签
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-card__header {
    background: rgb(236, 245, 255);
  }
  .word-card {
    display: inline-block;
    width: 95%;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .page {
    text-align: center;
  }
  .text-container {
    display: inline-block;
    width: 50%;
    white-space: pre-line;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .download {
    float: right;
    margin: 14px 10px;
    padding: 3px 0;
  }
</style>
