<template>
  <div class="todolist-container">
    <n-empty
      v-if="todos.length === 0"
      description="当日暂无日程"
      size="huge"
      :style="{ marginTop: '60%' }"
    />
    <div v-else>
      <div v-for="todo in todos" :key="todo.id">
        {{ todo.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { db } from '../utils/db'
import { NEmpty } from 'naive-ui'
import { useDexieLiveQueryWithDeps } from '../hooks/useDexieLiveQuery'

const props = defineProps<{
  time: number
}>()
const dateID = computed(() => {
  let date = new Date(props.time)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
})

const todos = useDexieLiveQueryWithDeps(
  dateID,
  (dateID: string) => db.todos.where('date').equals(dateID).toArray(),
  { initialValue: [] }
)
</script>

<style scoped></style>
