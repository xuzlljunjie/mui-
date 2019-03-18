var count = 0;
var imStatus=null;
function initIM() {
	// 初始化。
	RongIMClient.init(imKey);
	//a使用
//	getConnect('pqJsJT61ZOWri5VIdyMKQhDzVNKXfM4761XZAO2SloAfCAlNJpObzkxlmIfac+uu4l5phb/hoiYWeoUts2MYOA==');
	//b使用
//	getConnect('+wOtU9UKNp5rrzA0QsNNf1RWYDwVSe/Hp78DLrTPkFpefVm0zO6a71qn9yYv4xySgjAksmkPDnpRe8gAvZY4+w==');
	//c使用
//	getConnect('Ddta4QE0Njd9KL/bNjmDc7AphvkYqf6VK6A9/iH+0HTqsdy6Q609XdBhR49ArVn7obearrUrs5oF+8EKsMSMHA==');
//	if (new UserInfo().imToken()) {
	getConnect(new UserInfo().imToken());
//		return;
//	}
//	var params = {
//		appKey: imKey,
//		studentCode: userid,
//		userName: new UserInfo().userName(),
//		selfImg: "http://aa.com/a.png"
//	};
	/**
	 * 从自己的后台获取token链接融云服务器:
	 * 全路径为：http://192.168.1.1:8080/test/get_rong_token.do
	 * 但是除了：get_rong_token之外其余都是一样的，所以在do.js中拼补
	 */
	
//	visitServer('get_rong_token', params, getImToken, errorCall, false);
}

function getImToken(data) {
	var token = data.result.token;
	new UserInfo().imToken(token);
	getConnect(token);
}


function getConnect(token) {
	// 从您的应用服务器请求，以获取 Token。在本示例中我们直接在下面 hardcode 给 token 赋值。
	// var token = getTokenFromAppServer();
	// 此处直接 hardcode 给 token 赋值，请替换为您自己的 Token。
	//	var token = "UsxEm+sIX4trn2c8xY4yugrgg0JH/tZ/TS9HISFqaCRZ9VEkkm1kulgmPTzZkOZNPIfzOyJkXYSmv60c4xJk+4812skbzSIbxv5dKXFBCcE=";
	// 连接融云服务器。
	RongIMClient.connect(token, {
        onSuccess: function(userId) {
          console.log("Login successfully." + userId);
        },
        onTokenIncorrect: function() {
          console.log('token无效');
        },
        onError:function(errorCode){
              var info = '';
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = '超时';
                  break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = '未知错误';
                  break;
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                  info = '不可接受的协议版本';
                  break;
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                  info = 'appkey不正确';
                  break;
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                  info = '服务器不可用';
                  break;
              }
              console.log(info+':'+errorCode);
            }
      });

	// 设置连接监听状态 （ status 标识当前连接状态）
	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
    		imStatus = status;
        switch (status) {
            //链接成功
            case RongIMLib.ConnectionStatus.CONNECTED:
                console.log('链接成功');
                break;
            //正在链接
            case RongIMLib.ConnectionStatus.CONNECTING:
                console.log('正在链接');
                break;
            //重新链接
            case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log('断开连接');
                break;
            //其他设备登陆
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                console.log('其他设备登陆');
                break;
              //网络不可用
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
              console.log('网络不可用');
              break;
            }
    }});

	// 消息监听器
	 RongIMClient.setOnReceiveMessageListener({
	    // 接收到的消息
	    onReceived: function (message) {
	        // 判断消息类型
	        switch(message.messageType){
	            case RongIMClient.MessageType.TextMessage:
	            		// 收到的为文字消息
					var senderId = message.senderUserId;
					var data = {
						sender: senderId,
						time: getTime(message.receivedTime),
						type: "text",
						content: message.content.content,
						img:localStorage.getItem('rightimg')
					};
					//					message.getReceivedStatus().setRead();
					save(senderId, data);
	                   // 发送的消息内容将会被打印
	                console.log(message.content.content);
	                break;
	            case RongIMClient.MessageType.VoiceMessage:
	            		downLoad("sound", message);
	                // 对声音进行预加载                
	                // message.content.content 格式为 AMR 格式的 base64 码
//	                RongIMLib.RongIMVoice.preLoaded(message.content.content);
	                break;
	            case RongIMClient.MessageType.ImageMessage:
	                // do something...
	                downLoad("image", message);
	                break;
	            case RongIMClient.MessageType.DiscussionNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.LocationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.RichContentMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.DiscussionNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.InformationNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.ContactNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.ProfileNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.CommandNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.CommandMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.UnknownMessage:
	                // do something...
	                break;
	            default:
	                // 自定义消息
	                // do something...
	        }
	    }
	});
}

