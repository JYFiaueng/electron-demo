webpackJsonp([13], {
  10: function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return o
    });
    var o = {
      config: {
        top: 90,
        $container: $("html,body"),
        checkedClass: "nav-checked",
        position: {
          top: {
            position: "absolute",
            top: "600px",
            bottom: "auto"
          },
          middle: {
            position: "fixed",
            top: "150px",
            bottom: "auto"
          },
          bottom: {},
          minTop: {
            position: "fixed",
            top: "550px",
            bottom: "auto"
          },
          minBottom: {
            position: "fixed",
            top: "150px",
            bottom: "auto"
          }
        }
      },
      init: function () {
        o.bindEvent(), o.methods.rePosition()
      },
      bindEvent: function () {
        $(".js-service-nav-fall li").off("click").on("click", function () {
          var t = $(this).attr("target");
          o.methods.toPosition(t)
        }), window.onscroll = function () {
          o.methods.rePosition()
        }, window.onscroll()
      },
      methods: {
        toPosition: function (t) {
          var e = $("." + t).offset().top - o.config.top;
          o.config.$container.animate({
            scrollTop: Math.floor(e)
          }, 500)
        },
        rePosition: function () {
          var t = [],
            e = $("body").scrollTop() || $("html").scrollTop(),
            n = $(".js-service-nav-fall"),
            a = $(".js-service-nav-fall li"),
            i = [],
            r = 0,
            c = o.config.position;
          for (a.each(function () {
              i.push($(this).attr("target"))
            }), r = 0; r < i.length; r++) t.push(Math.floor($("." + i[r]).offset().top) - o.config.top);
          for (t.push(t[r - 1] + $("." + i[r - 1]).height()), r = 0; r < i.length; r++) e >= t[r] && (a.removeClass(o.config.checkedClass), a.filter('[target="' + i[r] + '"]').addClass(o.config.checkedClass));
          e >= t[0] ? e + n.height() + o.config.top > t[t.length - 1] ? n.css(c.bottom) : n.css(c.middle) : n.css(c.top)
        }
      }
    }
  },
  11: function (t, e, n) {
    "use strict";

    function o() {
      var t = $(".service-item-qa");
      if (t.length) {
        var e = t.find("li");
        e.length <= 4 && $(".service-qa-more").hide();
        for (var n = 0; n < e.length; n++) n >= 4 && e.eq(n).hide()
      }
      $(".service-qa-more").click(function () {
        t.find("li").show(), $(this).hide()
      })
    }

    function a() {
      $(".service-topbar").length && $(window).scroll(function () {
        $(window).scrollTop() >= 450 ? $(".service-topbar").show() : $(".service-topbar").hide()
      })
    }

    function i() {
      $("html,body").animate({
        scrollTop: $(".service-item-price").offset().top - 100
      }, 1e3)
    }
    n.d(e, "a", function () {
      return o
    }), n.d(e, "b", function () {
      return a
    });
    var r = n(0),
      c = n(4),
      s = n(10),
      u = n(6);
    n(3), n(8);
    ! function () {
      $(".banner-to-service-manage, .banner-to-service-manage").click(function () {
        var t = this.dataset.serviceKey;
        "face" !== t && "isv" !== t && "xpush" !== t || (t = "base"), Object(u.f)(r.a.CONSOLE + "services/" + t, "_blank")
      }), $(".to-price").click(function () {
        i()
      }), "#price" === location.hash && i(), "price" === Object(u.c)("target") && i()
    }(), Object(c.a)(), $(".js-service-nav-fall").length && s.a.init()
  },
  14: function (t, e, n) {
    "use strict";

    function o() {
      return new Promise(function (t, e) {
        jQuery.ajax({
          url: "/herapi/product/getAppList",
          type: "get",
          dataType: "json",
          cache: !1,
          success: function (e) {
            t(e)
          },
          error: function (e) {
            t({})
          }
        })
      })
    }

    function a(t, e) {
      return new Promise(function (n, o) {
        jQuery.ajax({
          type: "get",
          url: m.a.API + "mycloud/app/accessService",
          dataType: "json",
          data: {
            app_id: e,
            service: t
          },
          success: function (t) {
            n({
              code: 0,
              data: t
            })
          },
          error: function () {
            n({})
          }
        })
      })
    }

    function i(t, e) {
      return new Promise(function (n, o) {
        var a = b.a.get("ssoSessionId"),
          i = b.a.get("account_id");
        $.ajax({
          type: "get",
          url: m.a.CONSOLE + "dashboard/app/jsonp/service/add",
          dataType: "jsonp",
          data: {
            appId: e,
            services: t,
            ssoSessionId: a,
            account_id: i
          },
          jsonp: "callback",
          jsonpCallback: "handleResponse",
          success: function (t) {
            n({
              code: 0,
              data: t
            })
          },
          error: function (t) {
            n(t)
          }
        })
      }).catch(function (t) {
        console.log("catch:", t)
      })
    }

    function r(t, e) {
      return new Promise(function (n, o) {
        var a = b.a.get("ssoSessionId"),
          i = b.a.get("account_id");
        $.ajax({
          type: "get",
          url: m.a.CONSOLE + "dashboard/webapi/jsonp/addService/v1",
          dataType: "jsonp",
          data: {
            appId: e,
            services: t,
            ssoSessionId: a,
            account_id: i
          },
          jsonp: "callback",
          jsonpCallback: "handleResponse",
          success: function (t) {
            n({
              code: 0,
              data: t
            })
          },
          error: function (t) {
            n(t)
          }
        })
      }).catch(function (t) {
        console.log("catch:", t)
      })
    }

    function c(t) {
      return new Promise(function (e, n) {
        $.ajax({
          url: "/herapi/product/translate",
          type: "post",
          data: t,
          success: function (t) {
            e(t)
          },
          error: function () {
            e({})
          }
        })
      })
    }

    function s() {
      return new Promise(function (t, e) {
        $.ajax({
          url: "/herapi/product/getSdkList",
          success: function (e) {
            t(e)
          },
          error: function () {
            t({})
          }
        })
      })
    }

    function u(t) {
      return new Promise(function (e, n) {
        $.ajax({
          url: "/herapi/index/webltp",
          type: "POST",
          dataType: "json",
          data: t,
          success: function (t) {
            e(t)
          },
          error: function () {
            e({})
          }
        })
      })
    }

    function d(t) {
      return new Promise(function (e, n) {
        $.ajax({
          url: "/herapi/product/ots",
          type: "POST",
          dataType: "json",
          data: t,
          success: function (t) {
            e(t)
          },
          error: function () {
            e({})
          }
        })
      })
    }

    function l(t) {
      return new Promise(function (e, n) {
        $.ajax({
          url: "/herapi/product/kesa",
          type: "POST",
          dataType: "json",
          data: t,
          success: function (t) {
            e(t)
          },
          error: function () {
            e({})
          }
        })
      })
    }

    function f() {
      return new Promise(function (t, e) {
        $.ajax({
          url: "/herapi/plug/validate",
          type: "get",
          cache: !1,
          dataType: "json",
          success: function (e) {
            t(e)
          },
          error: function () {
            t({})
          }
        })
      })
    }

    function p(t) {
      return new Promise(function (e, n) {
        jQuery.ajax({
          url: "/herapi/product/iat_sign",
          type: "post",
          dataType: "json",
          cache: !1,
          data: {
            challenge: t.geetest_challenge,
            validate: t.geetest_validate,
            seccode: t.geetest_seccode
          },
          success: function (t) {
            e(t)
          },
          error: function () {
            e({})
          }
        })
      })
    }

    function h() {
      return new Promise(function (t, e) {
        jQuery.ajax({
          url: "/herapi/product/iat_language_list",
          type: "post",
          dataType: "json",
          cache: !1,
          success: function (e) {
            t(e)
          },
          error: function () {
            t({})
          }
        })
      })
    }

    function g(t) {
      return new Promise(function (e, n) {
        jQuery.ajax({
          url: "/herapi/product/tts_sign",
          type: "post",
          dataType: "json",
          cache: !1,
          data: {
            challenge: t.geetest_challenge,
            validate: t.geetest_validate,
            seccode: t.geetest_seccode
          },
          success: function (t) {
            e(t)
          },
          error: function () {
            e({})
          }
        })
      })
    }

    function v(t) {
      var e = t.grade,
        n = void 0 === e ? 0 : e;
      return new Promise(function (t, e) {
        jQuery.ajax({
          url: "/herapi/product/tts_language_list",
          type: "post",
          dataType: "json",
          data: {
            grade: n
          },
          cache: !1,
          success: function (e) {
            t(e)
          },
          error: function () {
            t({})
          }
        })
      })
    }
    n.d(e, "a", function () {
      return o
    }), n.d(e, "d", function () {
      return s
    }), n.d(e, "m", function () {
      return a
    }), n.d(e, "l", function () {
      return i
    }), n.d(e, "k", function () {
      return r
    }), n.d(e, "j", function () {
      return c
    }), n.d(e, "i", function () {
      return u
    }), n.d(e, "e", function () {
      return d
    }), n.d(e, "n", function () {
      return l
    }), n.d(e, "h", function () {
      return f
    }), n.d(e, "c", function () {
      return p
    }), n.d(e, "b", function () {
      return h
    }), n.d(e, "g", function () {
      return v
    }), n.d(e, "f", function () {
      return g
    });
    var w = n(1),
      m = (n.n(w), n(0)),
      b = n(2)
  },
  18: function (t, e, n) {
    "use strict";

    function o(t, e) {
      var n = t.packageId,
        o = e.async,
        a = void 0 === o || o;
      return new Promise(function (t, e) {
        jQuery.ajax({
          url: "/herapi/package/getPackageCerType",
          type: "get",
          dataType: "json",
          async: a,
          cache: !1,
          data: {
            packageId: n
          },
          success: function (e) {
            t(e)
          },
          error: function () {
            t({})
          }
        })
      })
    }

    function a(t) {
      var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = e.btnStr,
        a = void 0 === n ? "购买" : n,
        i = e.callback;
      Promise.all([Object(r.b)({
        async: !1
      }), o({
        packageId: t.packageId || t.selectPackageId
      }, {
        async: !1
      })]).then(function (e) {
        var n = c.a.CONSOLE + "sale/buy?";
        for (var o in t) t[o] && (n += o + "=" + t[o] + "&");
        n = n.substring(0, n.length - 1);
        var r = e[0],
          u = e[1];
        if (void 0 === u.code) return void(i ? i(n) : window.open(n));
        if (void 0 !== r.code) {
          if (8e4 === r.code || 80003 === r.code) return void Object(s.b)();
          var d = r.data,
            l = u.data;
          return -1 === l ? void(i ? i(n) : window.open(n)) : 2 === l && "BUSINESS_TEAM" !== d.type && "COMPANY" !== d.type ? void jAlert("您还未完成企业实名认证，认证后可" + a + "~", function (t) {
            t && window.open(c.a.CONSOLE + "user/authentication")
          }, "去认证") : d.flag ? void(i ? i(n) : window.open(n)) : void jAlert("您还未完成实名认证，认证后可" + a + "~", function (t) {
            t && window.open(c.a.CONSOLE + "user/authentication")
          }, "去认证")
        }
      }).catch(function (t) {
        console.log(t)
      })
    }

    function i(t) {
      var e = c.a.CONSOLE + "sale/buy?";
      for (var n in t) t[n] && (e += n + "=" + t[n] + "&");
      e = e.substring(0, e.length - 1), window.open(e)
    }
    var r = (n(1), n(6), n(3)),
      c = n(0),
      s = n(8);
    n.d(e, "a", function () {
      return a
    }), n.d(e, "b", function () {
      return i
    })
  },
  4: function (t, e, n) {
    "use strict";

    function o(t, e) {
      var n = $(".suspension");
      if (n.length) {
        var o = $(".suspension-back-top"),
          a = ($(".sus-icon"), $(window).height());
        $(window).scroll(function () {
          var e = $(window).scrollTop();
          e < t - a / 2 ? n.css({
            position: "absolute",
            top: t + "px"
          }) : n.css({
            position: "fixed",
            top: "50%"
          }), e > a / 2 ? o.show() : o.hide()
        }), $(window).scroll(), o.click(function () {
          return $("body, html").animate({
            scrollTop: 0
          }, 500), !1
        })
      }
    }
    var a = (n(3), n(7), n(2)),
      i = (n(5), null);
    ({
      addEvent: function () {
        $(".ancmt-detail").on("click", ".ancmt-bullet-box-close-btn", function () {
          $(".ancmt-wrap").hide()
        }), $("body").not(".ancmt-wrap").bind("click", function () {
          $(".ancmt-wrap").hide()
        })
      },
      countDown: function () {
        var t = 15;
        i = setInterval(function () {
          $("#abb_num").text(--t), t < 0 && ($(".ancmt-wrap").hide(), clearInterval(i))
        }, 1e3)
      },
      fireAction: function () {
        $("#open_announcement").bind("click", function (t) {
          t.stopPropagation(), $(".ancmt-wrap").show()
        })
      },
      showTop: function () {
        a.a.get("top_banner_closed") || $("#top_banner_wrap").show()
      },
      bindTopAction: function () {
        $("#close_banner_top").bind("click", function () {
          $("#top_banner_wrap").hide();
          var t = new Date,
            e = t.getTime(),
            n = new Date(t.toLocaleDateString()).getTime() - 1,
            o = e - n,
            i = 864e5 - o,
            r = new Date;
          r.setTime(i + e), a.a.pureSet("top_banner_closed", !0, r.toGMTString() + ";path=/")
        })
      },
      init: function () {
        var t = this;
        t.addEvent(), t.fireAction()
      }
    }).init(), n.d(e, "a", function () {
      return o
    })
  },
  5: function (t, e) {},
  518: function (t, e, n) {
    "use strict";

    function o(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }

    function a(t) {
      if (Array.isArray(t)) {
        for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
        return n
      }
      return Array.from(t)
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = (n(519), n(1), n(11)),
      r = (n(0), n(31), n(18)),
      c = n(14),
      s = n(520),
      u = n.n(s),
      d = function () {
        function t(t, e) {
          for (var n = 0; n < e.length; n++) {
            var o = e[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, o.key, o)
          }
        }
        return function (e, n, o) {
          return n && t(e.prototype, n), o && t(e, o), e
        }
      }(),
      l = navigator.userAgent.toLowerCase().match(/chrome/),
      f = l ? "您的浏览器暂时不支持体验功能，请升级您的浏览器" : "您现在使用的浏览器暂时不支持体验功能，<br />推荐使用谷歌浏览器Chrome";
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    var p, h, g = window.AudioContext || window.webkitAudioContext,
      v = [];
    try {
      h = new u.a, h.onmessage = function (t) {
        var e;
        (e = v).push.apply(e, a(t.data.buffer))
      }
    } catch (t) {
      console.log(t)
    }
    var w = {
        default: "zh_cn",
        yinese: "zh_cn",
        en_us: "en_us"
      },
      m = {
        zh_cn: "mandarin",
        en_us: "mandarin",
        yinese: "yinese",
        niche: "mandarin"
      },
      b = {
        default: "wss://iat-api.xfyun.cn/v2/iat",
        niche: "wss://iat-niche-api.xfyun.cn/v2/iat"
      },
      y = function () {
        function t() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          o(this, t), this.config = e, this.state = "ing", this.isNiche = !1, this.language = e.language || "zh_cn", this.accent = e.accent || "mandarin"
        }
        return d(t, [{
          key: "start",
          value: function () {
            var t = this;
            if (navigator.getUserMedia && g)
              if (this.state = "ing", this.recorder) v = [], this.connectWebsocker();
              else {
                var e = new g;
                this.context = e, this.recorder = e.createScriptProcessor(0, 1, 1);
                var n = function (e) {
                    var n = t.context.createMediaStreamSource(e);
                    t.mediaStream = n
                    t.recorder.onaudioprocess = function (e) {
                      t.sendData(e.inputBuffer.getChannelData(0))
                    }
                    t.connectWebsocker()
                  },
                  o = function (e) {
                    t.recorder = null, t.mediaStream = null, t.context = null, $.alerts.alert("请求麦克风失败")
                  };
                navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({
                  audio: !0,
                  video: !1
                }).then(function (t) {
                  n(t)
                }).catch(function (t) {
                  o()
                }) : navigator.getUserMedia({
                  audio: !0,
                  video: !1
                }, function (t) {
                  n(t)
                }, function (t) {
                  o()
                })
              }
            else {
              navigator.userAgent.toLowerCase().match(/chrome/);
              $.alerts.alert(f)
            }
          }
        }, {
          key: "stop",
          value: function () {
            this.state = "end";
            try {
              this.mediaStream.disconnect(this.recorder), this.recorder.disconnect()
            } catch (t) {}
          }
        }, {
          key: "sendData",
          value: function (t) {
            h.postMessage({
              command: "transform",
              buffer: t
            })
          }
        }, {
          key: "connectWebsocker",
          value: function () {
            var t = this;
            Object(c.c)(p).then(function (e) {
              if (e.flag) {
                var n = e.data,
                  o = n.url.split("?"),
                  a = void 0;
                if (a = t.isNiche ? b.niche : b[t.language] || b.default, o.splice(0, 1, a), o = o.join("?"), t.appId = n.appId, "WebSocket" in window) t.ws = new WebSocket(o);
                else {
                  if (!("MozWebSocket" in window)) return $.alerts.alert(f), null;
                  t.ws = new MozWebSocket(o)
                }
                return t.ws.onopen = function (e) {
                  t.mediaStream.connect(t.recorder), 
                  t.recorder.connect(t.context.destination), 
                  t.wsOpened(e), 
                  t.config.onStart && t.config.onStart(e)
                }, t.ws.onmessage = function (e) {
                  t.config.onMessage && t.config.onMessage(e), t.wsOnMessage(e)
                }, t.ws.onerror = function (e) {
                  t.stop(), t.config.onError && t.config.onError(e)
                }, t.ws.onclose = function (e) {
                  t.stop(), t.config.onClose && t.config.onClose(e)
                }, !0
              }
              return $.alerts.alert(e.desc || e.msg || "听写体验签名获取失败"), t.stop(), !1
            })
          }
        }, {
          key: "wsOpened",
          value: function () {
            var t = this;
            if (1 === this.ws.readyState) {
              var e = v.splice(0, 1280),
                n = {
                  common: {
                    app_id: this.appId
                  },
                  business: {
                    language: this.language,
                    domain: "iat",
                    accent: this.accent,
                    sample_rate: "16000",
                    vad_eos: 5e3,
                    dwa: "wpgs"
                  },
                  data: {
                    status: 0,
                    format: "audio/L16;rate=16000",
                    encoding: "raw",
                    audio: this.ArrayBufferToBase64(e)
                  }
                };
              this.ws.send(JSON.stringify(n)), this.handlerInterval = setInterval(function () {
                return 1 !== t.ws.readyState ? void clearInterval(t.handlerInterval) : 0 === v.length ? ("end" === t.state && (t.ws.send(JSON.stringify({
                  data: {
                    status: 2,
                    format: "audio/L16;rate=16000",
                    encoding: "raw",
                    audio: ""
                  }
                })), clearInterval(t.handlerInterval)), !1) : (e = v.splice(0, 1280), void t.ws.send(JSON.stringify({
                  data: {
                    status: 1,
                    format: "audio/L16;rate=16000",
                    encoding: "raw",
                    audio: t.ArrayBufferToBase64(e)
                  }
                })))
              }, 40)
            }
          }
        }, {
          key: "wsOnMessage",
          value: function (t) {
            var e = JSON.parse(t.data);
            0 === e.code && 2 === e.data.status && this.ws.close(), 0 !== e.code && ($.alerts.alert(e.code + ":" + e.message), this.ws.close())
          }
        }, {
          key: "setLanguage",
          value: function (t, e, n) {
            this.language = t, this.accent = e, this.isNiche = n
          }
        }, {
          key: "ArrayBufferToBase64",
          value: function (t) {
            for (var e = "", n = new Uint8Array(t), o = n.byteLength, a = 0; a < o; a++) e += String.fromCharCode(n[a]);
            return window.btoa(e)
          }
        }]), t
      }(),
      j = function () {
        function t() {
          var e = this;
          o(this, t);
          var n = new y({
            onClose: function () {
              e.stop(), e.reset()
            },
            onError: function (t) {
              e.stop(), e.reset(), $.alerts.alert("WebSocket连接失败")
            },
            onMessage: function (t) {
              var n = JSON.parse(t.data);
              n.data && n.data.result && e.setResult(n.data.result)
            },
            onStart: function () {
              $("hr").addClass("hr");
              var t = $(".dialect-select").find("option:selected").text();
              $(".taste-content").css("display", "none"), $(".start-taste").addClass("flex-display-1"), $(".dialect-select").css("display", "none"), $(".start-button").text("结束识别"), $(".time-box").addClass("flex-display-1"), $(".dialect").text(t).css("display", "inline-block"), e.counterDown($(".used-time"))
            }
          });
          this.iatRecorder = n, this.counterDownDOM = $(".used-time"), this.counterDownTime = 0, this.text = {
            start: "开始识别",
            stop: "结束识别"
          }, this.resultText = ""
        }
        return d(t, [{
          key: "start",
          value: function () {
            this.iatRecorder.start()
          }
        }, {
          key: "stop",
          value: function () {
            $("hr").removeClass("hr"), this.iatRecorder.stop()
          }
        }, {
          key: "reset",
          value: function () {
            this.counterDownTime = 0, clearTimeout(this.counterDownTimeout), v = [], $(".time-box").removeClass("flex-display-1").css("display", "none"), $(".start-button").text(this.text.start), $(".dialect").css("display", "none"), $(".dialect-select").css("display", "inline-block")
          }
        }, {
          key: "init",
          value: function () {
            var t = this;
            this.initGeetest(), this.renderSelect(), $("#taste_button").click(function () {
              navigator.getUserMedia && g && h ? t.captchaObj && t.captchaObj.verify() : $.alerts.alert(f)
            }), $(".start-button").click(function () {
              $(this).text() === t.text.start ? ($("#result_output").text(""), t.resultText = "", t.captchaObj && t.captchaObj.verify()) : (t.reset(), t.stop())
            }), $("#dialect_select").change(function () {
              var e = this.value,
                n = "niche" === $(this).children("option:selected").data("niche"),
                o = w[e] || w.default,
                a = void 0 === m[e] ? e : m[e];
              n && "yinese" !== e && (o = e, a = m.niche), t.iatRecorder.setLanguage(o, a, n)
            })
          }
        }, {
          key: "initGeetest",
          value: function (t) {
            function e() {
              return t.apply(this, arguments)
            }
            return e.toString = function () {
              return t.toString()
            }, e
          }(function () {
            var t = this;
            Object(c.h)().then(function (e) {
              !0 === e.flag ? initGeetest({
                gt: e.data.gt,
                challenge: e.data.challenge,
                offline: !e.data.success,
                new_captcha: e.data.new_captcha,
                product: "bind",
                width: "300px"
              }, function (e) {
                t.captchaObj = e, e.onReady(function () {}).onSuccess(function () {
                  if (!(p = e.getValidate())) return $.alerts.alert("请完成验证");
                  t.start()
                }).onError(function () {
                  $.alerts.alert("验证码校验失败，请重试")
                })
              }) : $.alerts.alert("系统异常，请稍后重试")
            })
          })
        }, {
          key: "setResult",
          value: function (t) {
            for (var e = "", n = "", o = t.ws || [], a = 0; a < o.length; a++) e += o[a].cw[0].w;
            t.pgs && "apd" !== t.pgs || (this.resultText = $("#result_output").text()), n = this.resultText + e, $("#result_output").text(n)
          }
        }, {
          key: "counterDown",
          value: function () {
            var t = this;
            if (60 === this.counterDownTime) this.counterDownDOM.text("01: 00"), this.stop();
            else {
              if (this.counterDownTime > 60) return this.reset(), !1;
              this.counterDownTime >= 0 && this.counterDownTime < 10 ? this.counterDownDOM.text("00: 0" + this.counterDownTime) : this.counterDownDOM.text("00: " + this.counterDownTime)
            }
            this.counterDownTime++, this.counterDownTimeout = setTimeout(function () {
              t.counterDown()
            }, 1e3)
          }
        }, {
          key: "renderSelect",
          value: function () {
            Object(c.b)().then(function (t) {
              if (t.flag) {
                for (var e = t.data, n = '<option value="zh_cn">中文普通话</option><option value="en_us">英文</option>', o = 0; o < e.length; o++) n += '<option value="' + e[o].id.code + '" data-niche="' + e[o].extension + '">' + e[o].desc + "</option>";
                $("#dialect_select").html(n)
              } else $.alerts.alert(t.desc || t.msg || "获取语种/方言列表失败")
            })
          }
        }]), t
      }(),
      k = new j,
      x = k;
    $(function () {
      Object(i.a)(), Object(i.b)(), x.init(), $(".answer-table .buy-btn").click(function () {
        var t = $(this).attr("package-id"),
          e = {
            wareId: "1003",
            packageId: t,
            serviceName: "语音听写",
            businessId: "iat"
          };
        Object(r.a)(e, {
          btnStr: ["1003006", "1003007"].indexOf(t) > -1 ? "领取" : "购买"
        })
      })
    })
  },
  519: function (t, e) {},
  520: function (t, e, n) {
    t.exports = function () {
      return new Worker(n.p + "4cb59091912e9ef31ced.worker.js")
    }
  }
}, [518]);
//# sourceMappingURL=voicedictation.afe18d4bbb4241428322.bundle.js.map