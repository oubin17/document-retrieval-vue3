<template>
  <div class="input">
    <el-input class="search" v-model="formData.fileName" placeholder="请输入文件名查找" clearable />
    <el-button class="submit" @click="confirm()">查询</el-button>
  </div>
  <el-button type="primary"> 上传 </el-button>

  <el-table :data="fileSearchResult.pageList" style="width: 100%" stripe>
    <el-table-column prop="id" label="文件ID" width="120" v-if="false" />
    <el-table-column prop="fileName" label="文件名" width="480" show-overflow-tooltip />
    <el-table-column prop="fileSize" label="文件大小" width="60" />
    <el-table-column prop="fullFilePath" label="文件路径" width="600" show-overflow-tooltip />
    <el-table-column prop="createTime" label="创建时间" width="240" />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleClick(scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- <el-dialog v-model="showDialog" title="是否确定删除" width="500" center>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="showDialog = false">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog> -->

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { fileSearch, fileDelete } from '../../api/index'

const formData = reactive({
  fileName: "",
  pageNo: 1,
  pageSize: 10
})
const fileSearchResult = reactive({
  count: '',
  pageList: ''
})

//表单提交
const confirm = async () => {
  //发送请求
  await fileSearch(formData).then((response) => {
    fileSearchResult.count = response.data.data.count
    fileSearchResult.pageList = response.data.data.pageList
    console.log(fileSearchResult)
  })
}

const showDialog = ref(false)
const handleClick = (item) => {

  const params = {
    "docId": item.id
  }

  fileDelete(params).then((response) => {
    console.log(response)
  })

}


</script>

<style lang="less" scoped>
.input {
  margin-left: 50px;
  margin-top: 20px;
  display: flex;
  width: 758px;
  height: 57.92px;
  opacity: 1;
  border: 1px solid rgba(0, 136, 255, 1);
  border-radius: 10px;
  // background: rgba(255, 255, 255, 1);


  .search {
    border: none;
    height: 100%;
    // border-radius: 50%;
    font-size: 24px;
    font-weight: 400;
  }

  .submit {
    height: 100%;
    opacity: 1;
    border-radius: 0 10px 10px 0;
    background: rgba(0, 136, 255, 1);
    /** 文本1 */
    font-size: 26px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 37.65px;
    color: rgba(255, 255, 255, 1);
    text-align: left;
  }
}
</style>
