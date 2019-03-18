var record = [];
var MIN_SOUND_TIME = 800;
var targetId = null;
var thisview = null;
var ui = null;
var tImg = null;
var talkListView = null;
var positionCode = null;
var imageViewer = new mui.ImageViewer('.msg-content-image', {
	dbl: false
});
mui.init({
	gestureConfig: {
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: true, //默认为false，不监听
		release: true //默认为false，不监听
	}
});
template.config('escape', false);
mui.plusReady(function() {
	thisview = plus.webview.currentWebview();
	targetId = thisview.targetId;
	document.getElementById("messageName").innerHTML = thisview.targetName;
	talkListView = plus.webview.getWebviewById('model/order/chatmain.html');
	talkListView.evalJS('changeOpenId("' + targetId + '")');
	thisview.setStyle({
		softinputMode: "adjustResize"
	});
	initMsg();
});

ui = {
	body: document.querySelector('body'),
	footer: document.querySelector('footer'),
	footerRight: document.querySelector('.footer-right'),
	footerLeft: document.querySelector('.footer-left'),
	btnMsgType: document.querySelector('#msg-type'),
	boxMsgText: document.querySelector('#msg-text'),
	boxMsgSound: document.querySelector('#msg-sound'),
	btnMsgImage: document.querySelector('#msg-image'),
	areaMsgList: document.querySelector('#msg-list'),
	boxSoundAlert: document.querySelector('#sound-alert'),
	h: document.querySelector('#h'),
	content: document.querySelector('.mui-content')
};
ui.h.style.width = ui.boxMsgText.offsetWidth + 'px';
var footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;
window.addEventListener('resize', function() {
	ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
}, false);


function msgTextFocus() {
	ui.boxMsgText.focus();
	setTimeout(function() {
		ui.boxMsgText.focus();
	}, 150);
}
//解决长按“发送”按钮，导致键盘关闭的问题；
ui.footerRight.addEventListener('touchstart', function(event) {
	if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
		msgTextFocus();
		event.preventDefault();
	}
});
//解决长按“发送”按钮，导致键盘关闭的问题；
ui.footerRight.addEventListener('touchmove', function(event) {
	if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
		msgTextFocus();
		event.preventDefault();
	}
});
ui.footerRight.addEventListener('release', function(event) {
	if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
		//showKeyboard();
		ui.boxMsgText.focus();
		setTimeout(function() {
			ui.boxMsgText.focus();
		}, 150);
		send({
			sender: 'self',
			time: getTime(),
			type: 'text',
			content: ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '<br/>'),
			img:localStorage.getItem('rightimg')
		});
		ui.boxMsgText.value = '';
		mui.trigger(ui.boxMsgText, 'input', null);
	} else if (ui.btnMsgType.classList.contains('mui-icon-mic')) {
		ui.btnMsgType.classList.add('mui-icon-compose');
		ui.btnMsgType.classList.remove('mui-icon-mic');
		ui.boxMsgText.style.display = 'none';
		ui.boxMsgSound.style.display = 'block';
		ui.boxMsgText.blur();
		document.body.focus();
	} else if (ui.btnMsgType.classList.contains('mui-icon-compose')) {
		ui.btnMsgType.classList.add('mui-icon-mic');
		ui.btnMsgType.classList.remove('mui-icon-compose');
		ui.boxMsgSound.style.display = 'none';
		ui.boxMsgText.style.display = 'block';
		//--
		//showKeyboard();
		ui.boxMsgText.focus();
		setTimeout(function() {
			ui.boxMsgText.focus();
		}, 150);
	}
}, false);
ui.footerLeft.addEventListener('tap', function(event) {
	var btnArray = [{
		title: "拍照"
	}, {
		title: "从相册选择"
	}];
	plus.nativeUI.actionSheet({
		title: "选择照片",
		cancel: "取消",
		buttons: btnArray
	}, function(e) {
		var index = e.index;
		switch (index) {
			case 0:
				break;
			case 1:
				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(path) {
					plus.gallery.save(path);
					var temp = path.split("/");
					var imgName = temp[temp.length - 1];
					plus.zip.compressImage({
						src: path,
						dst: '_doc/image/' + imgName,
						overwrite: true,
						quality: 32,
						format: 'jpg'
					}, function(e) {
						var p = plus.io.convertLocalFileSystemURL(e.target);
						send({
							sender: 'self',
							time: getTime(),
							type: 'image',
							content: 'file://' + p,
							img:localStorage.getItem('rightimg')
						});
					}, function() {
						mui.toast("图片处理失败!");
					});
				}, function(err) {
					//									alert(err.message);
				}, {
					filename: "_doc/msg/" + targetId + "/" + getMiTime() + ".jpg",
					format: 'jpg'
				});
				break;
			case 2:
				plus.gallery.pick(function(path) {
					plus.zip.compressImage({
						src: path,
						dst: '_doc/image/' + getMiTime() + '.jpg',
						overwrite: true,
						quality: 32,
						format: 'jpg'
					}, function(e) {
						var p = plus.io.convertLocalFileSystemURL(e.target);
						send({
							sender: 'self',
							time: getTime(),
							type: 'image',
							content: "file://" + p,
							img:localStorage.getItem('rightimg')
						});
					}, function() {
						mui.toast("图片处理失败!");
					});

				}, function(err) {}, null);
				break;
		}
	});
}, false);

