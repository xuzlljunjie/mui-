var thisview = null;
var indexview = null;
mui.init();
mui.plusReady(function() {
	thisview = plus.webview.currentWebview();
	indexview = plus.webview.getLaunchWebview();
	if(new UserInfo().userId()){
		document.getElementById(new UserInfo().userId()).style.display = 'none';
		document.getElementById("messageList1").style.display = '';
	}
	if(plus.webview.getWebviewById('select')){
		plus.nativeUI.closeWaiting();
		plus.webview.getWebviewById('select').hide();
	}
});

mui('#messageList1').on('tap','.result_item',function(){
	var tid = this.getAttribute('id');
	var fname = this.getAttribute('data-name');
	mui.openWindow({
		id: 'message_talk_info',
		url: 'message/message_talk_info.html',
		extras: {
			targetId: tid,
			targetName:fname
		},
		waiting:{
			autoShow:false
		}
	});
});

document.getElementById("changeUser").addEventListener('tap',function(){
	indexview.evalJS("logout()");
});
