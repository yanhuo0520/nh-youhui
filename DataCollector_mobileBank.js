// 客户端数据交互Js
window.isWebviewFlag = true



window.setWebViewFlag = function() {
  window.isWebviewFlag = true
}

 function abcSetAnchor(key, value){
  console.log("Starts APM custom collection")
  if(window.AlipayJSBridge){
      console.log("Starts APM custom collection with key: ", key, "and value: ", value),
      window.AlipayJSBridge.call("abcSetAnchor",{
          key, value
      },
      function(result){
          alert(JSON.stringify(result))
          console.log("Returned: ", result)
      })
  }

} 

 function onEventWithCustom_HTML(eventId, eventLabel) {
  //alert(1)
  console.log(
    'onEventWithCustom_HTML,eventId:' + eventId + ' ,eventLabel:' + eventLabel
  )
  window.DataCollector.onEventWithCustom(eventId, eventLabel)
}

//监听触发操作
function hashChangeFire() {
  //alert('执行到hashChangeFire')
  // console.log("hash changed")

  // 如果用Vue请把下一行代码注释掉，由于在Vue中onhashchange无法在正向网页切换采集时触发，因此需要使用Vue router方法手动触发
  // 但是Vue中onhashchange可以在页面返回时触发，因此需要注释掉这行以免重复发数据
  // dataCollection_HTML()
}

//url变化监听器
if (
  'onhashchange' in window &&
  (typeof document.documentMode === 'undefined' || document.documentMode == 8)
) {
  // 浏览器支持onhashchange事件
  window.onhashchange = hashChangeFire
} else {
  // 不支持则用定时器检测的办法
  setInterval(function() {
    // 检测hash值或其中某一段是否更改的函数，
    // 在低版本的iE浏览器中通过window.location.hash取出的指和其它的浏览器不同，要注意
    // var ischanged = isHashChanged()
    // if (ischanged) {
    //   hashChangeFire()
    // }
  }, 150)
}

/**
 * 页面加载完毕 触发页面数据采集
 */
window.addEventListener('load', hashChangeFire())

 function dataCollection_HTML(title, nowurl, fromurl) {
  // alert(2)
  var nowurl = nowurl || document.URL
  var fromurl = fromurl || document.referrer
  
  var ST = setInterval(function() {
    var jsonData = {
      jsPageTitle: title || document.title,
      jsNowPageUrl: nowurl,
      jsFromUrl: fromurl
    }
    window.DataCollector.jsData(jsonData)
    clearInterval(ST)
  }, 50)
}

// 全局异常采集
window.addEventListener('error', function(evt) {
  var cTime = new Date().getTime()
  var error = evt.error || {}
  var eStack
  if (evt.error) {
    eStack = error.stack
  } else {
    // 兼容 ios9
    eStack = evt.filename + ':' + evt.lineno + ':' + evt.colno
    // eStack =  evt.deepPath; // ios 9 未实现
  }
  var SI = setInterval(function() {

    var value = {
      message: evt.message,
      stack: eStack,
      reportTime: cTime,
      pageTitle: document.title
    }
    window.DataCollector.jsError(value)
    clearInterval(SI)
    
  }, 300)
})

// js 2 native data  数据封装到url中
function js2NativeData(url) {
  console.log(url)
  var iFrame
  iFrame = document.createElement('iframe')
  iFrame.setAttribute('src', url)
  iFrame.setAttribute('style', 'display:none;')
  iFrame.setAttribute('height', '0px')
  iFrame.setAttribute('width', '0px')
  iFrame.setAttribute('frameborder', '0')
  document.body.appendChild(iFrame)
  iFrame.parentNode.removeChild(iFrame)
  iFrame = null
}

// html 数据封装成Json
function data2Json(funName, args) {
  var commend = {
    functionName: funName,
    arguments: args
  }
  var jsonStr = JSON.stringify(commend)
  var url = 'people:' + jsonStr

  js2NativeData(url)
}

// 客户端交互
window.DataCollector = {
  /**
   * 自定义事件数量统计
   *
   * @param eventId
   *            String类型.事件ID，
   * @param eventLabel
   *            String类型.事件标签，事件的一个属性说明
   */
  onEventWithCustom: function(eventId, eventLabel) {
    // console.log('----------onEventWithCustom------------')
    // var evJson = {}
    // evJson[eventId] = eventLabel
    // data2Json('onEventWithCustom', [evJson])

    var evJson = {
      key: eventId,
      value: eventLabel
    };
    data2Json("onEventWithCustom", [evJson]);
  },
  /**
   * Js 错误日志
   * @param obj 异常信息
   */
  jsError: function(obj) {
    data2Json('jsError', [obj])
  },

  /**
   * 页面数据
   * @param obj 正常数据
   */
  jsData: function(obj) {
    data2Json('jsData', [obj])
  }
}
