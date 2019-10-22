// 在预加载程序时所有 Node.js API 都是可用的
// 它具有与 Chrome 扩展程序想用的沙盒

// 这里是一个 web 和 Node.js 的综合环境，可以使用所有的 API
// 在窗口加载之前，可以预加载此文件执行一些必要操作，对 HTML 文件进行渲染
// 也就是说界面直接展示的是经过此 js 文件渲染后的界面，然后界面中再去按照 web 的形式加载 js、css 资源文件

const fs = require('fs')
const CryptoJS = require('crypto-js')
const WebSocket = require('ws')
const log = require('log4node')
const toBuffer = require('blob-to-buffer')
const {
  ipcRenderer
} = require('electron')

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

  const startAudio = document.getElementById('startAudio')
  const stopAudio = document.getElementById('stopAudio')

  navigator.mediaDevices.getUserMedia({
      audio: true
    })
    .then((stream) => {
      var mediaRecorder = new MediaRecorder(stream, {
        audioBitsPerSecond: 16000
      })
      let ws = null
      startAudio.addEventListener('click', () => {
        mediaRecorder.start()
        ws = xunfei()
      })
      stopAudio.addEventListener('click', () => {
        mediaRecorder.stop()
      })
      mediaRecorder.ondataavailable = function (e) {

        // mp3 转 pcm
        // ffmpeg -i t.mp3 -f s16le -ar 16000 -ac 1 -acodec pcm_s16le test_3.pcm

        // pcm 转 mp3
        // ffmpeg -y -f s16le -ac 2 -ar 16000 -acodec pcm_s16le -i test_1.pcm t.mp3

        toBuffer(e.data, function (err, buffer) {
          fs.writeFile('./t.ogg', buffer, () => {
            let stream = fs.createReadStream('./test_3.pcm', {
              highWaterMark: 16
            })
            stream.on('data', function (chunk) {
              ws.send(chunk)
            })
            stream.on('end', function () {
              ws.send("{\"end\": true}")
            })
          })
        })

      }
    })

})

window.addEventListener('load', () => {

  // 预置脚本中引入在线离线检测
  const updateOnlineStatus = () => {
    ipcRenderer.send('online-status-changed', navigator.onLine ? 'online' : 'offline')
  }
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  updateOnlineStatus()

  console.log('page process.isMainFram: ', process.isMainFram)

})

function xunfei() {
  // 系统配置
  const config = {
    // 请求地址
    hostUrl: "wss://rtasr.xfyun.cn/v1/ws",
    //在控制台-我的应用-实时语音转写获取
    appid: "5dad1c13",
    //在控制台-我的应用-实时语音转写获取
    apiKey: "b23add4993b85f9bc8012863f04d0600"
  }

  // 获取当前时间戳
  let ts = parseInt(new Date().getTime() / 1000)

  let wssUrl = config.hostUrl + "?appid=" + config.appid + "&ts=" + ts + "&signa=" + getSigna(ts)
  let ws = new WebSocket(wssUrl)

  // 连接建立完毕，读取数据进行识别
  ws.on('open', (event) => {
    log.info("websocket connect!")
  })

  // 得到识别结果后进行处理，仅供参考，具体业务具体对待
  let rtasrResult = []
  ws.on('message', (data, err) => {
    if (err) {
      log.info(`err:${err}`)
      return
    }
    let res = JSON.parse(data)
    switch (res.action) {
      case 'error':
        log.info(`error code:${res.code} desc:${res.desc}`)
        break
        // 连接建立
      case 'started':
        log.info('started!')
        log.info('sid is:' + res.sid)
        break
      case 'result':
        // ... do something
        let data = JSON.parse(res.data)
        rtasrResult[data.seg_id] = data
        // 把转写结果解析为句子
        if (data.cn.st.type == 0) {
          rtasrResult.forEach(i => {
            let str = "实时转写"
            str += (i.cn.st.type == 0) ? "【最终】识别结果：" : "【中间】识别结果："
            i.cn.st.rt.forEach(j => {
              j.ws.forEach(k => {
                k.cw.forEach(l => {
                  str += l.w
                })
              })
            })
            log.info(str)
          })

        }
        break
    }
  })

  // 资源释放
  ws.on('close', () => {
    log.info('connect close!')
  })

  // 建连错误
  ws.on('error', (err) => {
    log.error("websocket connect err: " + err)
  })

  // 鉴权签名
  function getSigna(ts) {
    let md5 = CryptoJS.MD5(config.appid + ts).toString()
    let sha1 = CryptoJS.HmacSHA1(md5, config.apiKey)
    let base64 = CryptoJS.enc.Base64.stringify(sha1)
    return encodeURIComponent(base64)
  }

  return ws
}