<template>
  <n-grid :cols="20">
    <n-gi :span="13">
      <div class="calendar-container">
        <n-calendar
          v-model:value="value"
          #="{ year, month, date }"
          @update:value="handleUpdateValue"
        >
          <calendar-item :year="year" :month="month" :date="date" />
        </n-calendar>
      </div>
    </n-gi>
    <n-gi :span="7">
      <div class="todo-container">
        <n-grid :cols="20">
          <n-gi :span="9">
            <span class="todo-title">日程</span>
          </n-gi>
          <n-gi :span="7">
            <n-date-picker v-model:value="value" size="small" />
          </n-gi>
          <n-gi :span="4">
            <n-button
              size="small"
              dashed
              :style="{ marginLeft: '10px' }"
              @click="handleAddTodo"
              >添加</n-button
            >
          </n-gi>
        </n-grid>
      </div>
    </n-gi>
  </n-grid>
  <update-todo v-model:show="showAddTodo" />
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import {
  useMessage,
  NCalendar,
  NGrid,
  NGi,
  NDatePicker,
  NButton,
} from 'naive-ui'
import { addDays } from 'date-fns/esm'
import { IndexDBWrapper } from '../utils/indexdb'
import CalendarItem from '../components/CalendarItem.vue'
import UpdateTodo from '../components/UpdateTodo.vue'
const message = useMessage()
const db = inject<IndexDBWrapper>('db')!
const value = ref(addDays(Date.now(), 1).valueOf())
const showAddTodo = ref(false)

function handleUpdateValue(
  _: number,
  { year, month, date }: { year: number; month: number; date: number }
) {
  message.success(`${year}-${month}-${date}`)
}

function handleAddTodo() {
  showAddTodo.value = true
}
</script>

<style scoped>
.calendar-container {
  display: flex;
  justify-content: center;
  padding: 25px 0px 0px 0px;
}
.todo-title {
  font-family: v-sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  color: rgb(31, 34, 37);
  font-size: 22px;
  font-weight: 500;
  text-size-adjust: 100%;
  line-height: 22px;
}
.todo-container {
  padding-top: 25px;
  padding-left: 20px;
  border-left: 1px solid rgb(231, 232, 235);
  height: 100%;
  box-sizing: border-box;
}
</style>
