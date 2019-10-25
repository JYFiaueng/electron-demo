// 此模块控制应用的声明周期并创建原生的浏览窗口
const {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  globalShortcut,
  ipcMain,
  systemPreferences,
  session,
  dialog,
  net,
  netLog
} = require('electron')
const electron = require('electron')
const path = require('path')

// 使用启动命令行方式翻墙
// app.commandLine.appendSwitch('proxy-pac-url', 'http://hq-static.oss-cn-beijing.aliyuncs.com/uskid-garden/uskid.pac')
app.commandLine.appendSwitch('remote-debugging-port', 10000)
app.commandLine.appendSwitch('lang', 'zh-cn')

// 持久化一个全局的 window 对象的引用，如果不这样，在 JavaScript 进行垃圾回收时 window 将会自动关闭
let mainWindow

process.env.GOOGLE_API_KEY = 'AIzaSyDWD4D7lOTUHZw7qeDZPMfA2G623kI6gmg'
process.env.GOOGLE_DEFAULT_CLIENT_SECRET = 'izwpPuDKWzJ4oomRde12348U'
process.env.GOOGLE_DEFAULT_CLIENT_ID = '917691297121-vvnmlea2pgptol17mqctcedjv61pqhuk.apps.googleusercontent.com'

function showMain() {

  console.log('ready')

  // 检索有关屏幕大小、显示器、光标位置等的信息
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  console.log('鼠标的绝对位置：', electron.screen.getCursorScreenPoint())

  // 创建一个浏览窗口
  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 设置 session 代理翻墙
  mainWindow.webContents.session.setProxy({
    pacScript: 'file://' + __dirname + '/pac.js',
    // proxyRules: 'socks5://g.kuomu.xyz:1443',
    // proxyRules: 'socks5://b.kuomu.xyz:1443',
  }, () => {
    mainWindow.loadURL('file://' + __dirname + '/index.html')
  })

  // 加载 index.html 文件
  // mainWindow.loadFile('index.html')

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
  const dockMenu = Menu.buildFromTemplate([{
      label: 'New Window',
      click() {
        console.log('New Window')
      }
    }, {
      label: 'New Window with Settings',
      submenu: [{
          label: 'Basic'
        },
        {
          label: 'Pro'
        }
      ]
    },
    {
      label: 'New Command...'
    }
  ])
  app.dock.setMenu(dockMenu)

  // 自定义快捷键
  const menu = new Menu()
  // 本地快捷键
  menu.append(new MenuItem({
    label: 'Print',
    accelerator: 'Alt+Cmd+I',
    click: () => {
      console.log('time to print stuff')
    }
  }))
  // 全局快捷键
  globalShortcut.register('CommandOrControl+Y', () => {
    console.log('CommandOrControl+Y is pressed')
  })
  const isMac = true
  const template = [
    // { role: 'appMenu' }
    ...(process.platform === 'darwin' ? [{
      label: app.getName(),
      submenu: [{
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services'
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        isMac ? {
          role: 'close'
        } : {
          role: 'quit'
        }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [{
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        ...(isMac ? [{
            role: 'pasteAndMatchStyle'
          },
          {
            role: 'delete'
          },
          {
            role: 'selectAll'
          },
          {
            type: 'separator'
          },
          {
            label: 'Speech',
            submenu: [{
                role: 'startspeaking'
              },
              {
                role: 'stopspeaking'
              }
            ]
          }
        ] : [{
            role: 'delete'
          },
          {
            type: 'separator'
          },
          {
            role: 'selectAll'
          }
        ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [{
          role: 'reload'
        },
        {
          role: 'forcereload'
        },
        {
          role: 'toggledevtools'
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [{
          role: 'minimize'
        },
        {
          role: 'zoom'
        },
        ...(isMac ? [{
            type: 'separator'
          },
          {
            role: 'front'
          },
          {
            type: 'separator'
          },
          {
            role: 'window'
          }
        ] : [{
          role: 'close'
        }])
      ]
    },
    {
      role: 'help',
      submenu: [{
        label: 'Learn More',
        click: async () => {
          const {
            shell
          } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }]
    }
  ]
  const tmpMenu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(tmpMenu)

  // 在 macOS，一个窗口可以设置它展示的文件，文件的图标可以出现在标题栏，当用户 Command-Click 或者 Control-Click 标题栏，文件路径弹窗将会出现
  mainWindow.setRepresentedFilename('/etc/passwd')
  mainWindow.setDocumentEdited(true)

  // 加载 Chrome 扩展程序
  // BrowserWindow.addDevToolsExtension('/Users/mac/Library/Application Support/Google/Chrome/Profile 1/Extensions/cgncbhnhlkbdieckbbmeppcefokppagh/1.18.11.13_0')

  // 是否为 mian 窗口
  console.log('main process.isMainFram: ', process.isMainFram)
  console.log(process.versions)
  console.log(process.getCreationTime())
  console.log(process.getSystemMemoryInfo())
  console.log(process.getSystemVersion())

  // 打开开发者工具
  mainWindow.webContents.openDevTools()

  // window 关闭时触发
  mainWindow.on('closed', () => {
    // 将 window 对象的引用置空，如果你的应用程序支持多个窗口，通常会将窗口存储在数组中
    // 这个事件就是你应该删除相应元素的时间
    mainWindow = null
    clearInterval(progressCtrl)
  })

  // 网络模块
  const request = net.request('https://github.com')
  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  request.end()

  // 电源监视器模块
  electron.powerMonitor.on('suspend', () => console.log('suspend')) // 系统挂起
  electron.powerMonitor.on('resume', () => console.log('resume')) // 系统恢复
  electron.powerMonitor.on('on-ac', () => console.log('on-ac')) // 切换为交流电
  electron.powerMonitor.on('on-battery', () => console.log('on-battery')) // 切换为电池
  electron.powerMonitor.on('shutdown', () => console.log('shutdown')) // 即将重启或关机
  electron.powerMonitor.on('lock-screen', () => console.log('lock-screen')) // 屏幕锁定
  electron.powerMonitor.on('unlock-screen', () => console.log('unlock-screen')) // 屏幕解锁

  // session
  // 管理浏览器会话、cookie、缓存、代理设置等
  const sess = mainWindow.webContents.session
  console.log(sess.getUserAgent())

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

// 文件选择对话框
ipcMain.on('show-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'multiSelections']
  })
})

// 当 Electron 完成初始化并准备创建浏览窗口时触发此方法
// 某些 API 只有在此事件触发后才可使用
app.on('ready', showMain)

// 当所有的窗口都关闭时触发
app.on('window-all-closed', () => {
  console.log('window-all-closed')
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

app.on('will-finish-launching', () => console.log('will-finish-launching'))
app.on('before-quit', () => console.log('before-quit'))
app.on('will-quit', () => console.log('will-quit'))
app.on('quit', () => console.log('quit'))
app.on('browser-window-blur', () => console.log('browser-window-blur'))
app.on('browser-window-focus', () => console.log('browser-window-focus'))
app.on('browser-window-created', () => console.log('browser-window-created'))
app.on('web-contents-created', () => console.log('web-contents-created'))
app.on('certificate-error', () => console.log('certificate-error'))
app.on('select-client-certificate', () => console.log('select-client-certificate'))
app.on('session-created', () => console.log('session-created'))

// 跟踪 mac 系统主题
systemPreferences.subscribeNotification(
  'AppleInterfaceThemeChangedNotification',
  function theThemeHasChanged() {
    updateMyAppTheme(systemPreferences.isDarkMode())
  }
)