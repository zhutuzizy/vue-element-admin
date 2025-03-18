<template>
  <div class="tab-container">
    <tab-pane type="CN" :list="allList" :total="allList.length" @learn="learn" />
  </div>
</template>

<script>
// 引入所有需要的动态组件
const components = require.context(
  './file/', // 组件所在目录的相对路径
  true, // 是否查询其子目录
  /\.pdf$/ // 匹配基础组件文件名的正则表达式
)
const filePdfArr = []
components.keys().forEach(fileName => {
  // 获取文件名
  const names = fileName.split('/').pop().replace(/.\w+$/, '')
  console.log('---names---', names)
  const obj = {
    title: names,
    path: require(`./file/${names}.pdf`).default
  }
  filePdfArr.push(obj)
})

console.log('---filePdfArr---', filePdfArr)

import TabPane from './TabPane'

export default {
  name: 'Tab111',
  components: { TabPane },
  data() {
    return {
      allList: []
    }
  },
  watch: {
  },
  created() {
    this.calcList()
  },
  methods: {
    calcList() {
      this.allList = filePdfArr
    },
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    learn() {
      this.calcList()
    }
  }
}
</script>

<style scoped>
  .tab-container {
    height: calc(100vh - 110px);
    margin: 20px;
    overflow: auto;
  }
</style>
