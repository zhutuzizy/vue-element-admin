<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <span v-if="item.label === '单词推荐'" slot="label"><i class="el-icon-star-on" />单词推荐</span>
        <keep-alive>
          <tab-pane v-if="activeName==item.key && activeName=='all'" :type="item.key" :list="allList" :total="allList.length" @learn="learn" />
          <div v-else style="color: #888;">无数据</div>

          <tab-pane v-if="activeName==item.key && activeName=='noRecite'" :type="item.key" :list="noLearnList" :total="noLearnList.length" @learn="learn" />
          <div v-else style="color: #888;">无数据</div>

          <tab-pane v-if="activeName==item.key && activeName=='recite'&&learnList.length" :type="item.key" :list="learnList" :total="learnList.length" @learn="learn" />
          <div v-else style="color: #888;">无数据</div>

          <tab-pane v-if="activeName==item.key && activeName=='know'&&knowList.length" :type="item.key" :list="knowList" :total="knowList.length" @learn="learn" />
          <div v-else style="color: #888;">无数据</div>

          <tab-pane v-if="activeName==item.key && activeName=='grasp'&&graspList.length" :type="item.key" :list="graspList" :total="graspList.length" @learn="learn" />
          <div v-else style="color: #888;">无数据</div>

        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
// import header from './header'
// import result from './result'
import result from './CET_Words.json'

export default {
  name: 'Tab22',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '全部', key: 'all' },
        { label: '未背词', key: 'noRecite' },
        { label: '已背词', key: 'recite' },
        { label: '已熟悉', key: 'know' },
        { label: '已掌握', key: 'grasp' },
        { label: '单词推荐', key: 'recommend' }
      ],
      activeName: 'all',
      createdTimes: 0,
      allList: [],
      noLearnList: [],
      learnList: [],
      knowList: [],
      graspList: []
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }

    // console.log('---header---', header)
    // 'wordID', 'wordContent'
    this.calcList()
  },
  methods: {
    calcList() {
      this.allList = result
      this.learnList = result.filter(i => i.know || i.grasp)
      this.noLearnList = result.filter(i => !(i.know || i.grasp))
      this.knowList = result.filter(i => i.know)
      this.graspList = result.filter(i => i.grasp)
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
