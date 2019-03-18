var CONFIG = window.CONFIG || {};
//var app = window.app || {};
(function (mui) {
//	
//  app.CACHED_PANDUSER_INFO_KEY_NAME = "pandUserInfo";   
//  app.CACHED_TOKNE = "pandToken"; 
        
    CONFIG.basePath = "https://www.shmimi.com";//真机运行地址    
    //CONFIG.basePath = "/pand-server";//h5页面地址
   
})(mui);

//(function ($) {
//	var userInfoText = localStorage.getItem(app.CACHED_PANDUSER_INFO_KEY_NAME) || "{}";
//	var token = localStorage.getItem(app.CACHED_TOKNE) || "{}";
//  var userInfo = JSON.parse(userInfoText);
//  app.userInfo = userInfo;
//  app.token = token;
//      
//  /**
//   * 获取当前缓存对象
//   **/
//  app.getUserInfo = function () {
//      return app.userInfo;
//  };
//  app.getToken = function () {
//      return app.token;
//  };
//  /**
//   * 设置当前缓存对象
//   **/
//  app.setUserInfo = function (userInfo,token) {
//      userInfo = userInfo || {};
//      token = token || {};
//      localStorage.setItem(app.CACHED_PANDUSER_INFO_KEY_NAME, JSON.stringify(userInfo));
//      localStorage.setItem(app.CACHED_TOKNE, token);
//      app.userInfo = userInfo;
//      app.token = token;
//  };
//  
//  
//})(mui);	
//
