<template>

  <el-card class="custom-card">

    <div class="title">
      <el-text class="text-title">搜索一下，你就知道</el-text>
    </div>

    <el-form ref="formRef" :model="formData">
      <el-form-item>
        <div class="input">
          <el-input class="search" v-model="formData.inputValue" placeholder="请输入关键字查找" clearable />
          <el-button class="submit"  @click="confirm(formRef)" >搜索</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="footer">
      <ul class="footer-ul">
        <li>关键字：</li>
        <li>123</li>
        <li>123</li>
        <li>......</li>
      </ul>
    </div>
  </el-card>

  <div>


  </div>



</template>

<script setup>
import { ref, reactive } from 'vue'
const formRef = ref()

const formData = reactive({
  inputValue: ""
})

//表单提交
const confirm = async (formEl) => {
  if (!formEl) return
  //手动触发表单校验
  if(formData.inputValue === '') {
    ElMessage.error('请输入查找关键字')
  }

}


</script>

<style lang="less" scoped>
.custom-card {
  border: none;
  /* 去掉边框 */
  box-shadow: none;
  /* 去掉阴影 */
}

.title {
  display: block;
  text-align: center;
  height: 58px;
  opacity: 1;
  margin: 0 auto;
  margin-top: 198px;

  .text-title {
    /** 文本1 */
    font-size: 40px;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 57.92px;
    color: rgba(0, 0, 0, 1);
  }
}

.input {
  display: flex;
  margin: 0 auto;
  margin-top: 31px;
  width: 758px;
  height: 58px;
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

.footer {
  display: flex;
  justify-content: center; // 水平方向居中
  padding: 20px 0; // 可选：上下内边距

  .footer-ul {
    display: flex;

    li {
      padding: 0 10px;
      font-size: 14px;
      color: #A6A6A6;
      white-space: nowrap; // 防止文字换行
    }

  }
}
</style>