<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" clearable placeholder="语法标题" style="width: 200px;margin-right: 20px;" class="filter-item" />
      <!-- @keyup.enter.native="handleFilter" -->

      <el-select v-model="listQuery.importance" placeholder="重要性" clearable style="width: 150px;margin-right: 20px;" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-select v-model="listQuery.status" placeholder="学习进度" clearable class="filter-item" style="width: 150px;margin-right: 20px;">
        <el-option v-for="item in statusTextOpts" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>

      <el-button class="view" type="text" icon="el-icon-link" @click="toViewFile()">更多语法</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row, $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="语法内容" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="重要性" width="100px" align="center">
        <template slot-scope="{row}">
          <div class="link-type" @click="handleUpdate(row, 'importance')">
            <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="去学习" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleLearn(row, 'start')">
            开始学习
          </el-button>
          <el-button type="warning" size="mini" @click="handleLearn(row, 'noUnderstand')">
            不理解
          </el-button>
          <el-button size="mini" type="danger" @click="handleLearn(row, 'noKnow')">
            不知道
          </el-button>
          <el-button size="mini" type="success" @click="handleLearn(row, 'finish')">
            掌握啦
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="学习进度" class-name="status-col" width="150" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="学习笔记" class-name="status-col" width="150" align="center">
        <template slot-scope="{row}">
          <div v-if="row.remark" style="">{{ row.remark }}</div>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row, 'biji')">
            记下学习心得
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="语法内容" prop="title">
          <span>{{ temp.title }}</span>
        </el-form-item>
        <el-form-item v-if="temp.dialogType === 'importance'" label="重要性">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="5" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item v-if="temp.dialogType === 'biji'" label="笔记">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-drawer
      title="语法内容"
      :visible.sync="dialogDrawerVisible"
      :with-header="true"
      size="45%"
      @close="handleCloseDrawer"
    >
      <div class="markdown-body md-div">
        <component :is="nameMap[currentFile]" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle } from '@/api/article'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import { fileMap, statusMap, statusText, nameMap } from './markdownList'

// import md from './md/IT的用法.md'
// fileMap.forEach(i => {
//   const title = i.title
//   import [title] from `./md/${title}.md`
// })

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
  /\.md$/ // 匹配基础组件文件名的正则表达式
)
const comObj = {}
components.keys().forEach(fileName => {
  // 获取文件名
  const names = fileName.split('/').pop().replace(/.\w+$/, '')
  // 获取组件配置
  const comp = components(fileName)
  // 若该组件是通过"export default"导出的，优先使用".default"，否则退回到使用模块的根
  // console.log('--', names)
  comObj[nameMap[names]] = comp.default || comp
})

export default {
  name: 'ComplexTable',
  components: comObj,
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
    }
  },
  data() {
    return {
      nameMap,
      currentFile: '',
      comObj,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
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
    toViewFile() {
      const filePath = 'https://oldwestenglish.github.io/grammar/#/'
      window.open(filePath, '_blank')
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        let newList = fileMap.slice()
        if (this.listQuery.importance) {
          newList = newList.filter(i => i.importance === this.listQuery.importance)
        }

        if (this.listQuery.status) {
          newList = newList.filter(i => i.status === this.listQuery.status)
        }

        if (this.listQuery.title) {
          newList = newList.filter(i => i.title.includes(this.listQuery.title))
        }

        this.list = newList
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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
      row.status = step
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
  .view {
    float: right;
  }
</style>
