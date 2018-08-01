var nativeLoader = require('nativeLoader');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _isCapturing:false,
        _isShareResult:false,
        _isShareRedPack:false,
    },

    // use this for initialization
    onLoad: function() {
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    init:function() {
		this.ANDROID_API = 'com/' + cc.vv.company + '/' + cc.vv.appname + '/WXAPI';
        this.IOS_API = "AppController";
    },
	
    login:function(){
        if (cc.sys.os == cc.sys.OS_ANDROID) {
			//cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);

            jsb.reflection.callStaticMethod("com/tkmj/game/max/WXAPI", "Login", "()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "login");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    },

    share_club: function(title, desc, timeline,url) {
        this._isShareResult = true;
        var shareUrl = url
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            //cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);

            jsb.reflection.callStaticMethod("com/tkmj/game/max/WXAPI",
                                            "Share",
                                            "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V",
                                            shareUrl,
                                            title,
                                            desc,
                                            timeline ? true : false);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "share:shareTitle:shareDesc:isTimeline:",shareUrl,title,desc,timeline ? true : false);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    },


    share: function(title, desc, timeline) {
        this._isShareResult = true;
        var shareUrl = cc.vv.SI.appweb + "?u=" + cc.vv.userMgr.userId
        if (cc.sys.os == cc.sys.OS_ANDROID) {
			//cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);

            jsb.reflection.callStaticMethod("com/tkmj/game/max/WXAPI",
                                            "Share",
                                            "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V",
                                            shareUrl,
                                            title,
                                            desc,
                                            timeline ? true : false);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "share:shareTitle:shareDesc:isTimeline:",shareUrl,title,desc,timeline ? true : false);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    },
    
    shareResult:function(timeline) {
        if(this._isCapturing){
            return;
        }
        this._isShareResult = true;
        this._isCapturing = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            jsb.fileUtils.removeFile(fullPath);
        }
        // var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height));
        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height), cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        texture.setPosition(cc.p(size.width/2, size.height/2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);
        
        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
			    var width = Math.floor(size.width * scale);
                
                if(cc.sys.os == cc.sys.OS_ANDROID){
					//cc.eventManager.removeCustomListeners(cc.game.EVENT_HIDE);

                    jsb.reflection.callStaticMethod("com/tkmj/game/max/WXAPI", "ShareIMG", "(Ljava/lang/String;IIZ)V",fullPath,width,height, timeline ? true : false);
                }
                else if(cc.sys.os == cc.sys.OS_IOS){
                    jsb.reflection.callStaticMethod(self.IOS_API, "shareIMG:width:height:",fullPath,width,height);
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement share.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50); 
            }
        }
        setTimeout(fn,50);
    },
    _sharePicture:function(fullPath,size,timeline){
        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
                var width = Math.floor(size.width * scale);
                if(cc.sys.os == cc.sys.OS_ANDROID){
                    jsb.reflection.callStaticMethod("com/tkmj/game/max/WXAPI", "ShareIMG", "(Ljava/lang/String;IIZ)V",fullPath,width,height, timeline ? true : false);
                }
                else if(cc.sys.os == cc.sys.OS_IOS){
                    jsb.reflection.callStaticMethod(self.IOS_API, "shareRedPackIMG:width:height:",fullPath,width,height);
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement share.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50);
            }
        }
        setTimeout(fn,50);
    },

    shareRedPack:function() {
        console.log('shareRedPack:',this._isShareRedPack);
        this._isShareResult = false;
        this._isShareRedPack = true;

        var timeline = true;
        var size = cc.director.getWinSize();
        var fileName = 'share_redPackFriendCricle.png';
        var fileUrl =  cc.redPackShareImgUrl+fileName;
        var fullPath = jsb.fileUtils.getWritablePath() +"img/"+ fileName;
        console.log('luobin-share','fullPath=',fullPath);
        if(jsb.fileUtils.isFileExist(fullPath)){
            this._sharePicture(fullPath,size,timeline);
        }else{
            nativeLoader.loadNativeWithCallbackFilePath(fileName, fileUrl, function(fullPath){
                console.log('luobin-share','filepath=',fullPath);
                if (fullPath == null) {
                    cc.log('share error: filepath is null!!');
                    return;
                }

                this._sharePicture(fullPath,size,timeline);
            }.bind(this));
        };
    },
    onLoginResp: function (code) {
        
        if(code == undefined || code == null){
            cc.vv.alert.show('微信授权失败，请稍后再试！');
        }
        
        console.log('onLoginResp',code);
        var fn = function (ret) {
            console.log('baihua2001cn',ret.errcode);
            if (ret.errcode == 0) {
                cc.sys.localStorage.setItem("wx_account", ret.account);
                cc.sys.localStorage.setItem("wx_sign", ret.sign);
                cc.vv.userMgr.onAuth(ret);
            }
        }

        if (code != null) {
            cc.vv.http.sendRequest("/wechat_auth", { code: code, os: cc.sys.os }, fn);
        } else {
            cc.vv.wc.hide();
        }
        /*
                cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function() {
                    cc.game.emit(cc.game.EVENT_HIDE, cc.game);
                });
        */
    },

    onShareResp: function(code) {
        console.log('onShareResp');
        if(this._isShareResult){
            this._isShareResult = false;
            return;
        }
        if(this._isShareRedPack){
            this._isShareRedPack = false;
            if(0 == code){
                cc.vv.userMgr.shareRP();
            }
        }

        /*
                cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function() {
                    cc.game.emit(cc.game.EVENT_HIDE, cc.game);
                });
        */
    },
});