function sendResumeSuc(data){
	if(data.ec!=sucCode){
		mui.toast(data.em);
		return;
	}
}

function setSoundAlertVisable(show) {
	if (show) {
		ui.boxSoundAlert.style.display = 'block';
		ui.boxSoundAlert.style.opacity = 1;
	} else {
		ui.boxSoundAlert.style.opacity = 0;
		//fadeOut 完成再真正隐藏
		setTimeout(function() {
			ui.boxSoundAlert.style.display = 'none';
		}, 200);
	}
};
var recordCancel = false;
var recorder = null;
var audio_tips = document.getElementById("audio_tips");
var startTimestamp = null;
var stopTimestamp = null;
var stopTimer = null;
ui.boxMsgSound.addEventListener('hold', function(event) {
	recordCancel = false;
	if (stopTimer) clearTimeout(stopTimer);
	audio_tips.innerHTML = "手指上划，取消发送";
	ui.boxSoundAlert.classList.remove('rprogress-sigh');
	setSoundAlertVisable(true);
	recorder = plus.audio.getRecorder();
	if (recorder == null) {
		plus.nativeUI.toast("不能获取录音对象");
		return;
	}
	startTimestamp = (new Date()).getTime();
	recorder.record({
		filename: "_document/" + targetId + "/"
	}, function(path) {
		if (recordCancel) return;
		send({
			sender: 'self',
			time: getTime(),
			type: 'sound',
			content: path,
			img:localStorage.getItem('rightimg')
		});
	}, function(e) {
		plus.nativeUI.toast("录音时出现异常: " + e.message);
	});
}, false);
ui.body.addEventListener('drag', function(event) {
	//console.log('drag');
	if (Math.abs(event.detail.deltaY) > 50) {
		if (!recordCancel) {
			recordCancel = true;
			if (!audio_tips.classList.contains("cancel")) {
				audio_tips.classList.add("cancel");
			}
			audio_tips.innerHTML = "松开手指，取消发送";
		}
	} else {
		if (recordCancel) {
			recordCancel = false;
			if (audio_tips.classList.contains("cancel")) {
				audio_tips.classList.remove("cancel");
			}
			audio_tips.innerHTML = "手指上划，取消发送";
		}
	}
}, false);
ui.boxMsgSound.addEventListener('release', function(event) {
	if (audio_tips.classList.contains("cancel")) {
		audio_tips.classList.remove("cancel");
		audio_tips.innerHTML = "手指上划，取消发送";
	}
	//
	stopTimestamp = (new Date()).getTime();
	if (stopTimestamp - startTimestamp < MIN_SOUND_TIME) {
		audio_tips.innerHTML = "录音时间太短";
		ui.boxSoundAlert.classList.add('rprogress-sigh');
		recordCancel = true;
		stopTimer = setTimeout(function() {
			setSoundAlertVisable(false);
		}, 800);
	} else {
		setSoundAlertVisable(false);
	}
	recorder.stop();
}, false);
ui.boxMsgSound.addEventListener("touchstart", function(e) {
	e.preventDefault();
});
ui.boxMsgText.addEventListener('input', function(event) {
	ui.btnMsgType.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
	ui.btnMsgType.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
	ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
	ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
	ui.content.style.paddingBottom = ui.footer.style.height;
});
ui.boxMsgText.addEventListener('tap', function(event) {
	ui.boxMsgText.focus();
	setTimeout(function() {
		ui.boxMsgText.focus();
	}, 0);
}, false);

function send(msg) {
	//alert(JSON.stringify(msg))
	record.push(msg);
	msg.img = localStorage.getItem('leftimg');
	//msg.img = 'file://' + plus.io.convertLocalFileSystemURL(new UserInfo().selfImgPath());
	bindMsgList();
	var net = plus.networkinfo.getCurrentType();
	if (net == plus.networkinfo.CONNECTION_NONE) {
		mui.toast("无网络连接，请检查网络状态!");
		return;
	}
	plus.webview.getWebviewById('model/order/chatmain.html').evalJS("sendMsg('" + targetId + "'," + JSON.stringify(msg) + ",'1')");
}

