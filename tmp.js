const startAudio = document.getElementById('startAudio')
const stopAudio = document.getElementById('stopAudio')

const startSAudio = document.getElementById('startSAudio')
const stopSAudio = document.getElementById('stopSAudio')

// 数据帧定义
const FRAME = {
  STATUS_FIRST_FRAME: 0,
  STATUS_CONTINUE_FRAME: 1,
  STATUS_LAST_FRAME: 2
}
const highWaterMark = 1280

startAudio.addEventListener('click', async () => {
  const medisStream = await openAudio()
  const sendData = await xunfei60()

  const audioBuffer = []
  const closeAudio = buildJsHandleAudio(medisStream, (pcmData) => {
    const data = to16BitPCM(to16kHz(pcmData))
    var _buffer60;
    (_buffer60 = audioBuffer).push.apply(_buffer60, _toConsumableArray(data))
  })

  // 发送开始帧
  sendData(audioBuffer.splice(0, highWaterMark), FRAME.STATUS_FIRST_FRAME)
  // 按照推荐的频率，每 40ms 发送 1280 字节的数据
  const t = setInterval(() => {
    let e = audioBuffer.splice(0, highWaterMark)
    if (!audioBuffer.length) {
      console.log('数据发送完成')
      clearInterval(t)
      sendData('', FRAME.STATUS_LAST_FRAME)
    }
    sendData(e, FRAME.STATUS_CONTINUE_FRAME)
  }, 40)
  stopAudio.addEventListener('click', () => {
    clearInterval(t)
    sendData('', FRAME.STATUS_LAST_FRAME)
    closeAudio()
  })
})

// 构建音频处理流水线
function buildJsHandleAudio(medisStream, cb) {
  const context = new AudioContext()
  const recorder = context.createScriptProcessor(0, 1, 1)
  const ms = context.createMediaStreamSource(medisStream)
  recorder.onaudioprocess = e => cb(e.inputBuffer.getChannelData(0))
  ms.connect(recorder)
  recorder.connect(context.destination)
  return () => {
    ms.disconnect(recorder)
    recorder.disconnect(context.destination)
    closeMedia(medisStream)
  }
}

// 请求音频输入设备权限
async function openAudio() {
  return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  })
}

// 关闭媒体流
function closeMedia(medisStream) {
  medisStream.getTracks().forEach(track => track.stop())
}

// 鉴权签名
function getAuthStr(date, config) {
  let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`
  let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
  let signature = CryptoJS.enc.Base64.stringify(signatureSha)
  let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
  let authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
  return authStr
}

// 将经过编码的 ArrayBuffer 转为 Base64
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

// 建立科大讯飞 ws 连接
function xunfei60() {
  return new Promise((resolve, reject) => {
    // 连接配置
    const config = {
      hostUrl: "wss://iat-api.xfyun.cn/v2/iat",
      uri: "/v2/iat",
      host: "iat-api.xfyun.cn",
      appid: "5dad1c13",
      apiSecret: "27236883328363967717625fbbf6bd2c",
      apiKey: "0e606eafda5fa80a56e6a8fdf4aac4c3",
    }

    // 拼接 ws 连接地址
    let date = (new Date().toUTCString())
    let wssUrl = `${config.hostUrl}?authorization=${getAuthStr(date, config)}&date=${date}&host=${config.host}`
    let ws = new WebSocket(wssUrl)

    // 连接建立完毕
    ws.on('open', (event) => {
      console.log("websocket connect!")
      resolve(send)
    })

    // 得到识别结果后进行处理
    ws.on('message', (data, err) => {
      if (err) {
        console.log(`err:${err}`)
        return
      }
      let res = JSON.parse(data)
      res.data && res.data.result && haneldResult(res.data.result)
    })

    // 资源释放
    ws.on('close', () => {
      console.log('connect close!')
    })

    // 建连错误
    ws.on('error', (err) => {
      console.log("websocket connect err: " + err)
      reject(err)
    })

    // 初始数据帧状态
    let status = FRAME.STATUS_FIRST_FRAME
    // 传输数据
    // 参数：需要传输的经过编码的 PCM 数据、当前数据帧的传输状态
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
          // 初始数据帧，用于设置语音识别引擎
          frame = {
            common: {
              app_id: config.appid
            },
            business: {
              language: "zh_cn",
              domain: "iat",
              accent: "mandarin",
              dwa: "wpgs", // 可选参数，动态修正
              sample_rate: "16000",
              vad_eos: 5000
            },
            data: frameDataSection
          }
          // 第一个开始帧传输完成后，修改帧状态为中间态，然后不断发送PCM数据
          status = FRAME.STATUS_CONTINUE_FRAME
          break;
        case FRAME.STATUS_CONTINUE_FRAME:
        case FRAME.STATUS_LAST_FRAME:
          frame = {
            data: frameDataSection
          }
          break;
      }
      ws.send(JSON.stringify(frame))
    }
  })
}

// 处理返回结果打印在页面上
function haneldResult(data) {
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