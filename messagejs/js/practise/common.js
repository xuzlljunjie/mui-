//定义全局变量
//请求服务器成功返回码
var sucCode = '0';
//请求服务器会话失败返回码
var golSessionError = 'PUB-003';
//下载头像文件本地存放目录
var downHeadPhotoPath = "_downloads/headImg/uploadHeadImg_";

//选取图库内容
function fromGallery(callSuc,filt) {
	plus.gallery.pick(function(path) {
		var temp = path.split("/");
		var fileName = temp[temp.length-1];
		if(fileName.indexOf('.jpg')>0 ||
			fileName.indexOf('.JPG')>0 ||
			fileName.indexOf('.png')>0 ||
			fileName.indexOf('.PNG')>0){
			//图片
			plus.zip.compressImage({
				src: path,
				dst: '_doc/image/'+getMiTime()+".jpg",
				overwrite: true,
				quality: 32,
				format:'jpg'
			}, function(e) {
				var p = plus.io.convertLocalFileSystemURL(e.target);
				if(typeof callSuc == 'function'){
					callSuc('file://'+ p);
				}
			}, function() {
				mui.toast("图片处理失败!");
			});
		}else{
			//视频
			var p = plus.io.convertLocalFileSystemURL(path);
			if(typeof callSuc == 'function'){
				callSuc('file://'+ p);
			}
		}
		
	}, function(e) {
		/*mui.toast("取消选择图片");*/
	}, {
		//过滤选择的是图片还是视频还是都可选
		filter: filt
	});
}

function UserInfo() {
	//清除用户信息
	var clear = function() {
		plus.storage.removeItem('userid');
		plus.storage.removeItem('username');
		plus.storage.removeItem('userType');
		plus.storage.removeItem('integration');
//		plus.storage.removeItem('selfImg');
//      plus.storage.removeItem('selfImgPath');
		plus.storage.removeItem('token');
		plus.storage.removeItem('imtoken');
		//用来标识信息完善度，0代表基本信息完善，4代表基本信息未完善
		plus.storage.removeItem('checkprogress');
//		plus.storage.removeItem('version');
//		plus.storage.removeItem('urlbase');
		plus.storage.removeItem('userEmail');
		plus.storage.removeItem('carSeriesCode');
//		plus.storage.removeItem('orderNum');
	}

	//检查是否包含自动登录的信息
	var autoLogin = function() {
		var username = username();
		var pwd = passWord();
		if (!username || !pwd) {
			return false;
		}
		return true;
	}

	//检查是否登陆
	var hasLogin = function() {
		var userid = plus.storage.getItem('userid');
		//		var token = plus.storage.getItem('token');
		if (!userid) {
			return false;
		}
		return true;
	}

	var imToken = function() {
		if (arguments.length == 0) {
			return plus.storage.getItem('imtoken');
		} else if (arguments[0] === '') {
			plus.storage.removeItem('imtoken');
			return;
		}
		plus.storage.setItem('imtoken', arguments[0]);
	}
	
	var urlbase = function() {
		if(arguments.length==0){
			return plus.storage.getItem('urlbase');
		}else if(arguments[0]==''){
			plus.storage.removeItem('urlbase');
			return;
		}
		plus.storage.setItem('urlbase', arguments[0]);
	}

	var userId = function() {
			if (arguments.length == 0) {
				return plus.storage.getItem('userid');
			} else if (arguments[0] === '') {
				plus.storage.removeItem('userid');
				return;
			}
			plus.storage.setItem('userid', arguments[0]);
		}
		//对username进行操作
	var userName = function() {
		if (arguments.length == 0) {
			return plus.storage.getItem('username');
		} else if (arguments[0] === '') {
			plus.storage.removeItem('username');
			return;
		}
		plus.storage.setItem('username', arguments[0]);
	}

	//对其余各参数进行同上（username）操作
	var userType = function() {
		if (arguments.length == 0) {
			return plus.storage.getItem('userType');
		} else if (arguments[0] === '') {
			plus.storage.removeItem('userType');
			return;
		}
		plus.storage.setItem('userType', arguments[0]);
	}

	var integration = function() {
		if (arguments.length == 0) {
			return plus.storage.getItem('integration');
		} else if (arguments[0] === '') {
			plus.storage.removeItem('integration');
			return;
		}
		plus.storage.setItem('integration', arguments[0]);
	}

	var selfImg = function() {
		if (arguments.length == 0) {
			return plus.storage.getItem('selfImg');
		} else if (arguments[0] === '') {
			plus.storage.removeItem('selfImg');
			return;
		}
		plus.storage.setItem('selfImg', arguments[0]);
	}
	var selfImgPath = function() {
		if (arguments.length == 0) {
			return plus.storage.getItem('selfImgPath');
		} else if (arguments[0] === '') {
			plus.storage.removeItem('selfImgPath');
			return;
		}
		plus.storage.setItem('selfImgPath', arguments[0]);
	}
	var token = function() {
		if (arguments.length == 0) {
			return plus.storage.getItem('token');
		} else if (arguments[0] === '') {
			plus.storage.removeItem('token');
			return;
		}
		plus.storage.setItem('token', arguments[0]);
	}
	
	var version = function() {
		if (arguments.length == 0) {
			return plus.storage.getItem('version');
		} else if (arguments[0] === '') {
			plus.storage.removeItem('version');
			return;
		}
		plus.storage.setItem('version', arguments[0]);
	}
	
	var userEmail = function() {
		if(arguments.length==0){
			return plus.storage.getItem('userEmail');
		}else if(arguments[0]==''){
			plus.storage.removeItem('userEmail');
			return;
		}
		plus.storage.setItem('userEmail', arguments[0]);
	}
	
	var carSeriesCode = function() {
		if(arguments.length==0){
			return plus.storage.getItem('carSeriesCode');
		}else if(arguments[0]==''){
			plus.storage.removeItem('carSeriesCode');
			return;
		}
		plus.storage.setItem('carSeriesCode', arguments[0]);
	}
	
	var checkprogress = function() {
		if(arguments.length==0){
			return plus.storage.getItem('checkprogress');
		}else if(arguments[0]==''){
			plus.storage.removeItem('checkprogress');
			return;
		}
		plus.storage.setItem('checkprogress', arguments[0]);
	}
	
	var lauchFlag = function() {
		if(arguments.length==0){
			return plus.storage.getItem('lauchFlag');
		}else if(arguments[0]==''){
			plus.storage.removeItem('lauchFlag');
			return;
		}
		plus.storage.setItem('lauchFlag', arguments[0]);
	}

	this.clear = clear;
	this.autoLogin = autoLogin;
	this.hasLogin = hasLogin;
	this.userId = userId;
	this.imToken = imToken;
	this.urlbase = urlbase;
	this.userName = userName;
	this.userType = userType;
	this.integration = integration;
	this.selfImg = selfImg;
	this.selfImgPath = selfImgPath;
	this.token = token;
	this.version = version;
	this.userEmail = userEmail;
	this.carSeriesCode = carSeriesCode;
	this.checkprogress = checkprogress;
	this.lauchFlag = lauchFlag;
	//	plus.nativeUI.alert
}

