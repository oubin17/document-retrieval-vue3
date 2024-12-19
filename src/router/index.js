import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '../views/Main.vue'
import Search from '../views/search/Search.vue'

const routes = [
  {
    path: "/",
    component: HomePage,
    name: 'homepage'
  },
  {
    path: "/search",
    component: Search,
    name: 'search'
  }
]

const router = createRouter({
  //路由数据
  routes,
  //路由匹配模式
  history: createWebHashHistory()
})
export default router