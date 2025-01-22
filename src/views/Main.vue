<template>

  <div class="search-container">
    <SearchComponent keyword="" searchType="1" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/searchStores'
import SearchComponent from '@/components/SearchComponent.vue'

const searchStore = useSearchStore();

const router = useRouter()


</script>

<style lang="less" scoped>
.search-container {
  margin-top: 198px;
}
</style>