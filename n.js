// var mediaRecorder = new MediaRecorder(stream, {
      //   audioBitsPerSecond: 16000
      // })
      // console.log(mediaRecorder)
      // // let ws = null
      // startAudio.addEventListener('click', () => {
      //   mediaRecorder.start()
      //   // ws = xunfei()
      // })
      // stopAudio.addEventListener('click', () => {
      //   mediaRecorder.stop()
      // })
      // mediaRecorder.ondataavailable = function (e) {
        // mp3 转 pcm
        // ffmpeg -i t.mp3 -f s16le -ar 16000 -ac 1 -acodec pcm_s16le test_3.pcm

        // pcm 转 mp3
        // ffmpeg -y -f s16le -ac 2 -ar 16000 -acodec pcm_s16le -i test_1.pcm t.mp3

        // toBuffer(e.data, function (err, buffer) {
        //   fs.writeFile('./t.ogg', buffer, () => {
        //     let stream = fs.createReadStream('./test_3.pcm', {
        //       highWaterMark: 16
        //     })
        //     stream.on('data', function (chunk) {
        //       ws.send(chunk)
        //     })
        //     stream.on('end', function () {
        //       ws.send("{\"end\": true}")
        //     })
        //   })
        // })

        // 可能用到
        const act = new window.AudioContext()
        const recorder = act.createScriptProcessor(0, 1, 1)
        recorder.onaudioprocess = function (e) {
          t.sendData(e.inputBuffer.getChannelData(0))
        }
        // createScriptProcessor
        // createMediaStreamSource
        // onaudioprocess
        // getChannelData

        toBuffer(e.data, function (err, buffer) {
          fs.writeFile('./t.ogg', buffer, () => {
            xunfei60('./t.ogg')
          })
        })

      }