/**
 * 发送消息
 * @param {Object} targetId 目标id
 * @param {Object} contents 发送消息内容
 * @param {Object} sFlag 是否系统发送
 */
function sendMsg(targetId, contents,sFlag) {
	var net = plus.networkinfo.getCurrentType();
	if (net == plus.networkinfo.CONNECTION_NONE) {
		mui.toast('无网络链接，请检查网络!');
		return;
	} else {
		if (imStatus != '0') {
			//断网重连
			getConnect(new UserInfo().imToken());
			var alertInfo = '消息 '+contents.content+' 发送失败!';
			if(contents.type=='image'){
				alertInfo = '[图片] 发送失败!';
			}else if(contents.type=='sound'){
				alertInfo = '[语音] 发送失败';
			}
			plus.nativeUI.alert(alertInfo,function(){},'im_demo');
		}
	}
	if (contents.type == "text") {
		sendContent(targetId, contents,sFlag);
	} else {
		var file = {
			path: contents.content,
			name: contents.content
		};
		sendOther(targetId, contents, file);
	}
}

/**
 * 将聊天文件保存到本地(因为融云提供的聊天纪录需要付费并有时间限制)
 */
function save(targetId, data,sFlag) {
	//alert('聊天文件保存到本地'+JSON.stringify(data))
	var talkInfo = plus.webview.getWebviewById("message_talk_info");
	var flag = true;
	var info = "";
	if (data.type == 'text') {
		info = data.content;
		//将换行转换成h5的换行
		if(info.indexOf('\n')>=0){
			var tempList = info.split('\n');
			var tempInfo = '';
			for(var i=0;i<tempList.length;i++){
				tempInfo += tempList[i]+'<br/>';
			}
			info = tempInfo.substr(0,tempInfo.lastIndexOf('<br/>'));
		}
	} else if (data.type == "image") {
		info = "[图片]";
	} else if (data.type == "sound") {
		info = "[语音]";
	}
	plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
		fs.root.getFile("msg/" + targetId + "/" + userid + targetId + ".txt", {
				create: true,
				exclusive: false
			},
			function(fileEntry) {
				fileEntry.createWriter(function(write) {
					write.onwrite = function() {
						if(info.indexOf('<br/>')>=0){
							info = info.substr(0,info.indexOf('<br/>'));
						}
						if (talkInfo && talkInfo.targetId == targetId) {
							flag = false;
							if (data.sender != "self") {
								talkInfo.evalJS("bindMsgList(" + JSON.stringify(data) + ")");
							}
							//alert('updateList'+info)
							updateList(targetId, info,'0','0');
						}
						if(sFlag=='0'){
							//从非talkInfo的页面直接发送消息给某人
							flag = false;
							//alert('updateList1'+info)
							updateList(targetId, info,'0','0');
						}
						if (flag) {
							//alert('updateList2'+info)
							updateList(targetId, info,'0');
						}
					};
					write.seek(write.length);
					write.write(JSON.stringify(data) + ",");
				}, function(e) {
					alert(e.message);
				});
			},
			function(e) {
				alert(e.message);
			});
	}, function(e) {
		alert(e.message);
	});
}

//图片和音频文件下载到本地
function downLoad(type, message) {
	var senderId = message.senderUserId;
	//此url需根据自己需求写
	var url = new UserInfo().urlbase() + 's_file_download.do?downLoadPath=' + message.content.content + '&sCode=' + userid + '&tokenId=' + new UserInfo().token() + '&userCode=' + senderId;
	var temp1 = url.split("/");
	var temp2 = temp1[temp1.length - 1].split('&');
	var fileName = temp2[0];
	var dtask = plus.downloader.createDownload(url, {
		filename: "_doc/msg/" + senderId + "/" + fileName
	}, function(data, status) {
		if (status == "200") {
			var msg = {
				sender: senderId,
				time: getTime(message.receivedTime),
				type: type,
				content: "file://" + plus.io.convertLocalFileSystemURL(data.filename),
				img:localStorage.getItem('rightimg')
			};
			//确保文件下载完成再保存到聊天记录中
			save(senderId, msg);
		}
	});
	dtask.start();
}

