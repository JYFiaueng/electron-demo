// // js文件，与网页中的 js 文件所处的环境完全相同


/*

语音识别 API 需要设置下面三个环境变量
GOOGLE_API_KEY
GOOGLE_DEFAULT_CLIENT_ID
GOOGLE_DEFAULT_CLIENT_SECRET

*/

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition

var recognition = new SpeechRecognition();
let lang = 'en-US'
recognition.lang = lang;
recognition.interimResults = true;
recognition.maxAlternatives = 1;

window.onload = function () {
  recognition.start();
}

setInterval(() => {
  if (dots.innerText.length >= 5) {
    dots.innerText = ''
  } else {
    dots.innerText += '.'
  }
}, 500);

recognition.onresult = function (event) {
  console.warn('onresult')
  for (const result of event.results) {
    if(result[0].confidence < 0.2){
      continue
    }
    let transcript = result[0].transcript
    if (result.isFinal) {
      console.log('final', transcript)
      let p = document.createElement('p')
      p.innerText = transcript
      pList.append(p)
      current.innerText = ''
    } else {
      current.innerText = transcript
    }
  }

  if (current.innerText.toLowerCase().indexOf('chinese') >= 0) {
    recognition.stop()
    recognition.lang = 'zh-CN';
  }

  if (current.innerText.toLowerCase().indexOf('英文') >= 0) {
    recognition.stop()
    recognition.lang = 'en-US';
  }

}

recognition.onspeechend = function () {
  console.warn('speechend')
  recognition.stop();
}

recognition.onerror = function (event) {
  console.warn('error', event)
  if(event.error === 'aborted'){
    alert('error: aborted，只能开一个语音识别页面')
    window.close()
  }
}

recognition.onend = function (event) {
  console.warn('end')
  recognition.start();
}

const curlGoogleClick = () => {
  console.log('------send google------')
  let xhr = new XMLHttpRequest()
  xhr.addEventListener('load', function () {
    console.log(xhr.response)
  })
  xhr.open('GET', 'https://www.google.com/complete/search?q=g&cp=1&client=psy-ab&xssi=t&gs_ri=gws-wiz&hl=en&authuser=0&pq=google&psi=5aSmXemoHKGw0PEP3PCrwAk.1571202280841&ei=5aSmXemoHKGw0PEP3PCrwAk')
  xhr.send()
}

curlGoogle.addEventListener('click', curlGoogleClick)