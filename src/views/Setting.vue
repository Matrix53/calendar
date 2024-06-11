<template>
  <div class="setting-container">
    <n-form
      :style="{
        maxWidth: '500px',
      }"
      :model="formValue"
    >
      <n-form-item label="API域名" path="url">
        <n-input
          placeholder="例如: https://api.openai.com"
          v-model:value="formValue.url"
        />
      </n-form-item>
      <n-form-item label="API密钥" path="key">
        <n-input placeholder="您的API密钥" v-model:value="formValue.key" />
      </n-form-item>
      <n-form-item label="暗黑模式" path="dark">
        <n-switch v-model:value="formValue.dark" />
      </n-form-item>
    </n-form>
    <n-button type="primary" @click="handleSave">保存设置</n-button>
    <n-button
      :style="{
        marginLeft: '15px',
      }"
      @click="handleCheckUpdate"
      >检查更新</n-button
    >
  </div>
</template>

<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  useMessage,
  NSwitch,
} from 'naive-ui'
import { ref, onBeforeMount, inject } from 'vue'

const formValue = ref({
  url: '',
  key: '',
  dark: false,
})
const message = useMessage()
const whiteTheme = inject<CallableFunction>('whiteTheme')
const darkTheme = inject<CallableFunction>('darkTheme')

function handleSave() {
  localStorage.setItem('setting', JSON.stringify(formValue.value))
  if (formValue.value.dark) {
    if (darkTheme) darkTheme()
  } else {
    if (whiteTheme) whiteTheme()
  }
  message.success('保存成功')
}
function handleCheckUpdate() {
  console.log('check update')
}

onBeforeMount(() => {
  const setting = localStorage.getItem('setting')
  if (setting) {
    Object.assign(formValue.value, JSON.parse(setting))
  }
})
</script>

<style scoped>
.setting-container {
  box-sizing: border-box;
  padding: 20px;
}
</style>
