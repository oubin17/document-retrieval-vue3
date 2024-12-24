import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '../views/Main.vue'
import Search from '../views/search/Search.vue'
import Manager from '../views/manager/Manager.vue'

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
  },
  {
    path: "/manager",
    component: Manager,
    name: 'manager'
  }
]

const router = createRouter({
  //路由数据
  routes,
  //路由匹配模式
  history: createWebHashHistory()
})
export default router