<template>
  <el-input class="search" v-model="keyword" placeholder="请输入关键字查找" clearable />
  <el-button class="submit" @click="confirm()">搜索</el-button>
</template>

<script setup>

import { ref } from 'vue'

import { useSearchStore } from '../stores/searchStores'


const searchStore = useSearchStore();

const keyword = ref()



// const props = defineProps(['inputKeyword'])




//表单提交
const confirm = async () => {
  //手动触发表单校验
  if (keyword === '') {
    ElMessage.error('请输入查找关键字')
    return;
  }
  //发送请求
  search(keyword).then((response) => {
    searchStore.count = response.data.data.count
    searchStore.pageList = response.data.data.pageList
    router.push({
      path: '/search',
      query: {
        keyword: formData.keyword
      }
    })
  })

}


</script>

<style lang="less" scoped></style>