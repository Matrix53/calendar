<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-modal-provider>
        <div class="app-container">
          <n-layout has-sider position="absolute">
            <n-layout-sider width="150px" bordered>
              <n-menu :options="menuOptions" />
            </n-layout-sider>
            <n-layout-content>
              <router-view />
            </n-layout-content>
          </n-layout>
        </div>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NMenu,
  NIcon,
  NMessageProvider,
  NModalProvider,
  NConfigProvider,
  zhCN,
  dateZhCN,
} from 'naive-ui'
import { h, Component } from 'vue'
import type { MenuOption } from 'naive-ui'
import {
  CalendarNumberOutline as CalendarIcon,
  ListCircleOutline as TodoIcon,
  SettingsOutline as SettingIcon,
} from '@vicons/ionicons5'
import { RouterLink, RouterView } from 'vue-router'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
function renderLabel(label: string, name: string) {
  return () => h(RouterLink, { to: { name } }, { default: () => label })
}

const menuOptions: MenuOption[] = [
  {
    label: renderLabel('日历', 'Calendar'),
    key: 'calendar',
    icon: renderIcon(CalendarIcon),
  },
  {
    label: renderLabel('日程', 'Todo'),
    key: 'todo',
    icon: renderIcon(TodoIcon),
  },
  {
    label: renderLabel('设置', 'Setting'),
    key: 'setting',
    icon: renderIcon(SettingIcon),
  },
]
</script>

<style scoped></style>
