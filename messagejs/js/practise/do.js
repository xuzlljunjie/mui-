var urlbase = "http://192.168.1.1:8080/test/";
var tokenid = "";
/**
 * @param {String} type 交易的名称
 * @param {JSON} params 提交数据
 * @param {Function} successCall 执行成功回调函数
 * @param {Function} errorCall 执行失败回调函数
 * @param {Boolean} wait 是否锁屏
 */
function visitServer(name, params, successCall, errorCall, wait) {
	//alert('记录数据'+params.targetId)
	if(name=='s_gexin_user_info'){
		if(typeof successCall=='function'){
			//alert(params.targetId)
			var userList=new Map();
			var meInfo=new Map();
			var params = {userId:params.targetId};
			mui.ajax({
				url: 'https://xxyweeds.top/api/system/get_rongcloud_token',
				async: false,
		        data: params,
		        dataType: "json",
		        type: 'post',
				success: function(res){
					console.log('融云token'+JSON.stringify(res.data));
					if(res.result==1){
						userList[params.targetId]={
								targetId: res.data.userId,
								imageUrl:res.data.headImg,
								userName:res.data.name,
								userLevel:res.data.name
					        }
						    localStorage.setItem('rightimg',res.data.headImg);
							var resuData = userList[params.targetId];
							resuData.ec="0";
							resuData.em="";
							console.log(JSON.stringify(resuData));
							successCall(userList[params.targetId]);
					}else{
						mui.toast(res.message);
					}
							
				},
				error: function(xhr, type, errorThrown){
					mui.toast('服务器响应失败');
				}
			});
			
		}
	}
//	tokenid = new UserInfo().token();
//	var netStatus = plus.networkinfo.getCurrentType();
//	if (netStatus == plus.networkinfo.CONNECTION_NONE){
//		plus.nativeUI.closeWaiting();
//		mui.toast('无网络链接，请检查网络设置！');
//		return;
//	}
//	if (wait === undefined) {
//		wait = true;
//	}
//	if (wait) {
//		var waitTitle = '加载中...';
//		if ('waitTitle' in params) {
//			waitTitle = params.waitTitle;
//			delete params.waitTitle;
//		}
//		plus.nativeUI.showWaiting(waitTitle, {
//			padlock: true
//		});
//	}
//	var url = urlbase + name + ".do";
//	params.tokenId = tokenid;
//	   
//	mui.ajax(url, {
//		headers: {
//			'APP_UUID': plus ? plus.device.uuid : '',
//			'PLATFORM': plus ? plus.os.name : ''
//		},
//		contentType:'application/json;charset=UTF-8',
//		data: JSON.stringify(params),
//		dataType: 'json',
//		type: 'post',
//		timeout: 20000,
//		success: function(data) {
//			if (data == null) {
//				mui.toast('未查询到相关信息，请核实后再查询！');
//				return;
//			}
//			console.log('返回信息:' + JSON.stringify(data));
//			if (wait) {
//				plus.nativeUI.closeWaiting();
//			}
//			if (typeof successCall == 'function') {
//				successCall(data);
//			}
//		},
//		error: function(xhr, type, errorThrown) {
//			plus.nativeUI.closeWaiting();
//			console.log(errorThrown);
//			console.log(name + "_" + type + "_" + url);
//			if (wait) {
//				plus.nativeUI.closeWaiting();
//			}
//			mui.toast('网络请求超时，请稍后再试');
//			if (typeof errorCall == 'function') {
//				console.log('errorCall');
//				errorCall("1");
//			}
//		}
//	});
}

/**
 * 
 * @param {Object} picType 图片类型  0:学生技能，1:学科成绩，2:学校风采,3:企业风采
 * @param {Object} businessCode 业务编码
 * @param {Object} picDesc 图片／视频描述
 * @param {Object} opType 操作类型 0:增加，1：删除，2:修改
 * @param {Object} showCode 风采展示id
 * @param {Object} files 文件路径集合
 * @param {Object} successCall 成功回调
 * @param {Object} wait 等待说明
 */
function uploadFile(params,files,successCall,wait) {
	var netStatus = plus.networkinfo.getCurrentType();
	if (netStatus == plus.networkinfo.CONNECTION_NONE){
		plus.nativeUI.closeWaiting();
		mui.toast('无网络链接，请检查网络设置！');
		return;
	}
	if(new UserInfo().urlbase() != "" && new UserInfo().urlbase()!=null){
		urlbase = new UserInfo().urlbase();
	}
	var url = urlbase+"s_file_upload.do";
	if (wait === undefined) {
		wait = true;
	}
	if (wait) {
		var waitTitle = '上传中...';
		plus.nativeUI.showWaiting(waitTitle, {
			padlock: true
		});
	}
	var upload = plus.uploader.createUpload(url, {
			method: 'post',
			timeout:300000,
			retryInterval:60000
		},
		function(t, status) {
//			if (wait) {
//				plus.nativeUI.closeWaiting();
//			}
			if (status == 200) {
				console.log("上传成功："+status);
				console.log(t.responseText);
//				plus.storage.setItem("uploader", t.responseText); //添加数据存储到应用中
				if (typeof successCall == 'function') {
					successCall(JSON.parse(t.responseText));
				}
			} else {
				console.log(status);
				if (wait) {
					plus.nativeUI.closeWaiting();
				}
				mui.toast('亲，问题上传失败');
//				outLine("上传失败：" + status);
			}
		});
	upload.addData("client", "practise_easy_student");
	upload.addData("uid", Math.floor(Math.random() * 100000000 + 10000000).toString());
	upload.setRequestHeader("tokenId",new UserInfo().token());
	upload.setRequestHeader("studentCode",new UserInfo().userId());
	upload.setRequestHeader("picType",params.picType);
	upload.setRequestHeader("businessCode",params.businessCode);
	upload.setRequestHeader("opType",params.opType);
	upload.setRequestHeader("showCode",params.showCode);
	upload.setRequestHeader("feedBackCode",params.feedBackCode);
//	if(params.picDesc!=''){
//		//上传学科成绩的时候没有此参数
		upload.setRequestHeader("picDesc",encodeURI(encodeURI(params.picDesc)));
//	}
	for (var i = 0; i < files.length; i++) {
		upload.addFile(files[i].path, {
			key: files[i].name
		});
	}
	upload.start();
}

//上传头像图片
function uploadHeadFile(businessCode,files,successCall) {
	if(new UserInfo().urlbase() != "" && new UserInfo().urlbase()!=null){
		urlbase = new UserInfo().urlbase();
	}
	var url = urlbase+"s_file_upload.do";
	var upload = plus.uploader.createUpload(url, {
			method: 'post'
		},
		function(t, status) {
			if (status == 200) {
				console.log(t.responseText);
				if (typeof successCall == 'function') {
					successCall(t.responseText);
				}
			} else {
				if (wt) {
					plus.nativeUI.closeWaiting();
					wt = false;
				}
				console.log(status);
				console.log(t.getAllResponseHeaders());
				mui.toast('亲，头像上传失败');
			}
		});
	upload.addData("client", "practise_student");
	upload.addData("uid", Math.floor(Math.random() * 100000000 + 10000000).toString());
	upload.setRequestHeader("tokenId",new UserInfo().token());
	upload.setRequestHeader("studentCode",new UserInfo().userId());
	upload.setRequestHeader("businessCode",businessCode);
	for (var i = 0; i < files.length; i++) {
		upload.addFile(files[i].path, {
			key: files[i].name
		});
	}
	upload.start();
}