//发送图片或者语音等文件型聊天内容n123
function sendOther(targetId, content, file) {
//	alert(targetId)
//	alert(JSON.stringify(content))
//	alert(file.name)
//	alert(file.path)
	var url = "https://xxyweeds.top/api/pand_image_upload/image_upload";
	var upload = plus.uploader.createUpload(url, {
			method: 'post'
		},
		function(t, status) {
			if (status == 200) {
				var oldContent = content.content;
				var response = JSON.parse(t.responseText);
				content.content = getDownUrl(response.fileName, response.chatCode);
				sendContent(targetId, content, oldContent);
			} else {
				mui.toast("发送失败：" + status);
			}
		});
	upload.addData("client", "machineMastor_owner");
	upload.addData("uid", Math.floor(Math.random() * 100000000 + 10000000).toString());
	upload.setRequestHeader("tokenId", new UserInfo().token());
	upload.setRequestHeader("code", userid);
	upload.setRequestHeader('targetId', targetId);
	upload.addFile(file.path, {
		key: file.name
	});
	upload.start();
}

//发送具体的消息
function sendContent(targetId, content, oldContent) {
	var msg = null;
	var par = {
		content:content.content
	}
	if (content.type == "text") {
		msg = new RongIMLib.TextMessage({content:content.content});
	} else if (content.type == "image") {
		msg = new RongIMLib.ImageMessage({content:content.content});
	} else if (content.type == "sound") {
		msg = new RongIMLib.VoiceMessage({content:content.content});
	}
	var conversationtype = RongIMLib.ConversationType.PRIVATE; // 私聊
	RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
		// 发送消息成功
		onSuccess: function(message) {
			//message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
			console.log("Send successfully");
			if (content.type != 'text') {
				content.content = oldContent;
			}
			 var param = {
            		studentCode: userid,
            		targetId:targetId
            }
			//通知后台进行推送此消息
//      		visitServer('s_gexin_notify',param,gexinSuc,errorCall,false);
			save(targetId,content,oldContent);
		},
		onError: function(errorCode, message) {
			var info = '';
			switch (errorCode) {
				case RongIMLib.ErrorCode.TIMEOUT:
					info = '超时';
					break;
				case RongIMLib.ErrorCode.UNKNOWN_ERROR:
					info = '未知错误';
					break;
				case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
					info = '在黑名单中，无法向对方发送消息';
					break;
				case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
					info = '不在讨论组中';
					break;
				case RongIMLib.ErrorCode.NOT_IN_GROUP:
					info = '不在群组中';
					break;
				case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
					info = '不在聊天室中';
					break;
				default:
					info = 'x';
					break;
			}
			console.log('发送失败:' + info);
		}
	});
}
//通过推送发送成功
function sendSuc(data) {
	if (data.ec != sucCode) {
		mui.toast('发送失败!');
		return;
	}
}

function gexinSuc(data){
	
}

//每次启动app更新聊天列表头像和名称等信息
function updateUserInfo() {
	count = 0;
	updataExcute();
}

function updataExcute() {
	if (count < signleList.length) {
		console.log(JSON.stringify(signleList));
		visitServer('s_gexin_user_info', {
			targetId: signleList[count].userid,
			studentCode: userid
		}, querySuccess, queryError, false);
	}
}

function querySuccess(data) {
	if (signleList[count].oldImg != data.imageUrl) {
		downUserImg(data.imageUrl, data.targetId, true);
	} else {
		count++;
	}
}

function queryError(data) {
	count++;
	updataExcute();
}

