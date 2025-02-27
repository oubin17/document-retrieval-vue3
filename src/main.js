import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)

//el标签全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//路由守卫，如果没有token，不允许进入
router.beforeEach((to, from) => {
  const odkToken = localStorage.getItem('document-retrieval-token')
  //非登录，注册页面token不存在
  if (!odkToken && to.path == '/manager') {
    return '/login'
  }


  // if (!odkToken && to.path !== '/login') {
  //   return '/'
  // }
  // else if (!odkToken && to.path == '/manager') {
  //   return '/login'
  // }
  // else if (odkToken && to.path === '/login') {
  //   return '/manager'
  // } else {
  //   return true
  // }
})


//路由挂载
app.use(router)
//存储
app.use(createPinia())
app.mount('#app')
