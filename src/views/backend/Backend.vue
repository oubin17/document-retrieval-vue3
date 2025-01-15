<template>
  <el-row :gutter="20">

    <el-col class="grid-content" :span="4">
      <div>
        123
      </div>
    </el-col>
    <el-col class="mid-content" :span="16">
      <SearchComponent />
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