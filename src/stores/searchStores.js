import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useSearchStore = defineStore('searchResult', {
  state: () => ({
    orgId: '',
    keyword: '',
    searchType: '1',
    dataSource: [], // state 中的变量默认是 响应式 的。你可以直接访问这些变量，Vue 会自动追踪它们的变化并更新视图。
  }),
  actions: {

  },

})