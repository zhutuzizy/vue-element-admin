<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" clearable placeholder="听力标题" style="width: 300px;margin-right: 20px;" class="filter-item" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="namesMP3"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" width="100">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="听力标题" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="听力等级" width="150px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.title | jibieFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="听力内容" align="center" class-name="status-col" width="400px">
        <template slot-scope="{row}">
          <audio controls>
            <source :src="row.path" type="audio/mpeg">
            您的浏览器不支持音频播放。
          </audio>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="100" class-name="small-padding">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleLearn(row, 'start')">
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, fetchPv } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { statusMap, statusText, nameMap } from './markdownList'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

const statusTextOpts = []
Object.keys(statusText).forEach(key => {
  const i = {
    key: key
  }
  i['display_name'] = statusText[key]
  statusTextOpts.push(i)
})

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

// 引入所有需要的动态组件
const components = require.context(
  './md/', // 组件所在目录的相对路径
  true, // 是否查询其子目录
  /\.mp3$/ // 匹配基础组件文件名的正则表达式
)
const namesMP3 = []
const comObj = {}
components.keys().forEach(fileName => {
  // 获取文件名
  const names = fileName.split('/').pop().replace(/.\w+$/, '')
  const obj = {
    title: names,
    path: require(`./md/${names}.mp3`)
  }
  namesMP3.push(obj)
})

export default {
  name: 'Listen',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    statusTextFilter(status) {
      return statusText[status]
    },
    jibieFilter(title) {
      return title.includes('四级') ? '四级' : '六级'
    }
  },
  data() {
    return {
      namesMP3,
      nameMap,
      currentFile: '',
      comObj,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        status: ''
      },
      importanceOptions: [1, 2, 3, 4, 5],
      calendarTypeOptions,
      statusTextOpts,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published',
        dialogType: ''
      },
      dialogFormVisible: false,
      dialogDrawerVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Update',
        create: 'Create',
        importance: '设置重要性',
        biji: '学习笔记'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        let newList = namesMP3.slice()
        if (this.listQuery.importance) {
          newList = newList.filter(i => i.importance === this.listQuery.importance)
        }

        if (this.listQuery.status) {
          newList = newList.filter(i => i.status === this.listQuery.status)
        }

        if (this.listQuery.title) {
          newList = newList.filter(i => i.title.includes(this.listQuery.title))
        }
        this.total = newList.length

        // 分页
        this.namesMP3 = newList.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.page * this.listQuery.limit)

        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: '',
        dialogType: ''
      }
    },
    handleShowDetail(row) {
      this.dialogDrawerVisible = true
      this.currentFile = row.title
    },
    handleCloseDrawer() {
      this.dialogDrawerVisible = false
      this.currentFile = ''
    },
    handleLearn(row, step) {
      // console.log('------', row)
      const filePath = `/listen/${encodeURIComponent(row.title)}.mp3?t=${Date.now()}`
      this.fetchData(row.title, filePath)
    },
    fetchData(title, filePath) {
      const fileName = `${title}.mp3` // 下载时的文件名
      const link = document.createElement('a')
      link.href = filePath
      // link.download = fileName // 设置下载的文件名
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click() // 触发点击下载
      document.body.removeChild(link) // 移除 <a> 标签
    },
    handleUpdate(row, type) {
      this.temp = Object.assign({}, row)
      this.temp.dialogType = type
      this.dialogStatus = type
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp)
          const index = this.list.findIndex(v => v.title === this.temp.title)

          if (this.temp.dialogType === 'importance') {
            this.list[index].importance = this.temp.importance
          }
          if (this.temp.dialogType === 'biji') {
            this.list[index].remark = this.temp.remark
            this.list = this.list.slice()
          }

          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-div {
    height: calc(100vh - 45px);
    overflow: auto;
    padding: 25px;
  }
  .pagination-container {
    padding: 10px 0;
    margin-top: 10px;
    text-align: center;
  }

  .link-type,
  .link-type:focus {
    color: #337ab7;
    cursor: text !important;

    &:hover {
      color: rgb(32, 160, 255);
    }
  }
</style>
