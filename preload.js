// 在预加载程序时所有 Node.js API 都是可用的
// 它具有与 Chrome 扩展程序想用的沙盒

// 这里是一个 web 和 Node.js 的综合环境，可以使用所有的 API
// 在窗口加载之前，可以预加载此文件执行一些必要操作，对 HTML 文件进行渲染
// 也就是说界面直接展示的是经过此 js 文件渲染后的界面，然后界面中再去按照 web 的形式加载 js、css 资源文件

const fs = require('fs')
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', async () => {

  // 使用 Node.js 模块
  const readme = await new Promise((resolve, reject) => {
    fs.readFile(__dirname + '/README.md', (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })

  // 在浏览窗口中插入数据
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text + ' ' + readme
  }
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  // 桌面通知
  // 通知使用 H5 Notification API，并使用当前运行的操作系统的本地通知 API 来显示它
  const notification = document.getElementById('notification')
  notification.addEventListener('click', () => {
    let myNotification = new Notification('electron', {
      body: readme
    })
    myNotification.onclick = () => {
      console.log('click Notification')
    }
  })

  // 离屏渲染
  const screenPaint = document.getElementById('screenPaint')
  screenPaint.addEventListener('click', () => {
    ipcRenderer.send('screen-paint')
  })
  
})

window.addEventListener('load', () => {

  // 预置脚本中引入在线离线检测
  const updateOnlineStatus = () => {
    ipcRenderer.send('online-status-changed', navigator.onLine ? 'online' : 'offline')
  }
  window.addEventListener('online',  updateOnlineStatus)
  window.addEventListener('offline',  updateOnlineStatus)
  updateOnlineStatus()

})