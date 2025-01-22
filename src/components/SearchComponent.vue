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

import { ref, reactive, watch } from 'vue'
import { directoryTree, directorySearch } from '../api/index'
import { search } from '../api'
import { useSearchStore } from '../stores/searchStores'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchStore = useSearchStore();
const formRef = ref()
const formData = reactive({
  keyword: "",
  orgId: "",
  searchType: '1',
})

const props = defineProps(['keyword', 'searchType'])
formData.keyword = props.keyword
formData.searchType = props.searchType

const searchResult = reactive({
  count: 0,
  pageList: ''
})
//表单提交
const confirm = async () => {

  //发送请求
  if (formData.orgId.trim().length < 1) {
    //初始化，从登录session中获取
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    formData.orgId = userInfo.organizationTree.childOrganizations[0].id
  } else {
    //从pinia中获取
    formData.orgId = searchStore.orgId
  }
  //如果是首页点击的搜索，直接跳到搜索页
  if (route.fullPath === '/') {
    router.push({
      path: '/backend',
      query: {
        keyword: formData.keyword,
        searchType: formData.searchType
      }
    })
  } else {
    //否则，直接搜索
    await directorySearch(formData).then((response) => {
      searchStore.dataSource = response.data.data
    })
  }
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