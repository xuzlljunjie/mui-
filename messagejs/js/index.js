//var menu = null,
//	main = null,
//	self = null;
//var activeTab = null;
//var aniShow = {};
//var subpages = ['pages/friends.html','pages/message.html'];
//var subpage_style = {
//	top: '0px',
//	bottom: '50px'
//};
//var userid = null;
//var pushFlag = false;
////创建子页面，首个选项卡页面显示，其它均隐藏；
//mui.plusReady(function() {
//	new UserInfo().urlbase(urlbase);
//	//仅支持竖屏显示
//	plus.screen.lockOrientation("portrait-primary");
//	self = plus.webview.currentWebview();
////	var showGuide = 'true';
//	// 监听点击消息事件(推送)
//	plus.push.addEventListener("click", function(msg) {
//		clickMsg(msg);
//	}, false);
//	// 监听在线消息事件(推送)
//	plus.push.addEventListener("receive", function(msg) {
//		receiveMsg(msg);
//	}, false);
//	document.addEventListener('pause',function(){
//		pushFlag = true;
//	},false);
//	document.addEventListener('resume',function(){
//		pushFlag = false;
//		clearAllPush();
//	},false);
//	userid = new UserInfo().userId();
////	initMain();
//	if(userid==null){
//		mui.openWindow({
//			id:'select',
//			url:'pages/select.html',
//			waiting:{
//				autoShow:false
//			}
//		});
//	}else{
//		initMain();
//	}
//});


//function initMain() {
//	for (var i = 0; i < 2; i++) {
//		var temp = {};
//		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
//		if (i > 0) {
//			sub.hide();
//		} else {
//			activeTab = subpages[i];
//			temp[subpages[i]] = "ture";
//			mui.extend(aniShow, temp);
//		}
//		self.append(sub);
//	}
//	var sub = plus.webview.create(subpages[0], subpages[0], subpage_style);
//	self.append(sub);
//}
//选项卡点击事件
//mui('.tab_bar_pub').on('tap', 'li', function(e) {
//	var targetTab = this.getAttribute('data-value');
//	if (targetTab == activeTab) {
//		return;
//	}
//	//显示目标选项卡
//	if (mui.os.ios || aniShow[targetTab]) {
//		plus.webview.show(targetTab);
//	} else {
//		var temp = {};
//		temp[targetTab] = "true";
//		mui.extend(aniShow, temp);
//		plus.webview.show(targetTab, "fade-in", 300);
//	}
//	//隐藏当前;
//	plus.webview.hide(activeTab);
//	var higC = document.querySelector('.hig');
//	higC.classList.remove('hig');
//	this.classList.add('hig');
//	//更改当前活跃的选项卡
//	activeTab = targetTab;
//});
//设置提示红点
function setTips(id,indexNum){
	var classList = document.getElementById(id).classList;
	if(indexNum>0){
		if(classList.contains('tips_display')){
			classList.remove('tips_display');
		}
	}else{
		if(!classList.contains('tips_display')){
			classList.add('tips_display');
		}
	}
}

////显示三个主页中的某一个
//function showSubpages(pageId){
//	var current = document.querySelector(".hig");
//	if (current.getAttribute("id") != pageId) {
//		mui.trigger(document.getElementById(pageId), 'tap');
//		current.classList.remove("mui-active");
//		document.getElementById(pageId).classList.add("mui-active");
//	}
//}

//function logout() {
//	new UserInfo().clear();
//	var current = document.querySelector(".hig");
//	if (current.getAttribute("id") != 'discovery') {
//		mui.trigger(document.getElementById("discovery"), 'tap');
//		current.classList.remove("hig");
//		document.getElementById('discovery').classList.add("hig");
//	}
//	var arr = plus.webview.all();
//	var index = plus.webview.getLaunchWebview().id;
//	for(var i=0;i<arr.length;i++){
//		if(arr[i].id!=index && arr[i].id!='select'){
//			arr[i].close();
//		}
//	}
//	plus.webview.getWebviewById('select').show();
//}
//
var first = null;
mui.back = function() {
	//首次按键，提示‘再按一次退出应用’
	if (!first) {
		first = new Date().getTime();
		mui.toast('再按一次退出应用');
		setTimeout(function() {
			first = null;
		}, 1000);
	} else {
		if (new Date().getTime() - first < 1000) {
			new UserInfo().clear();
			plus.runtime.quit();
			localStorage.setItem('userinfo','');
			localStorage.setItem('token','');
			localStorage.setItem("locationadress",'');
		}
	}
};



