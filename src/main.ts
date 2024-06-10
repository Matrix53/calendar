import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IndexDBWrapper } from './utils/indexdb'

import './api/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.

IndexDBWrapper.openDatabase('calendar', 1, 'todo').then((db) => {
  const app = createApp(App)
  app.use(router)
  app.provide('db', db)

  app.mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
})
