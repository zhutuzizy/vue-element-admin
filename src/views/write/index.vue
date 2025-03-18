<template>
  <div class="tab-container">
    <tab-pane type="CN" :list="allList" :total="allList.length" @learn="learn" />
  </div>
</template>

<script>
import TabPane from './components/TabPane'
// import header from './header'
// import result from './result'
import result from './CET_Words.json'

export default {
  name: 'Tab333',
  components: { TabPane },
  data() {
    return {
      allList: [],
    }
  },
  watch: {
  },
  created() {
    this.calcList()
  },
  methods: {
    calcList() {
      // console.log('--------,', result)
      this.allList = result
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
