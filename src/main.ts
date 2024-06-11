import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './api/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.

const app = createApp(App)
app.use(router)
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
