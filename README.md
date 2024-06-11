# calendar

🥳 Really simple calendar.

## 系统设计

### 项目结构

Electron(跨平台) + Vue3(前端) + Vite(打包，HMR) + Naive UI(组件库) + IndexDB(本地存储) + TypeScript(类型检查)

### 代码要点

1. 重写 win.webContents.session.webRequest，使得渲染进程可以取消跨域约束
2. 使用 Electron 的 Tray 模块，使得最小化到托盘可行
3. 暴露 ipcRenderer 的 invoke,on 方法，使得渲染进程可以和主进程通信
4. 配置 electron-builder，打包成可执行文件
5. 使用 IndexDB 作为本地存储，存储日程数据，使用 table hook 实现了开销尽可能小的日程提醒
6. 实现 useDexieLiveQuery，使得 IndexDB 数据变化时，自动更新组件
7. 使用在线数据进行节假日的更新，实现了中国本地节假日的显示

## Credits

Template is from [here](https://github.com/electron-vite/electron-vite-vue)
