<template>
  <el-row :gutter="20">

    <el-col :span="4">
      <div class="grid-content">
        1
      </div>
    </el-col>
    <el-col class="mid-content" :span="16">

      <SearchComponent />
      <DirectoryTreeComponent />
    </el-col>
    <el-col :span="4">
      <div class="grid-content">
        3
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import SearchComponent from '../../components/SearchComponent.vue'
import DirectoryTreeComponent from '../../components/DirectoryTreeComponent.vue'
</script>

<style lang="less" scoped>
.el-col {
  border-radius: 4px;
}

.mid-content {
  border-radius: 4px;
  background-color: rgba(250, 250, 250);
  border: 1px solid #ccc;
  /* 可选：添加边框以便查看容器范围 */
}
</style>