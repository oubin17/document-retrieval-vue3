import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from '../views/Main.vue'
import Search from '../views/search/Search.vue'
import Manager from '../views/manager/Manager.vue'
import Login from '../views/login/Login.vue'
import Backend from '../views/backend/Backend.vue'

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
    path: "/login",
    component: Login,
    name: 'login'
  },

  {
    path: "/manager",
    component: Manager,
    name: 'manager'
  },
  {
    path: "/backend",
    component: Backend,
    name: 'backend'
  },
]

const router = createRouter({
  //路由数据
  routes,
  //路由匹配模式
  history: createWebHashHistory('/' + import.meta.env.VITE_APP_NAME + '/')
})
export default router