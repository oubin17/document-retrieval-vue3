<template>
  <el-row :gutter="20">

    <el-col :span="3">
      <div class="grid-content">
        1
      </div>
    </el-col>
    <el-col class="mid-content" :span="18">
      <div>
        233
      </div>
      <DirectoryTreeComponent :message="dataSource" />
    </el-col>
    <el-col :span="3">
      <div class="grid-content">
        3
      </div>
    </el-col>
  </el-row>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { directoryTree } from '../../api/index'
import DirectoryTreeComponent from '../../components/DirectoryTreeComponent.vue'

const dataSource = ref([])
const getTree = async () => {
  //发送请求
  await directoryTree().then((response) => {
    dataSource.value = response.data.data
  })
}
onMounted(() => {
  getTree()
})

</script>

<style lang="less" scoped>
.el-col {
  border-radius: 4px;
}

.mid-content {
  border-radius: 4px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  /* 可选：添加边框以便查看容器范围 */
}
</style>