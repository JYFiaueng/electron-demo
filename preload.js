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

  function a(t) {
    if (Array.isArray(t)) {
      for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
      return n
    }
    return Array.from(t)
  }

  navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    })
    .then((stream) => {
      let sendData = null
      const ddd = []

      const context = new AudioContext()
      // 创建一个ScriptProcessorNode 用于通过JavaScript直接处理音频
      const recorder = context.createScriptProcessor(0, 1, 1)
      // 方法用于创建一个新的MediaStreamAudioSourceNode 对象, 需要传入一个媒体流对象(MediaStream对象)
      // (可以从 navigator.getUserMedia 获得MediaStream对象实例), 然后来自MediaStream的音频就可以被播放和操作
      const ms = context.createMediaStreamSource(stream)
      recorder.onaudioprocess = e => {
        let d = e.inputBuffer.getChannelData(0)
        ddd.push(...d)
      }
      ms.connect(recorder)
      recorder.connect(context.destination)

      let t = 0
      startAudio.addEventListener('click', () => {
        sendData = xunfei60()
        sendData('', 0)
        t = setInterval(() => {
          let e = ddd.splice(0, 1280)
          if (ddd.length === 0) {
            clearInterval(t)
            sendData('', 2)
            return
          }
          sendData(e)
        }, 40)
      })
      stopAudio.addEventListener('click', () => {
        clearInterval(t)
        sendData('', 2)
      })
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

function xunfei60(filePath) {

  // 系统配置 
  const config = {
    // 请求地址
    hostUrl: "wss://iat-api.xfyun.cn/v2/iat",
    host: "iat-api.xfyun.cn",
    //在控制台-我的应用-语音听写（流式版）获取
    appid: "5dad1c13",
    //在控制台-我的应用-语音听写（流式版）获取
    apiSecret: "27236883328363967717625fbbf6bd2c",
    //在控制台-我的应用-语音听写（流式版）获取
    apiKey: "0e606eafda5fa80a56e6a8fdf4aac4c3",
    file: './t.ogg',
    uri: "/v2/iat",
    highWaterMark: 1280
  }

  // 帧定义
  const FRAME = {
    STATUS_FIRST_FRAME: 0,
    STATUS_CONTINUE_FRAME: 1,
    STATUS_LAST_FRAME: 2
  }

  // 获取当前时间 RFC1123格式
  let date = (new Date().toUTCString())
  // 设置当前临时状态为初始化
  let status = FRAME.STATUS_FIRST_FRAME
  // 记录本次识别用sid
  let currentSid = ""
  // 识别结果
  let iatResult = []

  let wssUrl = config.hostUrl + "?authorization=" + getAuthStr(date) + "&date=" + date + "&host=" + config.host
  let ws = new WebSocket(wssUrl)

  // 连接建立完毕，读取数据进行识别
  ws.on('open', (event) => {
    console.log("websocket connect!")
    // var readerStream = fs.createReadStream(config.file, {
    //   highWaterMark: config.highWaterMark
    // });
    // readerStream.on('data', function (chunk) {
    //   send(chunk)
    // });
    // // 最终帧发送结束
    // readerStream.on('end', function () {
    //   status = FRAME.STATUS_LAST_FRAME
    //   send("")
    // });
  })

  // 得到识别结果后进行处理，仅供参考，具体业务具体对待
  ws.on('message', (data, err) => {
    if (err) {
      console.log(`err:${err}`)
      return
    }
    res = JSON.parse(data)
    if (res.code != 0) {
      console.log(`error code ${res.code}, reason ${res.message}`)
      return
    }

    let str = ""
    if (res.data.status == 2) {
      // res.data.status ==2 说明数据全部返回完毕，可以关闭连接，释放资源
      str += "最终识别结果"
      currentSid = res.sid
      ws.close()
    } else {
      str += "中间识别结果"
    }
    iatResult[res.data.result.sn] = res.data.result
    if (res.data.result.pgs == 'rpl') {
      res.data.result.rg.forEach(i => {
        iatResult[i] = null
      })
      str += "【动态修正】"
    }
    str += "："
    iatResult.forEach(i => {
      if (i != null) {
        i.ws.forEach(j => {
          j.cw.forEach(k => {
            str += k.w
          })
        })
      }
    })
    console.log(str)
    // ... do something
  })

  // 资源释放
  ws.on('close', () => {
    console.log(`本次识别sid：${currentSid}`)
    console.log('connect close!')
  })

  // 建连错误
  ws.on('error', (err) => {
    console.log("websocket connect err: " + err)
  })

  // 鉴权签名
  function getAuthStr(date) {
    let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
    let signature = CryptoJS.enc.Base64.stringify(signatureSha)
    let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    let authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
    return authStr
  }

  // 传输数据
  function send(data, outStatus) {
    if (outStatus !== undefined) {
      status = outStatus
    }
    let frame = "";
    let frameDataSection = {
      "status": status,
      "format": "audio/L16;rate=16000",
      "audio": ArrayBufferToBase64(data),
      "encoding": "raw"
    }
    switch (status) {
      case FRAME.STATUS_FIRST_FRAME:
        frame = {
          // 填充common
          common: {
            app_id: config.appid
          },
          //填充business
          business: {
            language: "zh_cn",
            domain: "iat",
            accent: "mandarin",
            dwa: "wpgs", // 可选参数，动态修正
            sample_rate: "16000",
            vad_eos: 5000
          },
          //填充data
          data: frameDataSection
        }
        status = FRAME.STATUS_CONTINUE_FRAME;
        break;
      case FRAME.STATUS_CONTINUE_FRAME:
      case FRAME.STATUS_LAST_FRAME:
        //填充frame
        frame = {
          data: frameDataSection
        }
        break;
    }
    console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-')
    console.log(frame)
    console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-')
    ws.send(JSON.stringify(frame))
  }

  return send
}

function ArrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}