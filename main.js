// 此模块控制应用的声明周期并创建原生的浏览窗口
const {app, BrowserWindow, Menu, MenuItem, globalShortcut, ipcMain, systemPreferences} = require('electron')
const path = require('path')

// 持久化一个全局的 window 对象的引用，如果不这样，在 JavaScript 进行垃圾回收时 window 将会自动关闭
let mainWindow

function showMain () {
  // 创建一个浏览窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // offscreen: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载 index.html 文件
  mainWindow.loadFile('index.html')

  // 添加一个文件到最近文件列表
  app.addRecentDocument('/Users/mac/Documents/jiayufeng/electron/test/README.md')

  // 设置任务栏进度条
  let progressCtrl = 0
  !(() => {
    let progress = 0
    progressCtrl = setInterval(() => {
      if (progress > 1) {
        progress = 0
      }
      progress += 0.01
      mainWindow.setProgressBar(progress)
    }, 10)
  })()

  // 自定义 Dock
  const dockMenu = Menu.buildFromTemplate([
    {
      label: 'New Window',
      click () { console.log('New Window') }
    }, {
      label: 'New Window with Settings',
      submenu: [
        { label: 'Basic' },
        { label: 'Pro' }
      ]
    },
    { label: 'New Command...' }
  ])
  app.dock.setMenu(dockMenu)

  // 自定义快捷键
  const menu = new Menu()
  // 本地快捷键
  menu.append(new MenuItem({
    label: 'Print',
    accelerator: 'Alt+Cmd+I',
    click: () => { console.log('time to print stuff') }
  }))
  // 全局快捷键
  globalShortcut.register('CommandOrControl+X', () => {
    console.log('CommandOrControl+X is pressed')
  })

  // 在 macOS，一个窗口可以设置它展示的文件，文件的图标可以出现在标题栏，当用户 Command-Click 或者 Control-Click 标题栏，文件路径弹窗将会出现
  mainWindow.setRepresentedFilename('/etc/passwd')
  mainWindow.setDocumentEdited(true)

  // 打开开发者工具
  mainWindow.webContents.openDevTools()

  // window 关闭时触发
  mainWindow.on('closed', () => {
    // 将 window 对象的引用置空，如果你的应用程序支持多个窗口，通常会将窗口存储在数组中
    // 这个事件就是你应该删除相应元素的时间
    mainWindow = null
    clearInterval(progressCtrl)
  })
}

// 在线/离线事件探测，js 脚本需要加入到预置页面中，通过 ipcMain 进行主进程和窗口进程的通信
ipcMain.on('online-status-changed', (event, status) => {
  console.log(status)
})

ipcMain.on('screen-paint', (event) => {
  // 离屏渲染
  mainWindow.loadURL('http://github.com')
  mainWindow.webContents.on('paint', (event, dirty, image) => {
    // updateBitmap(dirty, image.getBitmap())
  })
  mainWindow.webContents.setFrameRate(30)
})

// 当 Electron 完成初始化并准备创建浏览窗口时触发此方法
// 某些 API 只有在此事件触发后才可使用
app.on('ready', showMain)

// 当所有的窗口都关闭时触发
app.on('window-all-closed', () => {
  // mac 上应用程序及其菜单栏通常保持活跃状态，直到用户使用 cmd+Q 明确退出为止
  if (process.platform !== 'darwin') app.quit()
})

// 应用程序激活时触发
app.on('activate', () => {
  // 在macOS上，通常会在单击停靠图标且没有其他窗口打开时在应用程序中重新创建一个窗口
  console.log('activate')
  if (mainWindow === null) showMain()
})

// 从 "最近文档" 菜单中请求文件时, 将为其发出 app 模块的 open-file 事件
app.on('open-file', () => {
  // 清空最近文件列表
  console.log('open-file')
  app.clearRecentDocuments()
})

// 跟踪 mac 系统主题
systemPreferences.subscribeNotification(
  'AppleInterfaceThemeChangedNotification',
  function theThemeHasChanged () {
    updateMyAppTheme(systemPreferences.isDarkMode())
  }
)