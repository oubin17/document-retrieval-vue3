import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    appTitle: import.meta.env.VITE_APP_TITLE,
    apiUrl: import.meta.env.VITE_API_URL,
    mode: import.meta.env.VITE_MODE,
    version: import.meta.env.VITE_APP_VERSION
  }),
  getters: {
    isProduction: (state) => state.mode === 'production',
    isDevelopment: (state) => state.mode === 'development'
  }
}) 