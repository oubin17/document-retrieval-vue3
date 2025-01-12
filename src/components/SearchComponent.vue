<template>
  <div class="title">
    <el-text class="text-title">搜索一下，你就知道</el-text>
  </div>

  <el-form ref="formRef" :model="formData">
    <el-form-item>
      <div class="input-button-group">
        <el-input class="search" v-model="formData.keyword" placeholder="请输入关键字查找" clearable />
        <el-button class="submit" @click="confirm(formRef)">搜索</el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-radio-group class="radio-group" v-model="formData.searchType">
        <el-radio value="1">按文件内容</el-radio>
        <el-radio value="2">按文件名称</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script setup>

import { ref, reactive } from 'vue'
import { directoryTree, directorySearch } from '../api/index'
import { search } from '../api'
import { useSearchStore } from '../stores/searchStores'


const searchStore = useSearchStore();

const formRef = ref()
const formData = reactive({
  keyword: "",
  pageNo: 1,
  pageSize: 10,
  searchType: '1',
})


const searchResult = reactive({
  count: 0,
  pageList: ''
})
//表单提交
const confirm = async () => {
  //手动触发表单校验
  // if (formData.keyword === '') {
  //   ElMessage.error('请输入查找关键字')
  //   return;
  // }
  //发送请求
  await directorySearch(formData).then((response) => {
    searchStore.initMethod(response.data.data)
    console.log(searchStore.dataSource)
  })
}
</script>

<style lang="less" scoped>
.title {
  display: block;
  text-align: center;
  height: 58px;
  opacity: 1;
  margin: 0 auto;
  margin-top: 20px;


  .text-title {
    /** 文本1 */
    font-size: 40px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 57.92px;
    color: rgba(0, 0, 0, 1);
  }
}

.input-button-group {
  display: flex;
  align-items: center;
  margin: 0 auto;
  margin-top: 31px;
  width: 758px;
  height: 58px;
  // opacity: 1;
  // border: 1px solid rgba(0, 136, 255, 1);
  // border-radius: 10px;
  // background: rgba(255, 255, 255, 1);


  .search {
    flex: 1;
    /* 输入框占据剩余空间 */
    height: 100%;
    // border: 1px solid rgba(0, 136, 255, 1);
    // // border-radius: 50%;
    font-size: 20px;
    // font-weight: 400;
    // border-radius: 0 10px 10px 0;
  }

  // .search :deep(.el-input--suffix) {
  //   border-top-right-radius: 0;
  //   /* 移除输入框右侧圆角 */
  //   border-bottom-right-radius: 0;
  //   border-right: none;
  //   /* 移除输入框右侧边框 */
  // }

  .submit {
    border-top-left-radius: 0;
    /* 移除按钮左侧圆角 */
    border-bottom-left-radius: 0;
    border-left: none;
    /* 移除按钮左侧边框 */
    height: 100%;
    // opacity: 1;
    // border-radius: 0 10px 10px 0;
    background: rgba(0, 136, 255, 1);
    // /** 文本1 */
    font-size: 26px;
    font-weight: 400;
    // letter-spacing: 0px;
    // line-height: 37.65px;
    color: rgba(255, 255, 255, 1);
    // text-align: left;
  }
}

.radio-group {
  display: flex;
  margin: 0 auto;
}
</style>