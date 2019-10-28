// 在预加载程序时所有 Node.js API 都是可用的
// 它具有与 Chrome 扩展程序想用的沙盒

// 这里是一个 web 和 Node.js 的综合环境，可以使用所有的 API
// 在窗口加载之前，可以预加载此文件执行一些必要操作，对 HTML 文件进行渲染
// 也就是说界面直接展示的是经过此 js 文件渲染后的界面，然后界面中再去按照 web 的形式加载 js、css 资源文件

const fs = require('fs')
const CryptoJS = require('crypto-js')
const WebSocket = require('ws')
const {
  ipcRenderer
} = require('electron')
const {
  dialog
} = require('electron').remote

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

  const startSAudio = document.getElementById('startSAudio')
  const stopSAudio = document.getElementById('stopSAudio')

  // 语音实时转换
  navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
    .then((stream) => { // 得到一个 MediaStream 类型的实例

      // https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API

      // 关闭媒体
      function closeMedia() {
        stream.getTracks().forEach(track => track.stop())
      }

      // 语音听写
      startAudio.addEventListener('click', () => {
        let t = 0
        let sendData = null
        // 存储 16bit pcm 数据
        let bufXunfei60 = []
        const context = new AudioContext()
        // 创建一个 ScriptProcessorNode 节点用于通过JavaScript直接处理音频
        // 第一个参数是指定缓冲区大小，传 0 表示会自动选取一个适合当前环境的适当的数值
        // 后面两个参数分别用于指定输入输出节点的声道数量
        const recorder = context.createScriptProcessor(0, 1, 1)
        // 方法用于创建一个新的 MediaStreamAudioSourceNode 对象, 需要传入一个媒体流对象(MediaStream对象)
        // (可以从 navigator.getUserMedia 获得MediaStream对象实例), 然后来自MediaStream的音频就可以被播放和操作
        // 创建一个MediaStreamAudioSourceNode接口来关联可能来自本地计算机麦克风或其他来源的音频流MediaStream
        // 将来自计算机的音视频设备的 MediaStream 对象与 AudioContext 建立关联
        // MediaStreamAudioSourceNode 接口没有输入，只有一个输出，输出频道数目为 1
        const ms = context.createMediaStreamSource(stream)
        // ScriptProcessorNode 节点接收输入会持续不断的触发下面事件
        recorder.onaudioprocess = e => {
          let d = e.inputBuffer.getChannelData(0)
          const data = to16BitPCM(to16kHz(d))
          var _buffer60;
          (_buffer60 = bufXunfei60).push.apply(_buffer60, _toConsumableArray(data))
        }
        // 将 MediaStreamAudioSourceNode 的输出连接至 AudioNode 节点
        ms.connect(recorder)
        recorder.connect(context.destination)
        console.log('-------context-------')
        console.log(context)
        console.log('-------recorder-------')
        console.log(recorder)
        console.log('-------ms-------')
        console.log(ms)
        sendData = xunfei60()
        // 初始化录音数据
        setTimeout(() => {
          sendData(bufXunfei60.splice(0, 1280), 0)
          // 推荐频率，每 40ms 发送 1280 字节数据
          t = setInterval(() => {
            let e = bufXunfei60.splice(0, 1280)
            if (bufXunfei60.length === 0) {
              console.log('数据发送完成')
              clearInterval(t)
              sendData('', 2)
              return
            }
            sendData(e)
          }, 40)
          stopAudio.addEventListener('click', () => {
            clearInterval(t)
            // 发送结束标志位
            sendData('', 2)
            ms.disconnect(recorder)
            recorder.disconnect(context.destination)
            closeMedia()
          })
        }, 2000)
      })

      // 实时语音转写
      startSAudio.addEventListener('click', () => {
        let t = 0
        // 存储 16bit pcm 数据
        let bufXunfei = []
        const context = new AudioContext()
        // 创建一个ScriptProcessorNode 用于通过JavaScript直接处理音频
        const recorder = context.createScriptProcessor(0, 1, 1)
        // 方法用于创建一个新的MediaStreamAudioSourceNode 对象, 需要传入一个媒体流对象(MediaStream对象)
        // (可以从 navigator.getUserMedia 获得MediaStream对象实例), 然后来自MediaStream的音频就可以被播放和操作
        const ms = context.createMediaStreamSource(stream)
        recorder.onaudioprocess = e => {
          let d = e.inputBuffer.getChannelData(0)
          const data = to16BitPCM(to16kHz(d))
          var _buffer;
          (_buffer = bufXunfei).push.apply(_buffer, _toConsumableArray(data))
        }
        ms.connect(recorder)
        recorder.connect(context.destination)
        xunfei((ws) => {
          setTimeout(() => {
            // 推荐频率，每 40ms 发送 1280 字节数据
            t = setInterval(() => {
              let e = bufXunfei.splice(0, 1280)
              if (bufXunfei.length === 0) {
                console.log('数据发送完成')
                clearInterval(t)
                ws.send("{\"end\": true}")
                return
              }
              ws.send(e)
            }, 40)
          }, 2000)
          stopSAudio.addEventListener('click', () => {
            clearInterval(t)
            // 发送结束标志位
            ws.send("{\"end\": true}")
            ms.disconnect(recorder)
            recorder.disconnect(context.destination)
            closeMedia()
          })
        })
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

  // 触发弹出文件选择框
  document.getElementById('showDialog').addEventListener('click', () => {
    // 通过 ipc 通道发送打开对话框消息
    // ipcRenderer.send('show-dialog')
    // 通过 remote 直接打开对话框
    dialog.showOpenDialog({
      title: '这里是指定的对话框名称',
      defaultPath: '/Users/mac/Documents',
      properties: ['openFile', 'openDirectory', 'multiSelections', 'showHiddenFiles'],
      callback: () => {
        console.log('open dialog')
      },
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
        { name: 'Custom File Type', extensions: ['as'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
  })

})

function xunfei(startMsg) {
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
    console.log("websocket connect!")
  })

  // 得到识别结果后进行处理，仅供参考，具体业务具体对待
  let rtasrResult = []
  ws.on('message', (data, err) => {
    if (err) {
      console.log(`err:${err}`)
      return
    }
    let res = JSON.parse(data)
    switch (res.action) {
      case 'error':
        console.log(`error code:${res.code} desc:${res.desc}`)
        break
        // 连接建立
      case 'started':
        console.log('started!')
        console.log('sid is:' + res.sid)

        startMsg(ws)
        break
      case 'result':
        let result_output_s = document.getElementById('result_output_s')
        let data = JSON.parse(res.data)
        rtasrResult[data.seg_id] = data
        // 把转写结果解析为句子
        if (data.cn.st.type == 0) {
          let str = ''
          rtasrResult.forEach(i => {
            if (i.cn.st.type == 0) {
              i.cn.st.rt.forEach(j => {
                j.ws.forEach(k => {
                  k.cw.forEach(l => {
                    str += l.w
                  })
                })
              })
            }
          })
          result_output_s.innerText = str
        }
        break
    }
  })

  // 资源释放
  ws.on('close', () => {
    console.log('connect close!')
  })

  // 建连错误
  ws.on('error', (err) => {
    console.error("websocket connect err: " + err)
  })

  // 鉴权签名
  function getSigna(ts) {
    let md5 = CryptoJS.MD5(config.appid + ts).toString()
    let sha1 = CryptoJS.HmacSHA1(md5, config.apiKey)
    let base64 = CryptoJS.enc.Base64.stringify(sha1)
    return encodeURIComponent(base64)
  }
}

function xunfei60() {

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
  })

  // 得到识别结果后进行处理，仅供参考，具体业务具体对待
  ws.on('message', (data, err) => {
    if (err) {
      console.log(`err:${err}`)
      return
    }
    let res = JSON.parse(data)
    res.data && res.data.result && genText(res.data.result)
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
    ws.send(JSON.stringify(frame))
  }

  return send
}

let resultText = ''

function genText(data) {
  let result_output = document.getElementById('result_output')

  var str = '';
  var resultStr = '';
  var ws = data.ws || [];
  for (var i = 0; i < ws.length; i++) {
    str = str + ws[i].cw[0].w;
  }
  // 开启wpgs会有此字段
  // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
  if (!data.pgs || data.pgs === 'apd') {
    resultText = result_output.innerText;
  }
  resultStr = resultText + str
  result_output.innerText = resultStr
}

function ArrayBufferToBase64(buffer) {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

function to16kHz(buffer) {
  var data = new Float32Array(buffer)
  var fitCount = Math.round(data.length * (16000 / 44100))
  var newData = new Float32Array(fitCount)
  var springFactor = (data.length - 1) / (fitCount - 1)
  newData[0] = data[0]
  for (var i = 1; i < fitCount - 1; i++) {
    var tmp = i * springFactor
    var before = Math.floor(tmp).toFixed()
    var after = Math.ceil(tmp).toFixed()
    var atPoint = tmp - before
    newData[i] = data[before] + (data[after] - data[before]) * atPoint
  }
  newData[fitCount - 1] = data[data.length - 1]
  return newData
}

function to16BitPCM(input) {
  var dataLength = input.length * (16 / 8)
  var dataBuffer = new ArrayBuffer(dataLength)
  var dataView = new DataView(dataBuffer)
  var offset = 0
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]))
    dataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
  }
  return Array.from(new Int8Array(dataView.buffer))
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}