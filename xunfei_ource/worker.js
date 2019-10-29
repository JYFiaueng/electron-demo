/**
 * Created by lycheng on 2019/8/9.
 * 将浏览器录音转换成16kHz 16Bit的pcm音频流
 */

(function () {
  var self = this
  this.onmessage = function (e) {
    switch (e.data.command) {
      case 'transform':
        transform.transaction(e.data.buffer)
        break
    }
  }
  var transform = {
    transaction: function (buffer) {
      var bufTo16kHz = transform.to16kHz(buffer)
      var bufTo16BitPCM = transform.to16BitPCM(bufTo16kHz)
      self.postMessage({'buffer': bufTo16BitPCM})
    },
    to16kHz: function (buffer) {
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
    },

    to16BitPCM: function (input) {
      var dataLength = input.length * (16 / 8)
      var dataBuffer = new ArrayBuffer(dataLength)
      var dataView = new DataView(dataBuffer)
      var offset = 0
      for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]))
        dataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
      }
      return Array.from(new Int8Array(dataView.buffer))
    },
    toBase64: function (buffer) {
      var binary = ''
      var bytes = new Uint8Array(buffer)
      var len = bytes.byteLength
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
    }
  }
})()



// WEBPACK FOOTER //
// ./src/js/libs/transform-pcm.worker.js






!function(t){function r(e){if(n[e])return n[e].exports;var o=n[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var n={};r.m=t,r.c=n,r.d=function(t,n,e){r.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:e})},r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,"a",n),n},r.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},r.p="/hera/",r(r.s=0)}([function(t,r){!function(){var t=this;this.onmessage=function(t){switch(t.data.command){case"transform":r.transaction(t.data.buffer)}};var r={transaction:function(n){var e=r.to16kHz(n),o=r.to16BitPCM(e);t.postMessage({buffer:o})},to16kHz:function(t){var r=new Float32Array(t),n=Math.round(r.length*(16e3/44100)),e=new Float32Array(n),o=(r.length-1)/(n-1);e[0]=r[0];for(var a=1;a<n-1;a++){var f=a*o,i=Math.floor(f).toFixed(),u=Math.ceil(f).toFixed(),c=f-i;e[a]=r[i]+(r[u]-r[i])*c}return e[n-1]=r[r.length-1],e},to16BitPCM:function(t){for(var r=2*t.length,n=new ArrayBuffer(r),e=new DataView(n),o=0,a=0;a<t.length;a++,o+=2){var f=Math.max(-1,Math.min(1,t[a]));e.setInt16(o,f<0?32768*f:32767*f,!0)}return Array.from(new Int8Array(e.buffer))},toBase64:function(t){for(var r="",n=new Uint8Array(t),e=n.byteLength,o=0;o<e;o++)r+=String.fromCharCode(n[o]);return window.btoa(r)}}}()}]);
//# sourceMappingURL=4cb59091912e9ef31ced.worker.js.map