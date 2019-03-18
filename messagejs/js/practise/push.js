//click事件处理
function clickMsg(msg) {
	if (msg.aps) { // Apple APNS message
		return;
	}
	// 处理推送数据
	logoutPushMsg(msg);
}
//receive事件处理
function receiveMsg(msg) {
	if (msg.aps) { // Apple APNS message
		//在线aps，直接退出
		return;
	}
	if(typeof msg=='string'){
		//不符合格式的安卓推送进入receive事件中
		logoutPushMsg(JSON.parse(msg));
		return;
	}
	logoutPushMsg(msg);
}

//清空所有消息
function clearAllPush(){
    plus.push.clear();
}

//创建本地消息
function createLocalPushMsg(msg){
	if(pushFlag){
        	var options = {cover:false};
		plus.push.createMessage( msg, "", options );
	}
}


//处理推送消息内容
function logoutPushMsg( msg ) {
	var infoJson	 = null;
	if ( msg.payload ) {
		if ( typeof msg.payload =="string" ) {
			//不符合格式的透传消息，进入消息中心,不再创建本地消息
			infoJson = JSON.parse(msg.payload);
		}else{
			//透传消息，创建本地通知消息
			infoJson = msg.payload;
		}
		switch(infoJson.type){
			case "im":
//				imMessage(infoJson);
				break;
		}
		createLocalPushMsg(infoJson.content);
	}
}
/*处理聊天内容(此处暂时没有用到)
 * 因为在用户不在线的时候只是在通知栏提示用户有一小消息，当用户点击打开app的时候会自动接收消息
 */
function imMessage(message){
	var senderId = message.sender;
	var data = {
		sender: senderId,
		time: message.time,
		content: message.info
	};
	var selfView = plus.webview.getWebviewById('pages/self.html');
	// 判断消息类型
	switch (message.contentType) {
		case 'text':
			data.type="text";
			info = message.info;
			selfView.evalJS('save("'+senderId+'",'+JSON.stringify(data)+')');
			break;
		case 'image':
			data.type = "image";
			info = "[图片]";
			selfView.evalJS('downLoad("image", '+JSON.stringify(data)+')');
			break;
		case 'sound':
			data.type = "sound";
			info = "[语音]";
			selfView.evalJS('downLoad("sound", '+JSON.stringify(data)+')');
			break;
	}
	
}
