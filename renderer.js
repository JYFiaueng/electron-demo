// js文件，与网页中的 js 文件所处的环境完全相同

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


// electron 抽象了文件系统，提供原生的 H5 File API
document.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();

  for (const f of e.dataTransfer.files) {
    console.log('File(s) you dragged here: ', f.path)
  }
});
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});


createWindow.addEventListener('click', () => {
  window.open('http://github.com')
})