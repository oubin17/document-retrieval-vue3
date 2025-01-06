<template>
  <el-container>
    <el-header class="search-header">
      <el-text class="text-title">查找一下</el-text>
      <div class="input">
        <el-input class="search" v-model="formData.fileName" placeholder="请输入文件名查找" clearable />
        <el-button class="submit" @click="confirm()">查询</el-button>
      </div>
    </el-header>
    <div class="upload">
      <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />
      <el-button type="primary" @click="selectFile"> 选择文件 </el-button>
      <el-button :disabled="!file" @click="uploadFile">上传文件</el-button>
      <p class="file_name" v-if="file">选中文件: {{ file.name }}</p>
    </div>


    <el-main>


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
    </el-main>
  </el-container>



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
import { fileSearch, fileDelete, fileUpload } from '../../api/index'
import { ElMessage } from 'element-plus'

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

    file.value = null
  })
}

const showDialog = ref(false)
const handleClick = (item) => {

  const params = {
    "docId": item.id
  }

  fileDelete(params).then((response) => {
    const result = response.data.success
    if (result) {
      ElMessage.success('删除成功')
      confirm()
    } else {
      ElMessage.warn('删除失败')
    }
  })

}

//处理文件上传
const file = ref(null)
const fileInput = ref(null)
const uploading = ref(false)
//触发文件选择
const selectFile = () => {
  //使用.value反问你DOM节点
  fileInput.value.click();
}

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile
  }
}


//上传文件
const uploadFile = () => {
  if (!file.value) {
    ElMessage.warn('请选择文件')
    return
  }
  const formData = new FormData()
  formData.append("file", file.value)
  formData.append("dirId", "")
  fileUpload(formData).then((response) => {
    if (response.data.data) {
      //上传成功
      file.value = null;
      confirm()
    } else {
      ElMessage.error("文件上传失败！")
    }
  })
}

</script>

<style lang="less" scoped>
.search-header {
  height: 193px;
  display: flex;
  padding-top: 100px;
  padding-left: 102px;
  // margin-bottom: 50px;

  .text-title {
    display: block;
    /** 文本1 */
    font-size: 40px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 57.92px;
    color: rgba(0, 0, 0, 1);
  }

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
}



.upload {
  margin-left: 100px;
  margin-top: 10px;

  .file_name {
    margin-top: 5px;
    font-size: 14px;
    color: #A39E9E;
  }
}
</style>
