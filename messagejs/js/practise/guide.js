mui.init();
var thisview = null;
mui.plusReady(function() {
	if (mui.os.ios) {
		plus.navigator.setFullscreen(true);
	}
	thisview = plus.webview.currentWebview();
	plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque");
	plus.navigator.setStatusBarBackground('#0e2a5e');
	plus.navigator.closeSplashscreen();
});
//立即起航按钮点击事件
document.getElementById("close").addEventListener('tap', function() {
//	plus.storage.setItem("lauchFlag", "true");
	new UserInfo().lauchFlag('true');
	plus.navigator.setFullscreen(false);
	/*plus.webview.currentWebview().close();*/
	mui.openWindow({
		url: '/pages/login/login.html',
		id: 'login'
	});
});
document.getElementById("slider").addEventListener('slide',function(event){
	var indexEl = document.querySelector('.mui-slider-indicator');
	if(event.detail.slideNumber==2){
		indexEl.style.display = 'none';
	}else{
		indexEl.style.display = '';
	}
});

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
			plus.runtime.quit();
		}
	}
};