<template>
  <el-container>
    <el-header class="search-header">
      <el-text class="text-title">搜索一下</el-text>
      <el-form ref="formRef" :model="formData">
        <el-form-item>
          <div class="input">
            <el-input class="search" v-model="formData.keyword" placeholder="请输入关键字查找" clearable />
            <el-button class="submit" @click="confirm()">搜索</el-button>
          </div>
        </el-form-item>
      </el-form>

    </el-header>
    <el-container class="search-container">
      <el-aside width="1085px">

        <div v-for="item in searchResult.pageList" :key="item.id">
          <h2><el-link class="file-title">{{ item.fileName }}</el-link></h2>
          <div class="file-content">
            <span class="file-line">上传日期：{{ item.createTime }}</span>
            <span class="file-line">文件大小：{{ item.fileSize }}</span>
            <span class="file-line">创建人：管理员</span>
          </div>
          <hr class="file-hr">
        </div>

        <div class="pagination">
          <el-pagination background :hide-on-single-page="true" :page-size=formData.pageSize layout="prev, pager, next"
            :total=searchResult.count @current-change="handleCurrentChange" />
        </div>

      </el-aside>

      <el-main>
        <el-main class="main">
          <div class="main-title">
            <span>常用搜索</span>
            <el-icon style="vertical-align: middle;">
              <ArrowRight />
            </el-icon>
          </div>

          <div v-for="(item, index ) in commonSearchResult" :key="index">
            <span class="main-item">
              <span :style="{ color: colorList[index] }">{{ index + 1 }}</span> {{ item }}
            </span>
          </div>
        </el-main>
      </el-main>
    </el-container>
  </el-container>


</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { search, commonSearch } from '../../api'
import { useSearchStore } from '../../stores/searchStores'
import { ref, reactive, onMounted } from 'vue'

const searchStore = useSearchStore();
const route = useRoute()
const router = useRouter()

const formData = reactive({
  keyword: "",
  pageNo: 1,
  pageSize: 10
})
formData.keyword = route.query.keyword;

const searchResult = reactive({
  count: 0,
  pageList: ''
})

//右侧常用搜索返回值
const commonSearchResult = ref([])
const colorList = ['rgba(212, 48, 48, 1)', 'rgba(247, 67, 67, 1)', 'rgba(255, 195, 0, 1)']

//表单提交
const confirm = async () => {
  //手动触发表单校验
  if (formData.keyword === '') {
    ElMessage.error('请输入查找关键字')
    return;
  }
  //发送请求
  await search(formData).then((response) => {
    searchResult.count = response.data.data.count
    searchResult.pageList = response.data.data.pageList
  })
  // router.push({
  //   path: '/search',
  //   query: {
  //     keyword: formData.keyword
  //   }
  // })
}

//点击分页按钮触发,从1开始计数
const handleCurrentChange = (val) => {
  formData.pageNo = val
  confirm();
}

const commonSearchFunction = async () => {
  await commonSearch().then((response) => {
    commonSearchResult.value = response.data.data
  })
}

onMounted(() => {
  //发送请求
  confirm()
  //右侧常用搜索
  commonSearchFunction()
})

</script>

<style lang="less" scoped>
.search-header {
  height: 193px;
  display: flex;
  padding-top: 100px;
  padding-left: 102px;
  margin-bottom: 50px;

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

.search-container {
  padding-left: 130px;

  .file-title {
    color: #0088ff;
    font-size: 18px;
    line-height: 22px;
  }

  .file-content {
    text-align: right;
    line-height: 1.5;

    .file-line {
      display: block;
      margin-top: 2px;
      color: #A39E9E;
    }
  }

  .file-hr {
    border: 1px;
    border-top: 1px solid #A39E9E;
    /* 设置虚线分割线 */
    width: 100%;
    /* 设置分割线宽度 */
    margin: 20px auto;
    /* 设置上下间距，居中对齐 */
  }

  .pagination {
    display: flex;
    /* 水平居中 */
    justify-content: center;
    /* 垂直居中 */
    align-items: center;
  }
}

.main {
  margin-left: 35px;
  padding-left: 10px;
  border-left: 1px solid #A39E9E;

  .main-title {
    height: 26px;
    line-height: 100%;
    font-size: 20px;
  }

  .main-item {
    margin-left: 20px;
    font-size: 16px;
    display: block;
    margin-top: 15px;
    color: #A39E9E;
  }
}
</style>