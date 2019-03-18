mui.init();

var thisview = null;
var msgList = [];
mui.plusReady(function(){
	thisview = plus.webview.currentWebview();
	msgList = thisview.msgList;
	mainInit();
});


function mainInit(){
	var msg = '';
	for(var i=0;i<msgList.length;i++){
		msg += '<li>'+
					'<h2 class="time"><span >'+showTime(msgList[i].messageSendTime)+'</span></h2>'+
					'<p class="msg_con">'+msgList[i].messageContent+'</p>'+
				'</li>';
	}
	document.getElementById("sysmsgList").innerHTML = msg;
}


document.getElementById("headerBack").addEventListener('tap',function(){
	back();
});

function addBefore(content){
	var el = document.createElement('li');
	el.innerHTML = '<h2 class="time"><span >'+showTime(content.messageSendTime)+'</span></h2>'+
				   '<p class="msg_con">'+content.messageContent+'</p>';
	var firEl = document.getElementById("sysmsgList").childNodes[0];
	document.getElementById("sysmsgList").insertBefore(el,firEl);
}

mui.back = function(){
	back();
}

function back(){
	thisview.close();
}
