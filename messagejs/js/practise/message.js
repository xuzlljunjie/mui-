var thisview = null;
var openId = null;
var list = [];
var signleList = [];
var totalNum = 0;
var sysMsgList = [];
var indexview = null;
//需要添加自己的imkey(融云申请)
var imKey = '25wehl3u2g80w';
var userid = '';//c用户
mui.init();
mui.plusReady(function() {
	userid = new UserInfo().userId();
	thisview = plus.webview.currentWebview();
	indexview = plus.webview.getLaunchWebview();
	mainInit();
});

function mainInit(){
	initList();
	initSysmsg();
	initIM();
}

//初始化系统消息(系统消息为非im消息，此处可忽略)
function initSysmsg(){
	var params = {
		studentCode:userid
	}
//	visitServer('s_query_message_list',params,querySuc,errorCall,false);
}

function querySuc(data){
	//alert(data)
	if(data.ec!=sucCode){
		mui.toast(data.em);
		return;
	}
	sysMsgList = data.messageList;
	if(sysMsgList.length<=0){
		return;
	}
	var sysNum = 0;
	for(var i=0;i<sysMsgList.length;i++){
		if(sysMsgList[i].messageIsNew=='0'){
			sysNum++;
		}
	}
	var sysview = plus.webview.getWebviewById('system_message');
	if(sysNum>0 && document.getElementById("sysNum").style.display == 'none' && !sysview){
		document.getElementById("sysNum").style.display = '';
		totalNum++;
		resetNo();
	}
	if(sysview){
		console.log(1)
		sysview.evalJS('addBefore('+sysMsgList[0]+')');
	}
	document.getElementById("sysTime").innerHTML = showTime(sysMsgList[0].messageSendTime);
	document.getElementById("sysContent").innerHTML = sysMsgList[0].messageContent;
}

//点击系统消息，进入系统消息内容
//document.getElementById("sysMessage").addEventListener('tap',function(){
//	mui.openWindow({
//		id:'system.html',
//		url:'message/system.html',
//		waiting:{
//			autoShow:false
//		},
//		extras:{
//			msgList:sysMsgList
//		}
//	});
//	if(document.getElementById("sysNum").style.display == 'none'){
//		return;
//	}
//	var params = {
//		studentCode:userid
//	}
//	//设置已读
////	visitServer('s_batch_update_message',params,readedSuc,errorCall,false);
//});

function readedSuc(data){
	if(data.ec!=sucCode){
		mui.toast(data.em);
		return;
	}
	document.getElementById("sysNum").style.display = 'none';
	totalNum--;
	resetNo();
}

//进入聊天页面
function toInfo(tid) {
	openId = tid;
	mui.openWindow({
		id: 'message_talk_info',
		url: 'message/message_talk_info.html',
		extras: {
			targetId: tid,
			targetName:document.getElementById(tid).getAttribute('data-name')
		},
		waiting:{
			autoShow:false
		}
	});
	setInfo(tid);
}

//清除当前页面纪录的聊天对象(入：张三的id)
function clearTargetId() {
	openId = null;
	plus.webview.getWebviewById("message_talk_info").close();
}

