import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue'),
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue'),
  },
  {
    path: '/todo',
    name: 'Todo',
    component: () => import('../views/Todo.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
