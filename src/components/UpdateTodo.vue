<template>
  <n-modal
    v-model:show="show"
    preset="card"
    title="编辑日程"
    :segmented="{ content: 'soft', footer: 'soft' }"
    :style="{ width: '500px' }"
  >
    <n-form :model="formValue" :rules="rules" ref="formRef">
      <n-form-item label="日程名称" path="name">
        <n-input v-model:value="formValue.name" placeholder="请输入日程名称" />
      </n-form-item>
      <n-form-item label="日程描述" path="description">
        <n-input
          type="textarea"
          v-model:value="formValue.description"
          placeholder="请输入日程描述"
        />
      </n-form-item>
      <n-form-item label="日程时间" path="time">
        <n-date-picker type="datetime" v-model:value="formValue.time" />
      </n-form-item>
      <n-form-item label="提醒时间" path="remindTime">
        <n-date-picker
          type="datetime"
          v-model:value="formValue.remindTime"
          clearable
        />
      </n-form-item>
    </n-form>
    <template #footer>
      <div class="footer">
        <n-button type="primary" @click="handleConfirm">确定</n-button>
        <n-button @click="handleCancel">取消</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NModal,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NDatePicker,
  FormInst,
  useMessage,
  FormRules,
} from 'naive-ui'
import { ref, onBeforeMount } from 'vue'
import type { Ref } from 'vue'
import { db } from '../utils/db'

const show = defineModel('show', { type: Boolean, default: false })
const props = defineProps<{
  time?: number
  todoID?: number
}>()
const message = useMessage()

const formValue: Ref<{
  name: string
  description: string
  time: number | undefined
  remindTime: number | undefined
}> = ref({
  name: '',
  description: '',
  time: undefined,
  remindTime: undefined,
})
const rules: FormRules = {
  name: [{ required: true, message: '请输入日程名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入日程描述', trigger: 'blur' }],
  time: [
    {
      type: 'number',
      required: true,
      message: '请选择日程时间',
      trigger: ['blur', 'change'],
    },
  ],
}
const formRef = ref<FormInst | null>(null)

function handleCancel() {
  show.value = false
}

function handleConfirm(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      let date = new Date(formValue.value.time!)
      let dateID = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      if (props.todoID) {
        await db.todos.update(props.todoID, formValue.value)
      } else {
        await db.todos.add({
          ...formValue.value,
          date: dateID,
          time: formValue.value.time!,
        })
      }
      show.value = false
      formValue.value = {
        name: '',
        description: '',
        time: undefined,
        remindTime: undefined,
      }
      message.success('已更新日程')
    } else {
      message.error('请检查必填项')
    }
  })
}

onBeforeMount(async () => {
  if (props.time) {
    formValue.value.time = props.time
  }
  if (props.todoID) {
    let todo = await db.todos.get(props.todoID)
    if (!todo) {
      message.error('未找到该日程')
      return
    }
    formValue.value = {
      name: todo.name,
      description: todo.description,
      time: todo.time,
      remindTime: todo.remindTime,
    }
  }
})
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