//初始化消息列表
function initList() {
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
						console.log("读取文件成功！");
						if (e.target.result != "") {
							var lastindex = e.target.result.indexOf('}]');
							if(lastindex>=0){
								console.log("读取文件成功"+e.target.result.substring(0, lastindex + 2));
								list = JSON.parse(e.target.result.substring(0, lastindex + 2));
							}
						}
						for (var i = 0; i < list.length; i++) {
							if(document.getElementById(list[i].userid)){
								continue;
							}
							console.log('会话列表数据'+JSON.stringify(list[i]))
							newItem(list[i],true);
							//alert(3)
							totalNum += parseInt(list[i].num);
							signleList.push(list[i]);
						}
						resetNo();
						if(list.length>signleList.length){
							//去重，更新列表
							list.splice(0,list.length);
							list = signleList.splice(0,signleList.length);
						}
						//每次启动app都要更新聊天列表中每一个聊天对象的信息（头像、名字等）demo无后台，注释掉
//						updateUserInfo();
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


function setInfo(id, info,sFlag) {
	if (document.getElementById(id)) {
		showInfo(id, info,sFlag);
	}
}

//实时更新提示未读消息数量
function showInfo(id, info,sFlag) {
	//alert(info)
	var notReadNo = document.getElementById('num'+id);
	var oldNo = notReadNo.innerHTML;
	if (id == openId || sFlag == '0'){
		totalNum += (0-parseInt(oldNo));
		notReadNo.innerHTML = 0;
		notReadNo.style.display = "none";
	} else {
		notReadNo.innerHTML = parseInt(oldNo) + 1;
		notReadNo.style.display = "";
		totalNum ++;
	}
	if(totalNum<0){
		totalNum = 0;
	}
	
	if (info!= null) {
		//alert('haode')
		document.getElementById("info" + id).innerHTML = info+'<font style="float:right;">最新消息</font>';
	}
	resetNo();
}

//更新聊天列表最后聊天时间
function setTime(tId){
	var firstEl = document.getElementById("messageList").firstChild;
	var thisEl = document.getElementById(tId);
	if(document.getElementById(tId)){
		document.getElementById("time" + tId).innerHTML = getTime().substr(11,5);
	}
	if(firstEl.getAttribute('id')!=tId){
		document.getElementById("messageList").removeChild(thisEl);
		document.getElementById("messageList").insertBefore(thisEl,firstEl);
	}
}

//index页面底部红点处理方法
function resetNo(){
	//alert(totalNum)
	indexview.evalJS('setTips("messageTips","'+totalNum+'")');
}
/**
 * 新增一条记录
 * @param {Object} userData 记录的json数据
 * @param {Object} imgFlag 是否是初始化的聊天数据
 */
function newItem(userData,initFlag) {
	//alert(userData)
	var newInfo = '<div class="result_img_box">'+
					'<span id="num'+ userData.userid +'" class="mui-badge2"';
	if (userData.num != '0') {
		newInfo += '>' + userData.num + '</span>';
	} else {
		newInfo += ' style="display:none;">0</span>';
	}
	var imgSrc = '';
	if(initFlag){
		//表示初始化的聊天列表
		imgSrc = userData.userimage;
	}
	newInfo += '<img id="img'+ userData.userid +'" class="result_img" data-id="'+userData.userid+'" src="' + imgSrc + '" /></div>'+
		'<div class="item_right">'+
			'<p id class="font_16 color_black">'+userData.userlevel+'<span id="time'+userData.userid+'" class="color_bd float_right font_12">'+showTime(userData.time)+'</span></p>'+
			'<p class="font_13 color_75">'+userData.username+'</p>'+
			'<p style="color:red;" id="info'+userData.userid+'" class="font_12 color_bd text_overflow_ellipsis">'+userData.info+'<font style="float:right;">最新消息</font></p>'+
		'</div>'+
		'<hr color="#e5e5e5" size="1" />';
	var el = document.createElement("div");
	el.setAttribute('id',userData.userid);
	el.setAttribute("class", "result_item");
	el.setAttribute('data-name',userData.userlevel);
	el.innerHTML = newInfo;
	if(initFlag){
		document.getElementById("noseach").style.display="none"
		document.getElementById("messageList").appendChild(el);
	}else{
		var firstEl = document.getElementById("messageList").firstChild;
		document.getElementById("messageList").insertBefore(el,firstEl);
	}
}
////点击进入聊天对象(张三)的详细信息
//mui('#messageList').on('tap','.result_img',function(){
//	event.stopPropagation();
//	var userCode = this.getAttribute('data-id');
//	mui.openWindow({
//		id:'**',
//		url:'**.html',
//		waiting:{
//			autoShow:false
//		},
//		extras:{
//			companyId:userCode,
//			positionCode:''
//		}
//	});
//});

//更新聊天对象的id(方便此人来消息的时候不进行未读消息提示数量的更新)
function changeOpenId(tId){
	//alert(3)
	openId = tId;
}

//打开具体聊天页面
mui('#messageList').on('tap','.result_item',function(){
	toInfo(this.getAttribute('id'));
});

////查询聊天记录
//document.getElementById("messageSearch").addEventListener('tap',function(){
//	mui.openWindow({
//		id:'message_search',
//		url:'message/message_search.html',
//		waiting:{
//			autoShow:false
//		},
//		extras:{
//			list:signleList
//		}
//	});
//});

function errorCall(){
	
}
