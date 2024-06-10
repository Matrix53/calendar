<template>
  <div class="citem-container">
    <div class="citem-name">
      {{ holiday ? holiday : solarTerm ? solarTerm : lunarDate }}
      <n-tag v-if="isHoliday" type="info" size="small">休</n-tag>
      <n-tag v-if="isWeekend && !isHoliday" type="error" size="small">班</n-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import chineseDays from 'chinese-days'
import { NTag } from 'naive-ui'

const props = defineProps<{
  year: number
  month: number
  date: number
}>()

const isHoliday = computed(() => {
  return chineseDays.isHoliday(`${props.year}-${props.month}-${props.date}`)
})
const isWeekend = computed(() => {
  let day = new Date(`${props.year}-${props.month}-${props.date}`).getDay()
  return day === 0 || day === 6
})
const solarTerm = computed(() => {
  let item = chineseDays.getSolarTermsInRange(
    `${props.year}-${props.month}-${props.date}`
  )[0]
  if (item.index === 1) {
    return item.name
  }
  return ''
})
const lunarDate = computed(() => {
  return chineseDays.getLunarDate(`${props.year}-${props.month}-${props.date}`)
    .lunarDayCN
})
const holiday = computed(() => {
  if (isHoliday.value) {
    return chineseDays
      .getDayDetail(`${props.year}-${props.month}-${props.date}`)
      .name.split(',')[1]
  }
  return ''
})
</script>

<style scoped>
.citem-container {
  width: 75px;
}
.citem-name {
  display: flex;
  justify-content: space-between;
}
</style>
