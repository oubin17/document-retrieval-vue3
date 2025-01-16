import { defineStore } from 'pinia'
import { ref, reactive } from 'vue';

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useSearchStore = defineStore('searchResult', {
  state: () => ({
    orgId: '',
    keyword: '',
    searchType: '1',
    dataSource: ref([]), // 使用 ref 管理数组
  }),
  actions: {
    initDataSource (payload) {
      this.dataSource = payload
    },
    initOrgId (payload) {
      this.orgId = payload
    },
    initSearchCondition (keyword, searchType) {
      this.keyword = keyword
      this.searchType = searchType
    }
  },

})