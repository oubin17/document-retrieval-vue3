<template>

  <RouterView />
  <div>
    <h1>{{ title }}</h1>
    <p>当前环境：{{ mode }}</p>
    <p>API地址：{{ apiUrl }}</p>
    <p>版本号：{{ version }}</p>
  </div>
</template>

<script setup>
const title = import.meta.env.VITE_APP_TITLE
const mode = import.meta.env.VITE_MODE
const apiUrl = import.meta.env.VITE_API_URL
const version = import.meta.env.VITE_APP_VERSION
</script>

<style lang="less" scoped></style>