function showKeyboard() {
	if (mui.os.ios) {
		var webView = plus.webview.currentWebview().nativeInstanceObject();
		webView.plusCallMethod({
			"setKeyboardDisplayRequiresUserAction": false
		});
	} else {
		var Context = plus.android.importClass("android.content.Context");
		var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
		var main = plus.android.runtimeMainActivity();
		var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
		imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
		imm.showSoftInput(main.getWindow().getDecorView(), InputMethodManager.SHOW_IMPLICIT);
	}
}

function msgItemTap(msgItem, event) {
	var msgType = msgItem.getAttribute('msg-type');
	var msgContent = msgItem.getAttribute('msg-content')
	if (msgType == 'sound') {
		player = plus.audio.createPlayer(msgContent);
		var playState = msgItem.querySelector('.play-state');
		playState.innerText = '正在播放...';
		player.play(function() {
			playState.innerText = '点击播放';
		}, function(e) {
			playState.innerText = '点击播放';
		});
	}
}

function bindMsgList() {
	if (arguments.length > 0) {
		arguments[0].img = tImg;
		arguments[0].time = showTime(arguments[0].time);
		console.log(JSON.stringify(arguments[0]));
		record.push(arguments[0]);
	}
	//绑定数据:
	/*tp.bind({
		template: 'msg-template',
		element: 'msg-list',
		model: record
	});*/
	ui.areaMsgList.innerHTML = template('msg-template', {
		"record": record
	});
	var msgItems = ui.areaMsgList.querySelectorAll('.msg-item');
	[].forEach.call(msgItems, function(item, index) {
		item.addEventListener('tap', function(event) {
			msgItemTap(item, event);
		}, false);
	});
	imageViewer.findAllImage();
	ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
}

//读取聊天记录
function read() {
	plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
		fs.root.getFile("msg/" + targetId + "/" + new UserInfo().userId() + targetId + ".txt", {
				create: true,
				exclusive: false
			},
			function(fileEntry) {
				var reader = null;
				fileEntry.file(function(file1) {
					reader = new plus.io.FileReader();
					reader.onloadend = function(e) {
						console.log("读取文件成功！");
						var result = e.target.result;
						result = "[" + result.replace(/\,$/, "") + "]";
						record = JSON.parse(result);
						for (var i = 0; i < record.length; i++) {
							if (record[i].sender == 'self') {
								record[i].img =localStorage.getItem('leftimg');
								//record[i].img = 'file://' + plus.io.convertLocalFileSystemURL(new UserInfo().selfImgPath());
							} else {
								record[i].img =localStorage.getItem('rightimg');
							}
							record[i].time=showTime(record[i].time);
						}
						bindMsgList();
					}
					reader.readAsText(file1, "utf-8");
				});
			},
			function(e) {
				alert(e.message);
			});
	}, function(e) {
		alert(e.message);
	});
}

//修改聊天列表数据(解决非聊天列表进入聊天页问题)
function initMsg() {
	var list = [];
	var flag = false;
	plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
		fs.root.getFile("msg/" + new UserInfo().userId() + ".txt", {
				create: true,
				exclusive: false
			},
			function(fileEntry) {
				var reader = null;
				fileEntry.file(function(file1) {
					reader = new plus.io.FileReader();
					reader.onloadend = function(e) {
						if (e.target.result != "") {
							var lastindex = e.target.result.indexOf('}]');
							if(lastindex>=0){
								list = JSON.parse(e.target.result.substring(0, lastindex + 2));
							}
						}
						var info = "";
						for (var i = 0; i < list.length; i++) {
							if (list[i].userid == targetId) {
								tImg = list[i].userimage;
								info = list[i].info;
								flag = true;
								break;
							}
						}
						if (flag) {
							plus.webview.getWebviewById('model/order/chatmain.html').evalJS('updateList("' + targetId + '","' + info + '","1","0")');
							read();
						}
					}
					reader.readAsText(file1, "utf-8");
				});
			},
			function(e) {
				alert(e.message);
			});
	}, function(e) {
		alert(e.message);
	}, function(e) {
		alert(e.message);
	});
}

function errorCall(e){
	//alert(e.message)
	mui.toast(e.message);
}

document.getElementById("headerBack").addEventListener('tap',function(){
	back();
});

function back(){
	if (plus.webview.getWebviewById("model/order/chatmain.html")) {
		plus.webview.getWebviewById("model/order/chatmain.html").evalJS("clearTargetId()");
	} else {
		thisview.close();
	}
}

mui.back = function() {
	back();
}
