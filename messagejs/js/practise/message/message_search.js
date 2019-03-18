var thisview = null;
var openId = null;
var list = [];
var userid = null;
mui.init();
var nativeWebview, imm, InputMethodManager;
var initNativeObjects = function() {
    if (mui.os.android) {
        var main = plus.android.runtimeMainActivity();
        var Context = plus.android.importClass("android.content.Context");
        InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
        imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
    } else {
        nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
    }
};
var showSoftInput = function() {
    if (mui.os.android) {
        imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
    } else {
        nativeWebview.plusCallMethod({
            "setKeyboardDisplayRequiresUserAction": false
        });
    }
    setTimeout(function() {
       //此处可写具体逻辑设置获取焦点的input
       var inputElem = document.getElementById("messageSearch");
              inputElem.focus(); 
    }, 200);
};
mui.plusReady(function() {
	thisview = plus.webview.currentWebview();
	userid = new UserInfo().userId();
	list = thisview.list;
	//打开键盘
	initNativeObjects();
    showSoftInput();
});

//搜索
document.getElementById("messageSearch").addEventListener('input',function(){
	var value = this.value.trim();
	document.getElementById("messageList").innerHTML = '';
	if(value.length>0){
		for(var i=0;i<list.length;i++){
			if(list[i].userlevel.indexOf(value)>=0){
				newItem(list[i]);
			}
		}
	}
});

//取消
document.getElementById("cancleBtn").addEventListener('tap',function(){
	document.getElementById("messageSearch").value = '';
	thisview.close();
});


function toInfo(tid) {
	mui.openWindow({
		id: 'message_talk_info',
		url: 'message_talk_info.html',
		extras: {
			targetId: tid,
			targetName:document.getElementById(tid).getAttribute('data-name')
		},
		waiting:{
			autoShow:false
		}
	});
}

/**
 * 新增一条记录
 * @param {Object} userData 记录的json数据
 * @param {Object} imgFlag 是否是初始化的聊天数据
 */
function newItem(userData,initFlag) {
	var newInfo = '<div class="result_img_box">'+
					'<span id="num'+ userData.userid +'" class="mui-badge2"';
	newInfo += ' style="display:none;">0</span>';
	var imgSrc = userData.userimage;
	newInfo += '<img id="img'+ userData.userid +'" class="result_img" data-id="'+userData.userid+'" src="' + imgSrc + '" /></div>'+
		'<div class="item_right">'+
			'<p id class="font_16 color_black">'+userData.userlevel+'</p>'+
			'<p class="font_13 color_75">'+userData.username+'</p>'+
			'<p id="info'+userData.userid+'" class="font_12 color_bd text_overflow_ellipsis">'+userData.info+'</p>'+
		'</div>'+
		'<hr color="#e5e5e5" size="1" />';
	var el = document.createElement("div");
	el.setAttribute('id',userData.userid);
	el.setAttribute("class", "result_item");
	el.setAttribute('data-name',userData.userlevel);
	el.innerHTML = newInfo;
	document.getElementById("messageList").appendChild(el);
}

//搜索页面直接进入聊天页面
mui('#messageList').on('tap','.result_item',function(){
	toInfo(this.getAttribute('id'));
});