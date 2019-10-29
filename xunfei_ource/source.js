webpackJsonp([13],{

  /***/ 10:
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return floatMenu; });
  /**
   * Created by lycheng on 2017/12/4.
   * 浮动导航，默认是右边悬浮，需要改变位置可使用
   * floatMenu.config.position重新赋值
   */
  
  // 右边导航
  var floatMenu = {
    config: {
      top: 90,
      $container: $('html,body'),
      checkedClass: 'nav-checked',
      position: {
        top: {
          position: 'absolute',
          top: '600px',
          bottom: 'auto'
        },
        middle: {
          position: 'fixed',
          top: '150px',
          bottom: 'auto'
        },
        bottom: {
          // position: 'fixed',
          // top: '500px',
          // bottom: '0'
        },
        minTop: {
          position: 'fixed',
          top: '550px',
          bottom: 'auto'
        },
        minBottom: {
          position: 'fixed',
          top: '150px',
          bottom: 'auto'
        }
      }
    },
    init: function init() {
      floatMenu.bindEvent();
      floatMenu.methods.rePosition();
    },
    bindEvent: function bindEvent() {
      $('.js-service-nav-fall li').off('click').on('click', function () {
        var target = $(this).attr('target');
        floatMenu.methods.toPosition(target);
      });
      window.onscroll = function () {
        floatMenu.methods.rePosition();
      };
      window.onscroll();
    },
    methods: {
      toPosition: function toPosition(target) {
        var top = $('.' + target).offset().top - floatMenu.config.top;
        floatMenu.config.$container.animate({ scrollTop: Math.floor(top) }, 500);
      },
      rePosition: function rePosition() {
        var tops = [];
        var top = $('body').scrollTop() || $('html').scrollTop();
        var $navCon = $('.js-service-nav-fall');
        var $navItem = $('.js-service-nav-fall li');
        var targets = [];
        var i = 0;
        var position = floatMenu.config.position;
        $navItem.each(function () {
          targets.push($(this).attr('target'));
        });
  
        for (i = 0; i < targets.length; i++) {
          tops.push(Math.floor($('.' + targets[i]).offset().top) - floatMenu.config.top);
        }
        tops.push(tops[i - 1] + $('.' + targets[i - 1]).height());
  
        for (i = 0; i < targets.length; i++) {
          if (top >= tops[i]) {
            $navItem.removeClass(floatMenu.config.checkedClass);
            $navItem.filter('[target="' + targets[i] + '"]').addClass(floatMenu.config.checkedClass);
          }
        }
  
        if (top >= tops[0]) {
          if (top + $navCon.height() + floatMenu.config.top > tops[tops.length - 1]) {
            $navCon.css(position.bottom);
          } else {
            $navCon.css(position.middle);
          }
        } else {
          $navCon.css(position.top);
        }
      }
  
    }
  };
  
  
  /***/ }),
  
  /***/ 11:
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return serviceQA; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return serviceTopbar; });
  /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_config__ = __webpack_require__(0);
  /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_libs_utils_suspension__ = __webpack_require__(4);
  /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_libs_utils_float_menu__ = __webpack_require__(10);
  /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_js_libs_utils__ = __webpack_require__(6);
  /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_js_api_user__ = __webpack_require__(3);
  /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_js_libs_utils_login__ = __webpack_require__(8);
  /**
   * Created by lycheng on 2017/12/4.
   * 所有service都需要引入
   */
  
  
  
  
  
  
  
  
  function serviceQA() {
    var $serviceQA = $('.service-item-qa');
    // 问答题超过两组时隐藏超出部分
    if ($serviceQA.length) {
      var oLi = $serviceQA.find('li');
      if (oLi.length <= 4) {
        $('.service-qa-more').hide();
      }
      for (var i = 0; i < oLi.length; i++) {
        if (i >= 4) {
          oLi.eq(i).hide();
        }
      }
    }
    // 点击查看更多显示超出部分
    $('.service-qa-more').click(function () {
      var oLi = $serviceQA.find('li');
      oLi.show();
      $(this).hide();
    });
  }
  
  function serviceTopbar() {
    var $serviceTopbar = $('.service-topbar');
    if ($serviceTopbar.length) {
      $(window).scroll(function () {
        var windowPosition = $(window).scrollTop();
        if (windowPosition >= 450) {
          $('.service-topbar').show();
        } else {
          $('.service-topbar').hide();
        }
      });
    }
  }
  
  // 滑动到产品价格
  function scrollToPrice() {
    $('html,body').animate({
      scrollTop: $('.service-item-price').offset().top - 100
    }, 1e3);
  }
  
  function bindEvent() {
    // banner下立即申请
    $('.banner-to-service-manage, .banner-to-service-manage').click(function () {
      var serviceKey = this.dataset.serviceKey;
      if (serviceKey === 'face' || serviceKey === 'isv' || serviceKey === 'xpush') {
        serviceKey = 'base';
      }
      Object(__WEBPACK_IMPORTED_MODULE_3_js_libs_utils__["f" /* toUrl */])(__WEBPACK_IMPORTED_MODULE_0_config__["a" /* config */].CONSOLE + 'services/' + serviceKey, '_blank');
    });
    $('.to-price').click(function () {
      scrollToPrice();
    });
    // 滑动到产品价格
    var hash = location.hash;
    if (hash === '#price') {
      scrollToPrice();
    }
    if (Object(__WEBPACK_IMPORTED_MODULE_3_js_libs_utils__["c" /* getQueryString */])('target') === 'price') {
      scrollToPrice();
    }
  }
  bindEvent();
  Object(__WEBPACK_IMPORTED_MODULE_1_js_libs_utils_suspension__["a" /* suspension */])();
  if ($('.js-service-nav-fall').length) {
    __WEBPACK_IMPORTED_MODULE_2_js_libs_utils_float_menu__["a" /* floatMenu */].init();
  }
  
  
  
  /***/ }),
  
  /***/ 14:
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  /* unused harmony export getServiceOpenApps */
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getApps; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getMobileappSdkList; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return openService; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return openOcrService; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return openNewFrameService; });
  /* unused harmony export webTTS */
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return mtranslate; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return lexicalAnalysist; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getOtsResult; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return productKesa; });
  /* unused harmony export getOnlineAudioSrc */
  /* unused harmony export getVoiceAudioSrc */
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return getValidate; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getIatSign; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getIatLanguage; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return getTtsSpeakList; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getTtsSign; });
  /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_polyfill__ = __webpack_require__(1);
  /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_polyfill___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_polyfill__);
  /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_config__ = __webpack_require__(0);
  /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_js_libs_utils_cookie__ = __webpack_require__(2);
  /**
   * Created by lycheng on 2017/11/23.
   * 产品服务页相关接口
   */
  
  
  
  
  /**
   * 获取用户app
   * @param servicesId
   * @returns {Promise}
   */
  function getServiceOpenApps(servicesId, getAppUrl) {
    return new Promise(function (resolve, reject) {
      var url = '/herapi/user/get_app_list_by_service?service_id=' + btoa(servicesId);
      jQuery.ajax({
        url: getAppUrl || url,
        type: 'get',
        dataType: 'json',
        success: function success(data) {
          resolve({
            code: 0,
            data: data
          });
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 获取用户app
   * 代替getServiceOpenApps
   */
  function getApps() {
    return new Promise(function (resolve, reject) {
      jQuery.ajax({
        url: '/herapi/product/getAppList',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: function success(result) {
          resolve(result);
        },
        error: function error(s) {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 开通服务的接口
   * @param servicesId
   * @param appId
   * @returns {Promise}
   */
  function openService(servicesId, appId) {
    return new Promise(function (resolve, reject) {
      jQuery.ajax({
        type: 'get',
        url: __WEBPACK_IMPORTED_MODULE_1_config__["a" /* config */].API + 'mycloud/app/accessService',
        dataType: 'json',
        data: {
          'app_id': appId,
          'service': servicesId
        },
        success: function success(result) {
          resolve({
            code: 0,
            data: result
          });
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 开通ocr服务的接口
   * @param servicesId
   * @param appId
   * @returns {Promise}
   */
  function openOcrService(servicesId, appId) {
    return new Promise(function (resolve, reject) {
      var ssoSessionId = __WEBPACK_IMPORTED_MODULE_2_js_libs_utils_cookie__["a" /* cookie */].get('ssoSessionId');
      var accountId = __WEBPACK_IMPORTED_MODULE_2_js_libs_utils_cookie__["a" /* cookie */].get('account_id');
      $.ajax({
        type: 'get',
        url: __WEBPACK_IMPORTED_MODULE_1_config__["a" /* config */].CONSOLE + 'dashboard/app/jsonp/service/add',
        dataType: 'jsonp',
        data: {
          appId: appId,
          services: servicesId,
          ssoSessionId: ssoSessionId,
          account_id: accountId
        },
        jsonp: 'callback',
        jsonpCallback: 'handleResponse',
        success: function success(result) {
          resolve({
            code: 0,
            data: result
          });
        },
        error: function error(result) {
          resolve(result);
        }
      });
    }).catch(function (reason) {
      console.log('catch:', reason);
    });
  }
  
  /**
   * 开通新框架服务的接口
   * @param servicesId
   * @param appId
   * @returns {Promise}
   */
  function openNewFrameService(servicesId, appId) {
    return new Promise(function (resolve, reject) {
      var ssoSessionId = __WEBPACK_IMPORTED_MODULE_2_js_libs_utils_cookie__["a" /* cookie */].get('ssoSessionId');
      var accountId = __WEBPACK_IMPORTED_MODULE_2_js_libs_utils_cookie__["a" /* cookie */].get('account_id');
      $.ajax({
        type: 'get',
        url: __WEBPACK_IMPORTED_MODULE_1_config__["a" /* config */].CONSOLE + 'dashboard/webapi/jsonp/addService/v1',
        dataType: 'jsonp',
        data: {
          appId: appId,
          services: servicesId,
          ssoSessionId: ssoSessionId,
          account_id: accountId
        },
        jsonp: 'callback',
        jsonpCallback: 'handleResponse',
        success: function success(result) {
          resolve({
            code: 0,
            data: result
          });
        },
        error: function error(result) {
          resolve(result);
        }
      });
    }).catch(function (reason) {
      console.log('catch:', reason);
    });
  }
  
  /**
   * 语音合成的接口
   * @param params：
   * {
   *   vcn: aisxping,
   *   vol: 7,
   *   spd: medium,
   *   textPut: '', // 输入的文本
   * }
   * @returns {Promise}
   */
  function webTTS(params) {
    return new Promise(function (resolve, reject) {
      jQuery.ajax({
        type: 'post',
        url: '/herapi/solution/synthesis',
        dataType: 'json',
        data: params,
        success: function success(result) {
          resolve(result);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  function mtranslate(params) {
    // {
    //   fromLang: trans.data.source,
    //     toLang: trans.data.dist,
    //   originText: text
    // }
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/herapi/product/translate',
        type: 'post',
        data: params,
        success: function success(result) {
          // result.code = result.flag ? 0 : -1
          resolve(result);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 获取开放统计的sdkList
   * @returns {Promise}
   */
  function getMobileappSdkList() {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/herapi/product/getSdkList',
        success: function success(result) {
          resolve(result);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 词法分析接口
   * @returns {Promise}
   */
  function lexicalAnalysist(params) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/herapi/index/webltp',
        type: 'POST',
        dataType: 'json',
        data: params,
        success: function success(result) {
          resolve(result);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 机器翻译体验接口
   * @returns {Promise}
   */
  function getOtsResult(params) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/herapi/product/ots',
        type: 'POST',
        dataType: 'json',
        data: params,
        success: function success(result) {
          resolve(result);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 关键词提取type传：ke
   * 如果是调用情感分析type传：sa
   * 关键词 && 情感分析接口
   * @returns {Promise}
   */
  function productKesa(params) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/herapi/product/kesa',
        type: 'POST',
        dataType: 'json',
        data: params,
        success: function success(result) {
          resolve(result);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 获取在线语音合成的音频src
   * @returns {Promise}
   */
  function getOnlineAudioSrc(params, challenge, validate, seccode) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/herapi/solution/synthesis/v2?challenge=' + challenge + '&validate=' + validate + '&seccode=' + seccode,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(params),
        contentType: 'application/json; charset=utf-8',
        success: function success(result) {
          resolve(result);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  function getVoiceAudioSrc(params, challenge, validate, seccode) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/herapi/solution/dictation/v2?challenge=' + challenge + '&validate=' + validate + '&seccode=' + seccode,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(params),
        contentType: 'application/json; charset=utf-8',
        success: function success(result) {
          resolve(result);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 获取极验数据进行初始化
   * @returns {Promise}
   */
  function getValidate() {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: '/herapi/plug/validate',
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function success(result) {
          resolve(result);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  /**
   * 获取听写websocket链接
   * @returns {Promise}
   */
  function getIatSign(geettestResult) {
    return new Promise(function (resolve, reject) {
      jQuery.ajax({
        url: '/herapi/product/iat_sign',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {
          challenge: geettestResult.geetest_challenge,
          validate: geettestResult.geetest_validate,
          seccode: geettestResult.geetest_seccode
        },
        success: function success(data) {
          resolve(data);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  function getIatLanguage() {
    return new Promise(function (resolve, reject) {
      jQuery.ajax({
        url: '/herapi/product/iat_language_list',
        type: 'post',
        dataType: 'json',
        cache: false,
        success: function success(data) {
          resolve(data);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 获取合成websocket链接
   * @returns {Promise}
   */
  function getTtsSign(geettestResult) {
    return new Promise(function (resolve, reject) {
      jQuery.ajax({
        url: '/herapi/product/tts_sign',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {
          challenge: geettestResult.geetest_challenge,
          validate: geettestResult.geetest_validate,
          seccode: geettestResult.geetest_seccode
        },
        success: function success(data) {
          resolve(data);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  /**
   * 合成体验发音人参数列表获取接口
   * @param grade 发音人等级（默认是0，0特色发音人，1精品发音人）
   * @returns {Promise}
   */
  function getTtsSpeakList(_ref) {
    var _ref$grade = _ref.grade,
        grade = _ref$grade === undefined ? 0 : _ref$grade;
  
    return new Promise(function (resolve, reject) {
      jQuery.ajax({
        url: '/herapi/product/tts_language_list',
        type: 'post',
        dataType: 'json',
        data: {
          grade: grade
        },
        cache: false,
        success: function success(data) {
          resolve(data);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  
  
  /***/ }),
  
  /***/ 18:
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  
  // EXTERNAL MODULE: ./node_modules/_babel-polyfill@6.26.0@babel-polyfill/lib/index.js
  var lib = __webpack_require__(1);
  var lib_default = /*#__PURE__*/__webpack_require__.n(lib);
  
  // EXTERNAL MODULE: ./src/js/libs/utils.js
  var utils = __webpack_require__(6);
  
  // EXTERNAL MODULE: ./src/js/api/user.js
  var user = __webpack_require__(3);
  
  // EXTERNAL MODULE: ./src/js/config/prod.js
  var prod = __webpack_require__(0);
  
  // CONCATENATED MODULE: ./src/js/api/package.js
  /**
   * Created by lycheng on 2017/11/23.
   * 产品服务页相关接口
   */
  
  
  
  /**
   * 判断package需要进行的认证状态
   * @param packageId
   * @param async
   * @returns {Promise}
   */
  function getPackageCerType(_ref, _ref2) {
    var packageId = _ref.packageId;
    var _ref2$async = _ref2.async,
        async = _ref2$async === undefined ? true : _ref2$async;
  
    return new Promise(function (resolve, reject) {
      jQuery.ajax({
        url: '/herapi/package/getPackageCerType',
        type: 'get',
        dataType: 'json',
        async: async,
        cache: false,
        data: {
          packageId: packageId
        },
        success: function success(data) {
          resolve(data);
        },
        error: function error() {
          resolve({});
        }
      });
    });
  }
  
  
  // EXTERNAL MODULE: ./src/js/libs/utils-login.js + 5 modules
  var utils_login = __webpack_require__(8);
  
  // CONCATENATED MODULE: ./src/js/libs/utils-services-buy.js
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return goServiceBuy; });
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return justGoServiceBuy; });
  /**
   * Created by jingzhao5 on 2018/02/28.
   */
  
  
  
  
  
  
  
  /**
   * 示例
   let params = {
    wareId: '2001',
    packageId: packageId,
    serviceName: '离线语音合成',
    businessId: 'aisound'
  }
   */
  
  function goServiceBuy(urlParams) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$btnStr = _ref.btnStr,
        btnStr = _ref$btnStr === undefined ? '购买' : _ref$btnStr,
        callback = _ref.callback;
  
    // -1不需要认证（免费），0默认值需要进行认证，1需要进行个人以上认证（含个人企业），2需要进行企业以上认证
    Promise.all([Object(user["b" /* checkUserCertificate */])({ async: false }), getPackageCerType({
      packageId: urlParams.packageId || urlParams.selectPackageId
    }, { async: false })]).then(function (values) {
      var url = prod["a" /* config */].CONSOLE + 'sale/buy?';
      for (var p in urlParams) {
        if (urlParams[p]) {
          url += p + '=' + urlParams[p] + '&';
        }
      }
      url = url.substring(0, url.length - 1);
  
      var certificateResult = values[0];
      var packageResult = values[1];
      if (packageResult.code === undefined) {
        callback ? callback(url) : window.open(url);
        return;
      }
      if (certificateResult.code === undefined) {
        return;
      }
      if (certificateResult.code === 80000 || certificateResult.code === 80003) {
        Object(utils_login["b" /* showLoginModal */])();
        return;
      }
      var certificateData = certificateResult.data;
      var packageData = packageResult.data;
      // 不需要实名认证
      if (packageData === -1) {
        callback ? callback(url) : window.open(url);
        return;
      }
      // 下面都是需要认证
      // 需要企业认证
      if (packageData === 2) {
        // 认证是个人认证
        if (certificateData.type !== 'BUSINESS_TEAM' && certificateData.type !== 'COMPANY') {
          // 弹出去企业认证框
          jAlert('\u60A8\u8FD8\u672A\u5B8C\u6210\u4F01\u4E1A\u5B9E\u540D\u8BA4\u8BC1\uFF0C\u8BA4\u8BC1\u540E\u53EF' + btnStr + '~', function (flag) {
            if (flag) {
              window.open(prod["a" /* config */].CONSOLE + 'user/authentication');
            }
          }, '去认证');
          return;
        }
      }
      // 未实名认证完成
      if (!certificateData.flag) {
        jAlert('\u60A8\u8FD8\u672A\u5B8C\u6210\u5B9E\u540D\u8BA4\u8BC1\uFF0C\u8BA4\u8BC1\u540E\u53EF' + btnStr + '~', function (flag) {
          if (flag) {
            window.open(prod["a" /* config */].CONSOLE + 'user/authentication');
          }
        }, '去认证');
        return;
      }
      // 实名认证满足要求
      callback ? callback(url) : window.open(url);
    }).catch(function (e) {
      console.log(e);
    });
  }
  
  function justGoServiceBuy(urlParams) {
    var url = prod["a" /* config */].CONSOLE + 'sale/buy?';
    for (var p in urlParams) {
      if (urlParams[p]) {
        url += p + '=' + urlParams[p] + '&';
      }
    }
    url = url.substring(0, url.length - 1);
    window.open(url);
  }
  
  
  
  /***/ }),
  
  /***/ 4:
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  
  // EXTERNAL MODULE: ./src/js/api/user.js
  var user = __webpack_require__(3);
  
  // EXTERNAL MODULE: ./src/js/libs/utils-layer.js
  var utils_layer = __webpack_require__(7);
  
  // EXTERNAL MODULE: ./src/js/libs/utils-cookie.js
  var utils_cookie = __webpack_require__(2);
  
  // EXTERNAL MODULE: ./src/scss/component/announcement.scss
  var announcement = __webpack_require__(5);
  var announcement_default = /*#__PURE__*/__webpack_require__.n(announcement);
  
  // CONCATENATED MODULE: ./src/js/libs/utils-announcement.js
  /**
   * 公告
   */
  
  
  var _countDown = null;
  var ancmtModel = {
    addEvent: function addEvent() {
      $('.ancmt-detail').on('click', '.ancmt-bullet-box-close-btn', function () {
        $('.ancmt-wrap').hide();
      });
      $('body').not('.ancmt-wrap').bind('click', function () {
        $('.ancmt-wrap').hide();
      });
    },
    countDown: function countDown() {
      var allTime = 15;
      _countDown = setInterval(function () {
        $('#abb_num').text(--allTime);
        if (allTime < 0) {
          $('.ancmt-wrap').hide();
          clearInterval(_countDown);
        }
      }, 1000);
    },
    fireAction: function fireAction() {
      $('#open_announcement').bind('click', function (e) {
        e.stopPropagation();
        $('.ancmt-wrap').show();
      });
    },
    showTop: function showTop() {
      if (!utils_cookie["a" /* cookie */].get('top_banner_closed')) {
        $('#top_banner_wrap').show();
      }
    },
    bindTopAction: function bindTopAction() {
      $('#close_banner_top').bind('click', function () {
        $('#top_banner_wrap').hide();
        var curDate = new Date();
        var curTamp = curDate.getTime();
        var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1;
        var passedTamp = curTamp - curWeeHours;
        var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
        var leftTime = new Date();
        leftTime.setTime(leftTamp + curTamp);
        utils_cookie["a" /* cookie */].pureSet('top_banner_closed', true, leftTime.toGMTString() + ';path=/');
      });
    },
    init: function init() {
      var that = this;
      that.addEvent();
      that.fireAction();
      // that.showTop()
      // that.bindTopAction()
      // that.countDown()
    }
  };
  ancmtModel.init();
  // CONCATENATED MODULE: ./src/js/libs/utils-suspension.js
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return suspension; });
  /**
   * Created by lycheng on 2017/11/29.
   * 悬浮的狗，返回顶部
   */
  
  
  
  
  /**
   * 右侧悬浮
   * @param s:距离顶部的高度
   */
  function suspension(s, isIndex) {
    var $suspension = $('.suspension');
    if (!$suspension.length) {
      return;
    }
    var $backTop = $('.suspension-back-top');
    var $susIcon = $('.sus-icon');
    var winH = $(window).height();
    $(window).scroll(function () {
      var scrollTop = $(window).scrollTop();
      if (scrollTop < s - winH / 2) {
        $suspension.css({
          position: 'absolute',
          top: s + 'px'
        });
      } else {
        $suspension.css({
          position: 'fixed',
          top: '50%'
        });
      }
      if (scrollTop > winH / 2) {
        $backTop.show();
      } else {
        $backTop.hide();
      }
    });
    $(window).scroll();
    $backTop.click(function () {
      $('body, html').animate({ 'scrollTop': 0 }, 500);
      return false;
    });
  }
  
  
  /***/ }),
  
  /***/ 5:
  /***/ (function(module, exports) {
  
  // removed by extract-text-webpack-plugin
  
  /***/ }),
  
  /***/ 529:
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  
  // EXTERNAL MODULE: ./src/scss/services/voicedictation.scss
  var voicedictation = __webpack_require__(530);
  var voicedictation_default = /*#__PURE__*/__webpack_require__.n(voicedictation);
  
  // EXTERNAL MODULE: ./node_modules/_babel-polyfill@6.26.0@babel-polyfill/lib/index.js
  var lib = __webpack_require__(1);
  var lib_default = /*#__PURE__*/__webpack_require__.n(lib);
  
  // EXTERNAL MODULE: ./src/js/libs/utils-services.js
  var utils_services = __webpack_require__(11);
  
  // EXTERNAL MODULE: ./src/js/config/prod.js
  var prod = __webpack_require__(0);
  
  // EXTERNAL MODULE: ./src/js/libs/gt.js
  var gt = __webpack_require__(31);
  var gt_default = /*#__PURE__*/__webpack_require__.n(gt);
  
  // EXTERNAL MODULE: ./src/js/libs/utils-services-buy.js + 1 modules
  var utils_services_buy = __webpack_require__(18);
  
  // EXTERNAL MODULE: ./src/js/api/services.js
  var services = __webpack_require__(14);
  
  // EXTERNAL MODULE: ./src/js/libs/transform-pcm.worker.js
  var transform_pcm_worker = __webpack_require__(531);
  var transform_pcm_worker_default = /*#__PURE__*/__webpack_require__.n(transform_pcm_worker);
  
  // CONCATENATED MODULE: ./src/js/libs/utils-iat-recorder.js
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
  
  /**
   * Created by lycheng on 2019/8/12.
   */
  
  
  
  var isChrome = navigator.userAgent.toLowerCase().match(/chrome/);
  var notSupportTip = isChrome ? '您的浏览器暂时不支持体验功能，请升级您的浏览器' : '您现在使用的浏览器暂时不支持体验功能，<br />推荐使用谷歌浏览器Chrome';
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  
  var buffer = [];
  var geettestResult;
  var recorderWorker;
  try {
    recorderWorker = new transform_pcm_worker_default.a();
    recorderWorker.onmessage = function (e) {
      var _buffer;
  
      (_buffer = buffer).push.apply(_buffer, _toConsumableArray(e.data.buffer));
    };
  } catch (e) {
    console.log(e);
  }
  
  var languageConfig = {
    default: 'zh_cn',
    yinese: 'zh_cn',
    en_us: 'en_us'
  };
  var accentConfig = {
    zh_cn: 'mandarin',
    en_us: 'mandarin',
    yinese: 'yinese',
    niche: 'mandarin'
  };
  var websocketUrlConfig = {
    default: 'wss://iat-api.xfyun.cn/v2/iat',
    niche: 'wss://iat-niche-api.xfyun.cn/v2/iat'
  };
  
  var utils_iat_recorder_IatRecorder = function () {
    function IatRecorder() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  
      _classCallCheck(this, IatRecorder);
  
      this.config = config;
      this.state = 'ing';
      this.isNiche = false;
      this.language = config.language || 'zh_cn';
      this.accent = config.accent || 'mandarin';
    }
  
    _createClass(IatRecorder, [{
      key: 'start',
      value: function start() {
        var _this = this;
  
        if (navigator.getUserMedia && AudioContext) {
          this.state = 'ing';
          if (!this.recorder) {
            var context = new AudioContext();
            this.context = context;
            this.recorder = context.createScriptProcessor(0, 1, 1);
            var getMediaSuccess = function getMediaSuccess(stream) {
              // 从麦克风的输入流创建源节点
              var mediaStream = _this.context.createMediaStreamSource(stream);
              _this.mediaStream = mediaStream;
              // 用于录音的processor节点
              _this.recorder.onaudioprocess = function (e) {
                _this.sendData(e.inputBuffer.getChannelData(0));
              };
              _this.connectWebsocker();
            };
            var getMediaFail = function getMediaFail(e) {
              _this.recorder = null;
              _this.mediaStream = null;
              _this.context = null;
              $.alerts.alert('请求麦克风失败');
            };
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
              navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
              }).then(function (stream) {
                getMediaSuccess(stream);
              }).catch(function (e) {
                getMediaFail(e);
              });
            } else {
              navigator.getUserMedia({
                audio: true,
                video: false
              }, function (stream) {
                getMediaSuccess(stream);
              }, function (e) {
                getMediaFail(e);
              });
            }
          } else {
            buffer = [];
            this.connectWebsocker();
          }
        } else {
          var isChrome = navigator.userAgent.toLowerCase().match(/chrome/);
          $.alerts.alert(notSupportTip);
        }
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.state = 'end';
        try {
          this.mediaStream.disconnect(this.recorder);
          this.recorder.disconnect();
        } catch (e) {}
      }
    }, {
      key: 'sendData',
      value: function sendData(buffer) {
        recorderWorker.postMessage({
          command: 'transform',
          buffer: buffer
        });
      }
    }, {
      key: 'connectWebsocker',
      value: function connectWebsocker() {
        var _this2 = this;
  
        Object(services["c" /* getIatSign */])(geettestResult).then(function (result) {
          if (result.flag) {
            var data = result.data;
            var url = data.url.split('?');
            var urlConfig = void 0;
            if (_this2.isNiche) {
              urlConfig = websocketUrlConfig['niche'];
            } else {
              urlConfig = websocketUrlConfig[_this2.language] || websocketUrlConfig.default;
            }
            url.splice(0, 1, urlConfig);
            url = url.join('?');
            _this2.appId = data.appId;
            if ('WebSocket' in window) {
              _this2.ws = new WebSocket(url);
            } else if ('MozWebSocket' in window) {
              _this2.ws = new MozWebSocket(url);
            } else {
              $.alerts.alert(notSupportTip);
              return null;
            }
            _this2.ws.onopen = function (e) {
              _this2.mediaStream.connect(_this2.recorder);
              _this2.recorder.connect(_this2.context.destination);
              _this2.wsOpened(e);
              _this2.config.onStart && _this2.config.onStart(e);
            };
            _this2.ws.onmessage = function (e) {
              _this2.config.onMessage && _this2.config.onMessage(e);
              _this2.wsOnMessage(e);
            };
            _this2.ws.onerror = function (e) {
              _this2.stop();
              _this2.config.onError && _this2.config.onError(e);
            };
            _this2.ws.onclose = function (e) {
              _this2.stop();
              _this2.config.onClose && _this2.config.onClose(e);
            };
            return true;
          } else {
            $.alerts.alert(result.desc || result.msg || '听写体验签名获取失败');
            _this2.stop();
            return false;
          }
        });
      }
    }, {
      key: 'wsOpened',
      value: function wsOpened() {
        var _this3 = this;
  
        if (this.ws.readyState !== 1) {
          return;
        }
        var audioData = buffer.splice(0, 1280);
        var params = {
          'common': {
            'app_id': this.appId
          },
          'business': {
            'language': this.language,
            'domain': 'iat',
            'accent': this.accent,
            'sample_rate': '16000',
            'vad_eos': 5000,
            'dwa': 'wpgs'
          },
          'data': {
            'status': 0,
            'format': 'audio/L16;rate=16000',
            'encoding': 'raw',
            'audio': this.ArrayBufferToBase64(audioData)
          }
        };
        this.ws.send(JSON.stringify(params));
        this.handlerInterval = setInterval(function () {
          // websocket未连接
          if (_this3.ws.readyState !== 1) {
            clearInterval(_this3.handlerInterval);
            return;
          }
          if (buffer.length === 0) {
            if (_this3.state === 'end') {
              _this3.ws.send(JSON.stringify({
                'data': {
                  'status': 2,
                  'format': 'audio/L16;rate=16000',
                  'encoding': 'raw',
                  'audio': ''
                }
              }));
              clearInterval(_this3.handlerInterval);
            }
            return false;
          }
          audioData = buffer.splice(0, 1280);
          // 中间帧
          _this3.ws.send(JSON.stringify({
            'data': {
              'status': 1,
              'format': 'audio/L16;rate=16000',
              'encoding': 'raw',
              'audio': _this3.ArrayBufferToBase64(audioData)
            }
          }));
        }, 40);
      }
    }, {
      key: 'wsOnMessage',
      value: function wsOnMessage(e) {
        var jsonData = JSON.parse(e.data);
        // 识别结束
        if (jsonData.code === 0 && jsonData.data.status === 2) {
          this.ws.close();
        }
        if (jsonData.code !== 0) {
          $.alerts.alert(jsonData.code + ':' + jsonData.message);
          this.ws.close();
        }
      }
    }, {
      key: 'setLanguage',
      value: function setLanguage(language, accent, isNiche) {
        this.language = language;
        this.accent = accent;
        this.isNiche = isNiche;
      }
    }, {
      key: 'ArrayBufferToBase64',
      value: function ArrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      }
    }]);
  
    return IatRecorder;
  }();
  
  var utils_iat_recorder_IatTaste = function () {
    function IatTaste() {
      var _this4 = this;
  
      _classCallCheck(this, IatTaste);
  
      var iatRecorder = new utils_iat_recorder_IatRecorder({
        onClose: function onClose() {
          _this4.stop();
          _this4.reset();
        },
        onError: function onError(data) {
          _this4.stop();
          _this4.reset();
          $.alerts.alert('WebSocket连接失败');
        },
        onMessage: function onMessage(e) {
          var str = '';
          var jsonData = JSON.parse(e.data);
          if (jsonData.data && jsonData.data.result) {
            _this4.setResult(jsonData.data.result);
          }
        },
        onStart: function onStart() {
          $('hr').addClass('hr');
          var dialect = $('.dialect-select').find('option:selected').text();
          $('.taste-content').css('display', 'none');
          $('.start-taste').addClass('flex-display-1');
          $('.dialect-select').css('display', 'none');
          $('.start-button').text('结束识别');
          $('.time-box').addClass('flex-display-1');
          $('.dialect').text(dialect).css('display', 'inline-block');
          _this4.counterDown($('.used-time'));
        }
      });
      this.iatRecorder = iatRecorder;
      this.counterDownDOM = $('.used-time');
      this.counterDownTime = 0;
  
      this.text = {
        start: '开始识别',
        stop: '结束识别'
      };
      this.resultText = '';
    }
  
    _createClass(IatTaste, [{
      key: 'start',
      value: function start() {
        this.iatRecorder.start();
      }
    }, {
      key: 'stop',
      value: function stop() {
        $('hr').removeClass('hr');
        this.iatRecorder.stop();
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.counterDownTime = 0;
        clearTimeout(this.counterDownTimeout);
        buffer = [];
        $('.time-box').removeClass('flex-display-1').css('display', 'none');
        $('.start-button').text(this.text.start);
        $('.dialect').css('display', 'none');
        $('.dialect-select').css('display', 'inline-block');
      }
    }, {
      key: 'init',
      value: function init() {
        var self = this;
        this.initGeetest();
        this.renderSelect();
        $('#taste_button').click(function () {
          if (navigator.getUserMedia && AudioContext && recorderWorker) {
            self.captchaObj && self.captchaObj.verify();
          } else {
            $.alerts.alert(notSupportTip);
          }
        });
        $('.start-button').click(function () {
          if ($(this).text() === self.text.start) {
            $('#result_output').text('');
            self.resultText = '';
            self.captchaObj && self.captchaObj.verify();
          } else {
            self.reset();
            self.stop();
          }
        });
        $('#dialect_select').change(function () {
          var val = this.value;
          var isNiche = $(this).children('option:selected').data('niche') === 'niche';
          var language = languageConfig[val] || languageConfig['default'];
          var accent = typeof accentConfig[val] === 'undefined' ? val : accentConfig[val];
          if (isNiche && val !== 'yinese') {
            language = val;
            accent = accentConfig['niche'];
          }
          self.iatRecorder.setLanguage(language, accent, isNiche);
        });
      }
    }, {
      key: 'initGeetest',
      value: function (_initGeetest) {
        function initGeetest() {
          return _initGeetest.apply(this, arguments);
        }
  
        initGeetest.toString = function () {
          return _initGeetest.toString();
        };
  
        return initGeetest;
      }(function () {
        var _this5 = this;
  
        Object(services["h" /* getValidate */])().then(function (data) {
          // 调用 initGeetest 进行初始化
          if (data.flag === true) {
            initGeetest({
              gt: data.data.gt,
              challenge: data.data.challenge,
              offline: !data.data.success, // 表示用户后台检测极验服务器是否宕机
              new_captcha: data.data.new_captcha, // 用于宕机时表示是新验证码的宕机
              product: 'bind', // 产品形式，包括：float，popup
              width: '300px'
            }, function (captchaObj) {
              _this5.captchaObj = captchaObj;
              captchaObj.onReady(function () {}).onSuccess(function () {
                geettestResult = captchaObj.getValidate();
                if (!geettestResult) {
                  return $.alerts.alert('请完成验证');
                }
                _this5.start();
              }).onError(function () {
                $.alerts.alert('验证码校验失败，请重试');
              });
            });
          } else {
            $.alerts.alert('系统异常，请稍后重试');
          }
        });
      })
    }, {
      key: 'setResult',
      value: function setResult(data) {
        var str = '';
        var resultStr = '';
        var ws = data.ws || [];
        for (var i = 0; i < ws.length; i++) {
          str = str + ws[i].cw[0].w;
        }
        // 开启wpgs会有此字段
        // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
        if (!data.pgs || data.pgs === 'apd') {
          this.resultText = $('#result_output').text();
        }
        resultStr = this.resultText + str;
        $('#result_output').text(resultStr);
      }
    }, {
      key: 'counterDown',
      value: function counterDown() {
        var _this6 = this;
  
        if (this.counterDownTime === 60) {
          this.counterDownDOM.text('01: 00');
          this.stop();
        } else if (this.counterDownTime > 60) {
          this.reset();
          return false;
        } else if (this.counterDownTime >= 0 && this.counterDownTime < 10) {
          this.counterDownDOM.text('00: 0' + this.counterDownTime);
        } else {
          this.counterDownDOM.text('00: ' + this.counterDownTime);
        }
        this.counterDownTime++;
        this.counterDownTimeout = setTimeout(function () {
          _this6.counterDown();
        }, 1000);
      }
    }, {
      key: 'renderSelect',
      value: function renderSelect() {
        Object(services["b" /* getIatLanguage */])().then(function (result) {
          if (result.flag) {
            var data = result.data;
            var optionStr = '<option value="zh_cn">\u4E2D\u6587\u666E\u901A\u8BDD</option><option value="en_us">\u82F1\u6587</option>';
            for (var i = 0; i < data.length; i++) {
              optionStr += '<option value="' + data[i].id.code + '" data-niche="' + data[i].extension + '">' + data[i].desc + '</option>';
            }
            $('#dialect_select').html(optionStr);
          } else {
            $.alerts.alert(result.desc || result.msg || '获取语种/方言列表失败');
          }
        });
      }
    }]);
  
    return IatTaste;
  }();
  
  var iatTaste = new utils_iat_recorder_IatTaste();
  
  /* harmony default export */ var utils_iat_recorder = (iatTaste);
  // CONCATENATED MODULE: ./src/js/entry/services/voicedictation.js
  
  
  
  
  
  
  
  $(function () {
    Object(utils_services["a" /* serviceQA */])();
    Object(utils_services["b" /* serviceTopbar */])();
    utils_iat_recorder.init();
    $('.answer-table .buy-btn').click(function () {
      var packageId = $(this).attr('package-id');
      var params = {
        wareId: '1003',
        packageId: packageId,
        serviceName: '语音听写',
        businessId: 'iat'
      };
      Object(utils_services_buy["a" /* goServiceBuy */])(params, {
        btnStr: ['1003006', '1003007'].indexOf(packageId) > -1 ? '领取' : '购买'
      });
    });
  });
  
  /***/ }),
  
  /***/ 530:
  /***/ (function(module, exports) {
  
  // removed by extract-text-webpack-plugin
  
  /***/ }),
  
  /***/ 531:
  /***/ (function(module, exports, __webpack_require__) {
  
  module.exports = function() {
    return new Worker(__webpack_require__.p + "4cb59091912e9ef31ced.worker.js");
  };
  
  /***/ })
  
  },[529]);
  
  
  // WEBPACK FOOTER //
  // js/services/voicedictation.96c2de628f13d172e16a.bundle.js