function convertBase64UrlToBlob(urlData) {

	var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte

	//处理异常,将ascii码小于0的转换为大于0
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}

	return new Blob([ab], {
		type: 'image/png'
	});
}

//把base64编码数据转换为本地文件
function base64ToFile(base64Info, filePath, successToFile) {
	plus.io.resolveLocalFileSystemURL(new UserInfo().selfImgPath(),function(entry){
		entry.remove()});
			var bitMap = new plus.nativeObj.Bitmap();
			bitMap.loadBase64Data(base64Info, function() {
				console.log("创建成功");
			}, function() {
				console.log("创建失败");
			});
			bitMap.save(filePath, {
				overwrite: true
			}, function(event) {
				console.log("保存成功");
				if (typeof successToFile == 'function') {
					successToFile();
				}
			}, function(e) {
				console.log("保存失败" + e.message);
			});
}

//下载个人头像(人员登陆时判断，此处不涉及im)
function downHeadImg(downUrl, param,name) {
	
}

//获取格式化时间
function getTime() {
	var date = null;
	if (arguments[0] == "" || arguments[0] == null) {
		date = new Date();
	} else {
		date = new Date(arguments[0]);
	}
	var year = date.getFullYear();
	var month = date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
	var min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
	var scd = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
	return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + scd;
}

//获取无空格等分隔符的时间戳
function getMiTime(){
	var date = null;
	if (arguments[0] == "" || arguments[0] == null) {
		date = new Date();
	} else {
		date = new Date(arguments[0]);
	}
	var year = date.getFullYear();
	var month = date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
	var min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
	var scd = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
	return year + "" + month + "" + day + "" + hour + "" + min + "" + scd;
}

//更新聊天列表内容变化
function updateInitList() {
	plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
		fs.root.getFile("msg/" + new UserInfo().userId() + ".txt", {
				create: true,
				exclusive: false
			},
			function(fileEntry) {
				fileEntry.createWriter(function(write) {
					console.log('updated success');
					write.onwrite = function() {
						console.log(JSON.stringify(signleList));
					};
					write.seek(0);
					write.write(JSON.stringify(signleList));
				}, function(e) {
					alert(e.message);
				});
			}, function(e) {
				alert(e.message);
			});
	}, function(e) {
		alert(e.message);
	});
}

function getDownUrl(path,chatCode){
	return path + '&businessCode=CO1007&chatCode=' + chatCode;
}

/**
 * 显示时间(im实用，便于用户区分聊天的日期)
 * 如果需要可以自己改的更详细
 */
function showTime(time){
	var currentTime = getTime();
	if(time.substr(0,10)==currentTime.substr(0,10)){
		//当天
		return time.substr(11,5);
	}else if(time.substr(0,4)==currentTime.substr(0,4)){
		//今年
		return time.substr(5,5);
	}else{
		//早些年月
		return time.substr(0,10);
	}
}
