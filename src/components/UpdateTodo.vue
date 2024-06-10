<template>
  <n-modal
    v-model:show="show"
    preset="card"
    title="编辑日程"
    :segmented="{ content: 'soft', footer: 'soft' }"
    :style="{ width: '500px' }"
  >
    内容
    <template #footer>
      <div class="footer">
        <n-button type="primary">确定</n-button>
        <n-button>取消</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NButton } from 'naive-ui'

const show = defineModel('show', { type: Boolean, default: false })
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
