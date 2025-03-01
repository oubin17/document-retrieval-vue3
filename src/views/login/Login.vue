<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card class="login-card">
      <div class="login-header">
        <h2>系统登录</h2>
        <p class="welcome-text">欢迎回来，请登录您的账号</p>
      </div>

      <el-form :model="form" label-width="0" class="login-form">
        <el-form-item>
          <el-input v-model="form.loginId" placeholder="请输入账号" :prefix-icon="User" size="large" />
        </el-form-item>

        <el-form-item>
          <el-input v-model="form.identifyValue" type="password" placeholder="请输入密码" :prefix-icon="Lock" size="large"
            show-password />
        </el-form-item>

        <el-form-item class="login-buttons">
          <el-button type="primary" @click="onSubmit" size="large" class="submit-btn">登录</el-button>
          <el-button @click="cancel" size="large" class="reset-btn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { reactive } from 'vue'

import { userLogin, userPermission } from '@/api'
//需要引入字体图标库，否则不展示
import { Lock, User } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

import { useSearchStore } from '@/stores/searchStores'

import { encrypt } from '@/utils/crypto'

const searchStore = useSearchStore();

// do not use same name with ref
const form = reactive({
  loginId: '',
  loginType: '1',
  userName: '',
  identifyType: '1',
  identifyValue: ''
})
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href

const router = useRouter()
const onSubmit = () => {

  const encryptedForm = {
    ...form,
    identifyValue: encrypt(form.identifyValue)
  }
  console.log(encryptedForm, "form")

  //登录页面
  userLogin(encryptedForm).then(({ data }) => {
    if (data.success === true) {
      //保存token和用户信息
      localStorage.setItem('document-retrieval-token', data.data.token)
      //这里需要序列化，转成字符串
      const userInfo = data.data

      userPermission().then((response) => {
        userInfo.roles = response.data.data.roles
        localStorage.setItem('userInfo', JSON.stringify(data.data))

        const isAdmin = response.data.data.roles.find(item => item.roleCode === 'ADMIN')
        if (isAdmin) {
          router.push('/backend')
        } else {
          router.push('/')
        }
        ElMessage.success('登录成功')
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
const cancel = () => {
  form.loginId = ''
  form.identifyValue = ''
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .login-card {
    width: 400px;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

    .login-header {
      text-align: center;
      margin-bottom: 30px;

      h2 {
        font-size: 24px;
        color: #303133;
        margin-bottom: 10px;
      }

      .welcome-text {
        color: #909399;
        font-size: 14px;
      }
    }

    .login-form {
      padding: 0 20px;

      //改组件内部的样式
      :deep(.el-input) {
        .el-input__wrapper {
          border-radius: 8px;
          height: 45px;
        }
      }

      .login-buttons {
        margin-top: 30px;
        display: flex; // 添加 flex 布局
        justify-content: space-between; // 两个按钮之间自动分配空间
        // gap: 20px; // 使用 gap 设置按钮之间的间距
        // padding: 0; // 移除内边距
        // margin-bottom: 0; // 移除底部外边距

        .submit-btn,
        .reset-btn {
          flex: 1;
          width: 45%;
          height: 45px;
          border-radius: 8px;
          font-size: 16px;
        }

        .submit-btn {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border: none;

          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
  }
}
</style>