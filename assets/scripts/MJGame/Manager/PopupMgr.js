cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _popuproot:null,
        _settings:null,
        _dissolveNotice:null,
        
        _endTime:-1,
        _extraInfo:null,
        _noticeLabel:null,
        _isBtnAgree:false,
        _toggleType: "",
        _languageRBArray: [],
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        cc.vv.popupMgr = this;
        
        this._popuproot = cc.find("Canvas/popups");
        this._settings = cc.find("Canvas/popups/settings");
        this._dissolveNotice = cc.find("Canvas/popups/dissolve_notice");
        this._noticeLabel = this._dissolveNotice.getChildByName("info").getComponent(cc.Label);
        
        this.closeAll();

        if (this._languageRBArray == null) {
            this._languageRBArray = [];
        }

        var language = cc.find("Canvas/popups/settings/language");
        if (language != null || language != undefined) {
            for (var i = 1; i < language.childrenCount; i++) {
                var radiobutton = language.children[i].getComponent("RadioButton");
                this._languageRBArray.push(radiobutton);
            }; 
            this.addRBHandler("settings/language/mandarin/btnMandarin", "On_Btn_Mandarin_OnClicked");
            this.addRBHandler("settings/language/dialect/btnDialect", "On_Btn_Dialect_OnClicked");
            this.addRBHandler("settings/language/mandarin/lblMandarin", "On_Btn_Mandarin_OnClicked");
            this.addRBHandler("settings/language/dialect/lblDialect", "On_Btn_Dialect_OnClicked");
        }
        
        
        this.addBtnHandler("settings/btn_close");
        this.addBtnHandler("settings/btn_sqjsfj");
        
        this.addBtnHandler("dissolve_notice/btn_agree");
        this.addBtnHandler("dissolve_notice/btn_reject");
        this.addBtnHandler("dissolve_notice/btn_ok");

        this.onEventListener();
        
        var self = this;
        this.node.on("dissolve_notice",function(event){
            var data = event.detail;
            self.showDissolveNotice(data);

            var btn = cc.find("Canvas/popups/dissolve_notice/btn_agree");
            if (self._isBtnAgree == true) {
                self.setGrayBtn(btn);
                var btn_reject = cc.find("Canvas/popups/dissolve_notice/btn_reject");
                self.setGrayBtn(btn_reject);
            }
        });
        
        this.node.on("dissolve_cancel",function(event){
            self._endTime = -1;
            self.closeAll();
            self._isBtnAgree = false;
            var btn = cc.find("Canvas/popups/dissolve_notice/btn_agree");
            self.setLightBtn(btn);
            var btn_reject = cc.find("Canvas/popups/dissolve_notice/btn_reject");
            self.setLightBtn(btn_reject);
        });

        this.node.on('game_over',function(data){
            self._endTime = -1;
        });

        this.node.on('game_end',function(data){
            self.closeAll();
        });
    },
    
    start:function(){
        if(cc.vv.gameNetMgr.dissoveData){
            this.showDissolveNotice(cc.vv.gameNetMgr.dissoveData);
        }
    },

    setGrayBtn: function (btn) {
        btn.getComponent(cc.Button).interactable = false;
        btn.getComponent(cc.Button).enableAutoGrayEffect = true;
    },

    setLightBtn: function (btn) {
        btn.getComponent(cc.Button).interactable = true;
        btn.getComponent(cc.Button).enableAutoGrayEffect = false;
    },
    
    addBtnHandler:function(btnName){
        var btn = cc.find("Canvas/popups/" + btnName);
        this.addClickEvent(btn,this.node,"PopupMgr","onBtnClicked");
    },

    addRBHandler:function(btnName, functionName){
        var btn = cc.find("Canvas/popups/" + btnName);
        this.addClickEvent(btn,this.node,"PopupMgr",functionName);
    },
    
    addClickEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    onBtnClicked:function(event){
        this.closeAll();
        var btnName = event.target.name;
        if(btnName == "btn_agree"){
            this._isBtnAgree = true;
            cc.vv.net.send("dissolve_agree");
        }
        else if(btnName == "btn_reject"){
            cc.vv.net.send("dissolve_reject");
        }
        else if(btnName == "btn_sqjsfj"){
            this._isBtnAgree = true;
            cc.vv.net.send("dissolve_request"); 
        }
    },
    
    closeAll:function(){
        this._popuproot.active = false;
        this._settings.active = false;
        this._dissolveNotice.active = false;
    },
    
    showSettings:function(){
        this.closeAll();
        this._popuproot.active = true;
        this._settings.active = true;

        var isIdle = true;
        if ((cc.vv.PKReplayMgr.isReplay()==false ||  cc.vv.replayMgr.isReplay() == false) && cc.vv.gameNetMgr.numOfGames != 0) {
            isIdle = false;
        }
        // var isIdle = cc.vv.gameNetMgr.numOfGames == 0;
        var btn = cc.find("Canvas/popups/settings/btn_sqjsfj");
        if (isIdle) {
            this.setGrayBtn(btn);
        }else {
            this.setLightBtn(btn);
        }

        this.initLanguageRB();
    },
    
    showDissolveRequest:function(){
        this.closeAll();
        this._popuproot.active = true;
    },
    
    showDissolveNotice:function(data){
        this._endTime = Date.now()/1000 + data.time;
        this._extraInfo = "";
        for(var i = 0; i < data.states.length; ++i){
            var b = data.states[i];
            var name = cc.vv.gameNetMgr.seats[i].name;
            if(b){
                this._extraInfo += "\n[已同意] "+ name;
            }
            else{
                this._extraInfo += "\n[待确认] "+ name;
            }
        }
        this.closeAll();
        this._popuproot.active = true;
        this._dissolveNotice.active = true;;
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._endTime > 0){
            var lastTime = this._endTime - Date.now() / 1000;
            if(lastTime < 0){
                cc.vv.userMgr.oldRoomId = null;
                cc.vv.gameNetMgr.reset();
                if(lastTime < -3)
                {
                    this._dissolveNotice.active = false;
                    this._endTime = -1;
                    cc.director.loadScene("hall");
                }
                return;
            }
            
            var m = Math.floor(lastTime / 60);
            var s = Math.ceil(lastTime - m*60);
            
            var str = "";
            if(m > 0){
                str += m + "分"; 
            }
            
            this._noticeLabel.string = str + s + "秒后房间将自动解散" + this._extraInfo;
        }
    },

    onEventListener: function () {
         this._popuproot.on(cc.Node.EventType.TOUCH_START,function(event){
        });
    },

    initLanguageRB: function () {
        if (this._languageRBArray == null || this._languageRBArray.length <= 0) {
            return;
        }
        var localLanguage = cc.sys.localStorage.getItem('localLanguage');
        if (localLanguage == "Dialect") {
            this.On_Btn_Dialect_OnClicked();
        }else if (localLanguage == "Mandarin") {
            this.On_Btn_Mandarin_OnClicked();
        }else {
            this._toggleType = "Mandarin";
            cc.sys.localStorage.setItem('localLanguage', this._toggleType);
            cc.vv.audioMgr.setLanguageName(this._toggleType);
        }
    },

    On_Btn_Mandarin_OnClicked: function () {
        if (this._toggleType == "Mandarin") {
            return;
        }
        this._toggleType = "Mandarin";
        cc.sys.localStorage.setItem('localLanguage', this._toggleType);
        cc.vv.audioMgr.setLanguageName(this._toggleType);

        cc.vv.radiogroupmgr.check(this._languageRBArray[0]);
    },

    On_Btn_Dialect_OnClicked: function () {
        if (this._toggleType == "Dialect") {
            return;
        }
        this._toggleType = "Dialect";
        cc.sys.localStorage.setItem('localLanguage', this._toggleType);
        cc.vv.audioMgr.setLanguageName(this._toggleType);
        
        cc.vv.radiogroupmgr.check(this._languageRBArray[1]);
    },
});
