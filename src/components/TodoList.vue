<template>
  <div class="todolist-container">
    <n-empty
      v-if="todos.length === 0"
      description="当日暂无日程"
      size="huge"
      :style="{ marginTop: '58%' }"
    />
    <n-list hoverable clickable v-else bordered>
      <n-list-item v-for="todo in todos" :key="todo.id">
        <div @click="handleUpdate($event, todo.id)">
          <n-thing>
            <template #header>{{ todo.name }}</template>
            <template #header-extra>
              <n-button
                quaternary
                circle
                @click="handleDelete($event, todo.id)"
              >
                <template #icon>
                  <close-icon />
                </template>
              </n-button>
            </template>
            <template #description>
              <n-space size="small" vertical>
                <n-tag type="info" size="small" round
                  >日程时间：{{ timeToText(todo.time) }}</n-tag
                >
                <n-tag type="warning" size="small" round
                  >提醒时间：{{
                    todo.remindTime ? timeToText(todo.remindTime) : '不提醒'
                  }}</n-tag
                >
              </n-space>
            </template>
            {{ todo.description }}
          </n-thing>
        </div>
      </n-list-item>
    </n-list>
    <update-todo ref="updateTodoRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { db } from '../utils/db'
import {
  NEmpty,
  NList,
  NThing,
  NListItem,
  NSpace,
  NTag,
  NButton,
  useMessage,
} from 'naive-ui'
import { useDexieLiveQueryWithDeps } from '../hooks/useDexieLiveQuery'
import { format } from 'date-fns'
import { CloseOutline as CloseIcon } from '@vicons/ionicons5'
import UpdateTodo from './UpdateTodo.vue'

const props = defineProps<{
  time: number
}>()
const dateID = computed(() => {
  let date = new Date(props.time)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
})
const message = useMessage()
const todos = useDexieLiveQueryWithDeps(
  dateID,
  (dateID: string) => db.todos.where('date').equals(dateID).toArray(),
  { initialValue: [] }
)
const updateTodoRef = ref<InstanceType<typeof UpdateTodo> | null>(null)

function timeToText(time: number) {
  return format(new Date(time), 'yy/MM/dd HH:mm:ss')
}
async function handleDelete(event: MouseEvent, id: number) {
  event.stopPropagation()
  await db.todos.delete(id)
  message.success('已删除这个日程')
}
async function handleUpdate(event: MouseEvent, id: number) {
  event.stopPropagation()
  updateTodoRef.value?.showDialog(undefined, id)
}
</script>

<style scoped>
.todolist-container {
  max-height: 690px;
  overflow-y: auto;
  margin-top: 10px;
}
/* 滚动条整体部分 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 3px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 3px;
}
/* 滚动条滑块鼠标悬浮样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: #888;
}
</style>
