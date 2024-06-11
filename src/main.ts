import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './api/ipc'
import { db } from './utils/db'

// add timer for web notification
async function addTodoTimer() {
  // get todos
  let now = new Date().getTime()
  let nowPlusADay = new Date(now + 24 * 60 * 60 * 1000).getTime()
  let todos = await db.todos
    .where('remindTime')
    .between(now, nowPlusADay)
    .toArray()
  // set timer for web notification
  todos.forEach((todo) => {
    let timer = todo.remindTime! - new Date().getTime()
    if (timer < 0 || localStorage.getItem(`${todo.id}`)) return
    let timeoutID = setTimeout(() => {
      new Notification('您有一个日程需要处理', {
        body: todo.name,
        requireInteraction: true,
        icon: '/icon.ico',
      })
      if (localStorage.getItem(`${todo.id}`)) {
        localStorage.removeItem(`${todo.id}`)
      }
    }, timer)
    // save timeoutID
    localStorage.setItem(`${todo.id}`, `${timeoutID},${todo.remindTime}`)
  })
  // clear outdated notification in localStorge
  let keys = Object.keys(localStorage)
  keys.forEach((key) => {
    let value = localStorage.getItem(key)!.split(',')
    let timeoutID = parseInt(value[0])
    let remindTime = parseInt(value[1])
    if (remindTime < new Date().getTime()) {
      clearTimeout(timeoutID)
      localStorage.removeItem(key)
    }
  })
}
// run addTodoTimer every 23 hours
addTodoTimer()
setInterval(addTodoTimer, 23 * 60 * 60 * 1000)

// add hooks to db when update todos
db.todos.hook('creating', function (primKey, obj, transaction) {
  // You may do additional database operations using given transaction object.
  // You may also modify given obj
  // You may set this.onsuccess = function (primKey){}. Called when autoincremented key is known.
  // You may set this.onerror = callback if create operation fails.
  // If returning any value other than undefined, the returned value will be used as primary key
  this.onsuccess = function (primKey) {
    if (!obj.remindTime) return
    let timer = obj.remindTime - new Date().getTime()
    if (timer < 0) return
    let timeoutID = setTimeout(() => {
      new Notification('您有一个日程需要处理', {
        body: obj.name,
        requireInteraction: true,
        icon: '/icon.ico',
      })
      if (localStorage.getItem(`${primKey}`)) {
        localStorage.removeItem(`${primKey}`)
      }
    }, timer)
    localStorage.setItem(`${primKey}`, `${timeoutID},${obj.remindTime}`)
  }
})
db.todos.hook('updating', function (modifications, primKey, obj, transaction) {
  // You may use transaction to do additional database operations.
  // You may not do any modifications on any of the given arguments.
  // You may set this.onsuccess = function (updatedObj){} when update operation completes.
  // You may set this.onerror = callback if update operation fails.
  // If you want to make additional modifications,
  // return another modifications object
  // containing the additional or overridden modifications to make. Any returned
  // object will be merged to the given modifications object.
  this.onsuccess = function (updatedObj) {
    if (!updatedObj.remindTime) return
    let timer = updatedObj.remindTime - new Date().getTime()
    if (timer < 0) return
    let value = localStorage.getItem(`${primKey}`)
    if (value) {
      let timeoutID = parseInt(value.split(',')[0])
      clearTimeout(timeoutID)
    }
    let newTimeoutID = setTimeout(() => {
      new Notification('您有一个日程需要处理', {
        body: updatedObj.name,
        requireInteraction: true,
        icon: '/icon.ico',
      })
      if (localStorage.getItem(`${primKey}`)) {
        localStorage.removeItem(`${primKey}`)
      }
    }, timer)
    localStorage.setItem(
      `${primKey}`,
      `${newTimeoutID},${updatedObj.remindTime}`
    )
  }
})
db.todos.hook('deleting', function (primKey, obj, transaction) {
  // You may do additional database operations using given transaction object.
  // You may set this.onsuccess = callback when delete operation completes.
  // You may set this.onerror = callback if delete operation fails.
  // Any modification to obj is ignored.
  // Any return value is ignored.
  // throwing exception will make the db operation fail.
  this.onsuccess = function () {
    let value = localStorage.getItem(`${primKey}`)
    if (!value) return
    let timeoutID = parseInt(value.split(',')[0])
    clearTimeout(timeoutID)
    localStorage.removeItem(`${primKey}`)
  }
})

// create app
const app = createApp(App)
app.use(router)
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
