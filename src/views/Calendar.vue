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
        <n-grid :cols="24">
          <n-gi :span="10">
            <span class="todo-title">日程</span>
          </n-gi>
          <n-gi :span="10">
            <n-date-picker v-model:value="value" size="small" />
          </n-gi>
          <n-gi :span="4">
            <n-button
              size="small"
              type="primary"
              :style="{ marginLeft: '10px' }"
              @click="handleAddTodo"
              >添加</n-button
            >
          </n-gi>
        </n-grid>
        <todo-list :time="value" />
      </div>
    </n-gi>
  </n-grid>
  <update-todo v-model:show="showAddTodo" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  useMessage,
  NCalendar,
  NGrid,
  NGi,
  NDatePicker,
  NButton,
} from 'naive-ui'
import CalendarItem from '../components/CalendarItem.vue'
import UpdateTodo from '../components/UpdateTodo.vue'
import TodoList from '../components/TodoList.vue'

const message = useMessage()
const value = ref(Date.now().valueOf())
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
  padding-right: 20px;
  border-left: 1px solid rgb(231, 232, 235);
  height: 100%;
  box-sizing: border-box;
}
</style>
