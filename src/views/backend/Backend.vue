<template>
  <el-row :gutter="20">

    <el-col class="grid-content" :span="4">
      <div>
      </div>
    </el-col>
    <el-col class="mid-content" :span="16">
      <SearchComponent :keyword="searchStore.keyword" :searchType="searchStore.searchType" />
      <DirectoryTreeComponent />
    </el-col>
    <el-col class="grid-content" :span="4">
      <OrgTree />
    </el-col>
  </el-row>
</template>

<script setup>
import SearchComponent from '@/components/SearchComponent.vue'
import DirectoryTreeComponent from '@/components/DirectoryTreeComponent.vue'
import OrgTree from '@/components/OrgTree.vue'
import { useSearchStore } from '@/stores/searchStores'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { directorySearch } from '@/api/index'

const route = useRoute()

const searchStore = useSearchStore();

// 监听路径变化
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (oldPath !== newPath) {
      if (!route.query.searchType) {
        searchStore.searchType = '1'
      } else {
        searchStore.searchType = route.query.searchType
      }
      searchStore.keyword = route.query.keyword


      const formData = {
        keyword: searchStore.keyword,
        searchType: searchStore.searchType,
      }
      //初始化，从登录session中获取
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      formData.orgId = userInfo.organizationTree.childOrganizations[0].id
      directorySearch(formData).then((response) => {
        searchStore.dataSource = response.data.data
      })
    }

  },
  //初始化时执行逻辑：如果你希望在组件初始化时立即执行某些逻辑，而不是等待数据变化。
  //监听路由或查询参数：在监听路由或查询参数时，通常希望在组件加载时立即获取初始值，而不是等待路由变化。 立即执行一次，这个很重要
  { immediate: true }

);


</script>

<style lang="less" scoped>
.el-col {
  border-radius: 4px;
}

.mid-content {
  // border-radius: 4px;
  background-color: rgba(250, 250, 250);
  // border: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  /* 可选：添加边框以便查看容器范围 */
}

.grid-content {
  background-color: rgba(250, 250, 250);
}
</style>