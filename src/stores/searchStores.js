import { defineStore } from 'pinia'
import { reactive } from 'vue';

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useSearchStore = defineStore('search', {
  state: () => reactive({

    pageNo: 0,
    pageSize: 10,

    count: 0,
    pageList: ''
  }),
  actions: {
    initMethod (payload) {
      this.count = payload.count
      this.pageList = payload.pageList
    }
  },
  // return: () => {
  //   state, actions
  // }

})