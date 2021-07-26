function getQueryString(name) {
    var href = window.location.href
    if (href.indexOf('?') == -1 || href.indexOf(name) == -1 || href.indexOf('=') == -1) {
        return '';
    }
    let val = ''
    let param_str = href.substr(href.indexOf('?') + 1);
    let param_arr = [];
    if (param_str.indexOf('&') != -1) {
        param_arr = param_str.split('&');
    } else {
        param_arr[0] = param_str
    }


    for (let p of param_arr) {
        let p_arr = p.split('=');
        if (p_arr[0] == name) {
            val = p_arr[1]
        }
    }

    return val;
}

function baseUrl(param) {
    // return 'https://coopera.xfd365.com' + param;
	return 'http://172.168.0.50' + param;
    // return 'https://szxc.ha.abchina.com/yxhl-b' + param;
}

// 获取步骤条
function getActive(score){
    let val = ''
    if(score == 0){
        val = 0
    }else if(score >= 1 && score < 5){
        val = 1
    }else if(score >= 5 && score < 9){
        val = 2
    }else if(score >=9 && score < 15){
        val =3
    }else if(score == 15){
        val = 4
    }
    return val;
}

// 获取当前季度
function getQuarter(){
    let quarter = ''
    let month = new Date().getMonth() + 1;
    if(month < 4){
        quarter = 1
    }else if(month < 7){
        quarter = 2
    }else if(month < 10){
        quarter = 3
    }else{
        quarter = 4
    }
    return quarter;
}

// 获取对应具体刻度
function getChangeAr(arr){
    let quarterNow = getQuarter() // 当前是第几季度
	// let quarterNow = 3
    // quarter   0--当前季度未缴费  1--当前季度已缴费切不是第四季度   2--当前季度已缴费切是第四季度
    // num: 总缴费的季度数  nowSeason 当前季度获取多少   nextSeason 下个季度即将获取多少
    let valAsaa = {"active1": false, "active2": false, "active3": false, "active4": false, 
                    "activeBefore2": false, "activeBefore3": false, "activeBefore4": false, 
                    "activeRight1": false, "activeRight2": false, "activeRight3": false,
                    "quarter": 0, "num": 0, "nowSeason": 0, "nextSeason": 0}

    if(arr[0] == 1){
        valAsaa.active1 = true
        valAsaa.num++
        if(quarterNow == 1){ // 当前为第一季度
            valAsaa.activeRight1 = true
            valAsaa.quarter = 1
        }
    }
    if(arr[1] == 1){
        valAsaa.active2 = true
        valAsaa.num++
        if(quarterNow == 2){
            valAsaa.activeRight2 = true
            valAsaa.quarter = 1
        }
        if(arr[0] == 1){
            valAsaa.activeRight1 = true
            valAsaa.activeBefore2 = true
        }
    }
    if(arr[2] == 1){
        valAsaa.active3 = true
        valAsaa.num++
        if(quarterNow == 3){
            valAsaa.activeRight3 = true
            valAsaa.quarter = 1
        }
        if(arr[1] == 1){
            valAsaa.activeBefore3 = true
            valAsaa.activeRight2 = true
        }
    }
    if(arr[3] == 1){
        valAsaa.active4 = true
        valAsaa.num++
		if(quarterNow == 4){
			valAsaa.quarter = 2
		}
        if(arr[2] == 1){
            valAsaa.activeBefore4 = true
            valAsaa.activeRight3 = true
        }
    }

    return valAsaa;
}


function ready(callback){
    if(window.AlipayJSBridge){
        callback && callback();
    }else{
        document.addEventListener('AlipayJSBridgeReady', callback, false);
    }
}

//将字符串转化为二进制的数据
function strToBinary(str){
  var result = [];
  var list = str.split("");
  for(var i=0;i<list.length;i++){
    if(i != 0){
      //加空格，分割二进制
      result.push(" ");
    }
    var item = list[i];
    //将字符串转化为二进制数据
    var binaryStr = item.charCodeAt().toString(2);
    result.push(binaryStr);
  }  
  return result.join("");
}