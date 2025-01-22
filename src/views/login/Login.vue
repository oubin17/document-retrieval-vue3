<template>

  <el-row class="login-container " justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <!-- <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template> -->

      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="账号">
          <el-input v-model="form.loginId" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.identifyValue" type="password" placeholder="密码" :prefix-icon="Lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button @click="cancel">重置</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </el-row>


</template>

<script setup>
import { reactive } from 'vue'

import { userLogin, userPermission } from '@/api'
//需要引入字体图标库，否则不展示
import { Lock } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

import { useSearchStore } from '@/stores/searchStores'

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

  //登录页面
  userLogin(form).then(({ data }) => {
    if (data.success === true) {
      //保存token和用户信息
      localStorage.setItem('odk-token', data.data.token)
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
:deep(.el-card__header) {
  padding: 0;
}

.login-container {
  height: 100%;

  .card-header {
    background-color: #899fe1;

    img {
      width: 480px;
      height: 200px;
    }
  }

  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>