import { app, BrowserWindow, shell, ipcMain, Menu, Tray } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Set the application menu
Menu.setApplicationMenu(null)

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: '日历',
    width: 1250,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  // enable cross origin
  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      delete details.requestHeaders['Origin']
      callback({ requestHeaders: { ...details.requestHeaders, origin: '*' } })
    }
  )
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    if (details.responseHeaders) {
      delete details.responseHeaders['Access-Control-Allow-Origin']
      delete details.responseHeaders['Access-Control-Allow-Headers']
    }
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'access-control-allow-origin': '*',
        'access-control-allow-headers':
          'Origin,Content-Length,Content-Type,x-token',
      },
    })
  })

  if (VITE_DEV_SERVER_URL) {
    // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  win.on('close', (event) => {
    event.preventDefault() // 阻止默认的关闭行为
    win.hide() // 隐藏主窗口
    return false
  })
}

let tray = null
app
  .whenReady()
  .then(createWindow)
  .then(() => {
    tray = new Tray(path.join(process.env.VITE_PUBLIC, 'icon.png'))
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '打开主面板',
        click: () => {
          win.show()
        },
      },
      {
        label: '退出',
        click: () => {
          app.exit()
        },
      },
    ])
    tray.setToolTip('日历')
    tray.setContextMenu(contextMenu)
    tray.on('double-click', () => {
      win.show()
    })
  })

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
