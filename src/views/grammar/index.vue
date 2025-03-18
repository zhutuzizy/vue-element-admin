<template>
  <div class="app-container">
    <!-- <div class="markdown-body ">
      <md></md>
    </div> -->

    <div class="filter-container">
      <el-input v-model="listQuery.title" clearable placeholder="语法标题" style="width: 200px;margin-right: 20px;" class="filter-item" />
      <!-- @keyup.enter.native="handleFilter" -->

      <el-select v-model="listQuery.importance" placeholder="重要性" clearable style="width: 150px;margin-right: 20px;" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-select v-model="listQuery.status" placeholder="学习进度" clearable class="filter-item" style="width: 150px;margin-right: 20px;">
        <el-option v-for="item in statusTextOpts" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>

      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
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
      <!-- <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="语法内容" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleShowDetail(row)">{{ row.title }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="Author" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="重要性" width="100px" align="center">
        <template slot-scope="{row}">
          <div class="link-type" @click="handleUpdate(row, 'importance')">
            <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column> -->

      <el-table-column label="去学习" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
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
          <!-- <el-tag :type="row.status | statusFilter">
            {{ row.status | statusTextFilter }}
          </el-tag> -->
          <div v-if="row.remark" style="">{{ row.remark }}</div>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row, 'biji')">
            记下学习心得
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="语法内容" prop="title">
          <!-- <el-input v-model="temp.title" /> -->
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
        <!-- <md />
        <comObj['aa'] /> -->
        <!-- <div v-if="currentFile" v-html="comObj[nameMap[currentFile]]" /> -->
        <component :is="nameMap[currentFile]" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
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
    getList() {
      this.listLoading = true
      // console.log('--this.listQuery', this.listQuery)
      fetchList(this.listQuery).then(response => {
        // this.list = response.data.items
        // this.total = response.data.total
        let newList = fileMap.slice()
        // importance status title
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
        // this.total = this.list.length

        // Just to simulate the time of the request
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
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
      // console.log('------', comObj)
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
      // console.log('ppppppp')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          const index = this.list.findIndex(v => v.title === this.temp.title)

          // this.list.splice(index, 1, this.temp)
          if (this.temp.dialogType === 'importance') {
            this.list[index].importance = this.temp.importance
          }
          if (this.temp.dialogType === 'biji') {
            this.list[index].remark = this.temp.remark
            this.list = this.list.slice()
            // this.list.splice(index, 1, this.temp)
          }

          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          // updateArticle(tempData).then(() => {
          // })
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
    // width: 600px;
    height: calc(100vh - 45px);
    overflow: auto;
    padding: 25px;
  }
</style>
