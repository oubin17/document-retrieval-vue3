<template>
  <div class="header-right">
    <el-dropdown @command="handleCommand">
      <div class="flex-box">
        <el-avatar icon="User" />
        <p class="user-name">{{ userInfo.userName }}</p>
      </div>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="cancel">退出</el-dropdown-item>

        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <h2 style="margin-bottom: 5px;">所属组织</h2>
  <el-tree class="org-tree" style="max-width: 600px" :data="orgTreeList" node-key="id" default-expand-all
    :props="defaultProps" @node-click="handleNodeClick">
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span class="dir-name">{{ data.orgName }} </span>
      </span>
    </template>
  </el-tree>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orgTree, directorySearch } from '@/api/index'
import { useSearchStore } from '../stores/searchStores'

const searchStore = useSearchStore();
const router = useRouter()

const userInfo = JSON.parse(localStorage.getItem('userInfo'))

const orgTreeList = ref([])
const defaultProps = {
  children: 'childOrganizations',
  label: 'orgName',
}

const formData = reactive({
  orgId: "",
  keyword: "",
  searchType: '1',
})

const handleNodeClick = (data) => {

  if (data.childOrganizations.length === 0) {
    formData.orgId = data.id
    formData.searchType = searchStore.searchType
    formData.keyword = searchStore.keyword
    searchStore.orgId = data.id
    getTree()
  }
}

const handleCommand = (command) => {

  if (command === 'cancel') {
    localStorage.removeItem('odk-token')
    localStorage.removeItem('userInfo')
    router.push('/login')

    // window.location.href = window.location.origin
  }
}

const getTree = async () => {
  await directorySearch(formData).then((response) => {
    searchStore.dataSource = response.data.data
  })
}

onMounted(() => {
  orgTree().then((response) => {
    orgTreeList.value = []
    orgTreeList.value.push(response.data.data)
    searchStore.orgId = response.data.data.childOrganizations[0].id
    formData.orgId = response.data.data.childOrganizations[0].id
  })
})

</script>

<style lang="less" scoped>
.header-right {
  margin-top: 10px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 30px;

  .flex-box {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 20px;
    height: 100%;
  }

  .user-name {
    margin-left: 10px;
  }
}

/* 移除触发元素的焦点轮廓 */
.el-tooltip__trigger {
  outline: none;
}

.org-tree {
  background-color: rgba(250, 250, 250);
  font-size: 15px;
  font-weight: 400;
}

.custom-tree-node {
  font-size: 15px;
  padding-right: 8px;

  .dir-name {
    font-size: 15px;
    font-weight: 400;
  }
}
</style>