//聊天列表中有人更换头像时候，重新下载头像或者新增聊天对象时下载头像
function downUserImg(imgUrl, targetId, isFlag) {
	var url = 'https://xxyweeds.top/api/pand_image_upload/image_upload?downLoadPath=' + imgUrl + '&tokenId=' + new UserInfo().token() + '&studentCode=' + userid;
	var temp = imgUrl.split("/");
	var fileName = temp[temp.length - 1];
	var dtask = plus.downloader.createDownload(url, {
		filename: "_doc/msg/" + fileName
	}, function(data, status) {
		if (status == "200") {
			if (isFlag) {
				signleList[count].userimage = plus.io.convertLocalFileSystemURL(data.filename);
				count++;
				updataExcute();
			}else{
				//新增聊天对象时，添加头像(基于文字快，图像慢：这种方式保证每次都能加载到头像)
				document.getElementById("img"+targetId).src = 'file://'+plus.io.convertLocalFileSystemURL(data.filename);
			}
		}
	});

	dtask.start();
}
/**
 * 更新聊天列表的消息
 * @param {Object} targetId 目标id
 * @param {Object} info 聊天的内容
 * @param {Object} tFlag 是否修改聊天列表的时间
 * @param {Object} num 未读消息数量
 */
function updateList(targetId, info, tFlag, num) {
	//alert('更新聊天列表的消息')
	var flag = true,
		changeNum = 0;
	for (var i = 0; i < signleList.length; i++) {
		if (signleList[i].userid == targetId) {
			//在聊天列表中
			flag = false;
			signleList[i].info = info;
			if (num != null) {
				signleList[i].num = num;
				setInfo(targetId, info,'0');
			} else {
				signleList[i].num = parseInt(signleList[i].num) + 1;
				setInfo(targetId, info,'1');
			}
			if(tFlag=='0'){
				signleList[i].time = getTime();
				setTime(targetId);
			}
			if(i>0){
				var fEl = signleList[i];
				signleList.splice(i,1);
				signleList.splice(0,0,fEl);
			}
			break;
		}
	}
	if (flag) {
		//不在聊天列表中
		var newMessage = {
			userid: targetId,
			info: info
		}
		if (num != null) {
			//正在聊天(此种情况为单聊等非聊天列表入口进入，并首次发消息)
			newMessage.num = '0';
		} else {
			newMessage.num = '1';
		}
		signleList.push(newMessage);
		queryUserInfo(targetId);
	} else {
		updateInitList();
	}
}

//新增聊天对象情况下加载聊天对象的信息
function queryUserInfo(targetId) {
	//alert('新增聊天对象'+targetId)
	visitServer('s_gexin_user_info', {
		targetId: targetId,
		studentCode: userid
	}, oneUserInfoSuc, errorCall, false);
}

function oneUserInfoSuc(data) {
	//alert(JSON.stringify(data))
	if (data.ec != sucCode) {
		mui.toast(data.em);
		return;
	}
	var level = "";
	var imgName = '';
//	if (data.imageUrl != null) {
//		var temp = data.imageUrl.split("/");
//		var imgName = 'file://' + plus.io.convertLocalFileSystemURL("_doc/msg/" + temp[temp.length - 1]);
//	}
	for (var i = signleList.length - 1; i >= 0; i--) {
		if (signleList[i].userid == data.targetId) {
			//找到之前不全的信息并补充完整
			signleList[i].time = getTime();
			signleList[i].username = data.userName;
			signleList[i].userlevel = data.userLevel;
			signleList[i].oldImg = data.imageUrl;
			signleList[i].userimage = data.imageUrl;
			newItem(signleList[i],true);
			//同样是因为不需要下载头像，所以注释，如果有后台的话，要使用另一种方式去获取头像
//			signleList[i].userimage = imgName;
//			newItem(signleList[i],false);
			if(i>0){
				//将最新的聊天对象放到第一条
				var fEl = signleList[i];
				signleList.splice(i,1);
				signleList.splice(0,0,fEl);
			}
			updateInitList();
			//未读消息提示数量更新
			if (signleList[i].num != '0') {
				totalNum+=parseInt(signleList[i].num);
				resetNo();
			}
			break;
		}
	}
	//加载头像：demo无后台（挡板），所以注释
//	if (data.imageUrl != null) {
//		downUserImg(data.imageUrl, data.targetId, false);
//	}

}

function errorCall(e) {

}
