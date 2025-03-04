<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
    <button id="downloadButton">Download Array</button>
    <textarea id="arrayContent" rows="10" cols="50" readonly />
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      // this.$message({
      //   message: 'Please do not upload files larger than 1m in size.',
      //   type: 'warning'
      // })
      return true
    },
    copyToClipboard() {
      const textarea = document.getElementById('arrayContent')
      textarea.select()
      document.execCommand('copy')
      alert('Copied to clipboard! Paste it into a .js file.')
    },
    handleSuccess({ results, header }) {
      console.log('kkkkkk-----')
      // this.tableData = results
      // this.tableHeader = header

      // const blob = new Blob([`const myArray = ${JSON.stringify(header)};`], { type: 'application/javascript' })
      // const url = URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'myArray.js'
      // a.click()
      // URL.revokeObjectURL(url)

      const arrayString = JSON.stringify(results)
      console.log('Array String:', arrayString) // 检查数组字符串是否正确

      // const blob = new Blob([`const myArray = ${arrayString};`], { type: 'application/javascript' });
      // console.log('Blob:', blob); // 检查 Blob 对象是否正确生成

      // const url = URL.createObjectURL(blob);
      // console.log('Object URL:', url); // 检查生成的 URL 是否正确

      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'myArray.js';
      // console.log('Download link:', a); // 检查下载链接是否正确设置
      // a.click();
      // URL.revokeObjectURL(url);

      // const jsContent = `const myArray = ${arrayString};`;
      const jsContent = `const myArray = ${arrayString};`

      // 将内容显示在 textarea 中
      document.getElementById('arrayContent').value = jsContent
      // const textarea = document.getElementById('arrayContent');
      //     textarea.select();
      //     document.execCommand('copy');
      //     alert('Copied to clipboard! Paste it into a .js file.');

      // // 将内容编码为 data: URL
      // const dataUrl = `data:application/javascript;charset=utf-8,${encodeURIComponent(jsContent)}`;
      // // 在新窗口中打开
      // window.open(dataUrl);
    }
  }
}
</script>
