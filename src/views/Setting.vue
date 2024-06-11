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
import { NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'
import { ref, onBeforeMount } from 'vue'

const formValue = ref({
  url: '',
  key: '',
})
const message = useMessage()

function handleSave() {
  localStorage.setItem('api', JSON.stringify(formValue.value))
  message.success('保存成功')
}
function handleCheckUpdate() {
  console.log('check update')
}

onBeforeMount(() => {
  const api = localStorage.getItem('api')
  if (api) {
    Object.assign(formValue.value, JSON.parse(api))
  }
})
</script>

<style scoped>
.setting-container {
  box-sizing: border-box;
  padding: 20px;
}
</style>
