import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IndexDBWrapper } from './utils/indexdb'

import './api/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.

const db = new IndexDBWrapper('calendar', 1)
const app = createApp(App)
app.use(router)
app.provide('db', db)

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
