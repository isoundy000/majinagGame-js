import { toUnicode } from "punycode";

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
        _wanfaxuanze:null,//玩法
        _jushuxuanze:null,//局数
        _jushuxuanze_PK:null,//局数  PK
        _xuanzerenshu:null,//选择人数
        _xuanzerenshuNode:cc.Node,//
        _xuanzejushuNode:cc.Node,
        _xuanzejushuNode_PK:cc.Node,
        _jushuNodeY:null,
        _idx: 0,
        _wanfa: null,
        opTypeCount: 0,
        gpsChkFlag:null
    },

    // use this for initialization
    onLoad: function () {

        //this._idx = cc.vv.hall.gameIndex;

        // this._wanfa = [];
        // var t = cc.find("body/grpWanfa", this.node);
        // var wanfaCount = t.childrenCount;
        // this.opTypeCount = wanfaCount;
        // for (var i = 0; i < wanfaCount; i++) {
        //     var n = t.children[i].getComponent("RadioButton");
        //     if (n != null) {
        //         this._wanfa.push(n);
        //     }
        // }

        // var body = this.node.getChildByName("body");
        
        // this._wanfaxuanze = [];
        // var wanfaTypes = body.getChildByName("wanfa");
        // for(var i = 0; i < wanfaTypes.childrenCount; ++i){
        //     this._wanfaxuanze[i] = [];
        //     var wanfa = wanfaTypes.children[i];//SZ
        //     for (var j = 0; j < wanfa.childrenCount; j++) {

        //         this._wanfaxuanze[i][j] = [];

        //         var uiTypeNode = wanfa.children[j];//radioButtonList、checkBoxList
        //         for (var k = 0; k < uiTypeNode.childrenCount; k++) {

        //             var boxScript = null;
        //             if (uiTypeNode.name == "radioButtonList") {
        //                 //j=0;
        //                 this._wanfaxuanze[i][j][k] = [];

        //                 var radioTypeNode = uiTypeNode.children[k];
        //                 for (var l = 0; l < radioTypeNode.childrenCount; l++) {
        //                     boxScript = radioTypeNode.children[l].getComponent("RadioButton");
        //                     if (boxScript != null) {
        //                         this._wanfaxuanze[i][j][k].push(boxScript);
        //                     }
                            
        //                 };
        //             }else {
        //                 //j=1;
        //                 boxScript = uiTypeNode.children[k].getComponent("CheckBox");
        //                 if (boxScript != null) {
        //                     this._wanfaxuanze[i][j].push(boxScript);
        //                 }
                        
        //             }
        //         };
        //     };
        // }
        
        // this._jushuxuanze = [];
        // var t = body.getChildByName("xuanzejushu");
        // this._xuanzejushuNode = t;
       
        // this._jushuNodeY = this._xuanzejushuNode.y;
        
        // for(var i = 0; i < t.childrenCount; ++i){
        //     var n = t.children[i].getComponent("RadioButton");
        //     if(n != null){
        //         this._jushuxuanze.push(n);
        //     }
        // }

        // this._jushuxuanze_PK = [];
        // this._xuanzejushuNode_PK = body.getChildByName("xuanzejushu_PK");
        // for(var i = 0; i < this._xuanzejushuNode_PK.childrenCount; ++i){
        //     var n = this._xuanzejushuNode_PK.children[i].getComponent("RadioButton");
        //     if(n != null){
        //         this._jushuxuanze_PK.push(n);
        //     }
        // }



        // this._renshuxuanze = [];
        // var pcNode = body.getChildByName("xuanzerenshu");
        // this._xuanzerenshuNode = pcNode;
        // for(var i = 0; i < pcNode.childrenCount; ++i){
        //     var playerRB = pcNode.children[i].getComponent("RadioButton");
        //     if(playerRB != null){
        //         this._renshuxuanze.push(playerRB);
        //     }
        // }


        // this.setShowReplaceOpenBtn();
        
        // var self = this;

        // this.showWanfa(this._idx);

        // this.node.on("rb-updated", function(event) {
        //     var id = event.detail.id;
        //     var groupId = event.detail.groupId;
                       
        //     if (groupId ===60 && id===2){
        //         self._xuanzejushuNode.y = self._xuanzerenshuNode.y;
        //         self._xuanzejushuNode_PK.y = self._xuanzerenshuNode.y;
        //         self._xuanzejushuNode_PK.active = true;
        //         self._xuanzejushuNode.active = false;
        //         self._xuanzerenshuNode.active = false;
        //     } else {
        //         self._xuanzejushuNode.y = self._jushuNodeY;
        //         self._xuanzerenshuNode.active = true;
        //         self._xuanzejushuNode_PK.active = false;
        //         self._xuanzejushuNode.active = true;
        //     }
            
        //     self.showWanfa(id);
        // });

        // this.node.on("cb-updated", function(event) {
        //     var id = event.detail.id;
        //     var checked = event.detail.checked;
        // });
    },

    isMask:function(tmpBool){
        
        if(this.node == undefined || this.node == null){
            return;
        }

        var body = this.node.getChildByName("body");
        var Mask = body.getChildByName('Mask');
        if(Mask !== undefined && Mask !== null){
            Mask.active = tmpBool;
        }       
       
    },

    onEnable:function(){
       
        this.isMask(false);

        this._idx = cc.vv.hall.gameIndex;

        this._wanfa = [];
        var t = cc.find("body/grpWanfa", this.node);
        var wanfaCount = t.childrenCount;
        this.opTypeCount = wanfaCount;
        for (var i = 0; i < wanfaCount; i++) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._wanfa.push(n);
            }
        }

        var body = this.node.getChildByName("body");
        
        this._wanfaxuanze = [];
        var wanfaTypes = body.getChildByName("wanfa");
        for(var i = 0; i < wanfaTypes.childrenCount; ++i){
            this._wanfaxuanze[i] = [];
            var wanfa = wanfaTypes.children[i];//SZ
            for (var j = 0; j < wanfa.childrenCount; j++) {

                this._wanfaxuanze[i][j] = [];

                var uiTypeNode = wanfa.children[j];//radioButtonList、checkBoxList
                for (var k = 0; k < uiTypeNode.childrenCount; k++) {

                    var boxScript = null;
                    if (uiTypeNode.name == "radioButtonList") {
                        //j=0;
                        this._wanfaxuanze[i][j][k] = [];

                        var radioTypeNode = uiTypeNode.children[k];
                        for (var l = 0; l < radioTypeNode.childrenCount; l++) {
                            boxScript = radioTypeNode.children[l].getComponent("RadioButton");
                            if (boxScript != null) {
                                this._wanfaxuanze[i][j][k].push(boxScript);
                            }
                            
                        };
                    }else {
                        //j=1;
                        boxScript = uiTypeNode.children[k].getComponent("CheckBox");
                        if (boxScript != null) {
                            this._wanfaxuanze[i][j].push(boxScript);
                        }
                        
                    }
                };
            };
        }
        
        this._jushuxuanze = [];
        var t = body.getChildByName("xuanzejushu");
        this._xuanzejushuNode = t;
       
        this._jushuNodeY = this._xuanzejushuNode.y;
        
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._jushuxuanze.push(n);
            }
        }

        this._jushuxuanze_PK = [];
        this._xuanzejushuNode_PK = body.getChildByName("xuanzejushu_PK");
        for(var i = 0; i < this._xuanzejushuNode_PK.childrenCount; ++i){
            var n = this._xuanzejushuNode_PK.children[i].getComponent("RadioButton");
            if(n != null){
                this._jushuxuanze_PK.push(n);
            }
        }



        this._renshuxuanze = [];
        var pcNode = body.getChildByName("xuanzerenshu");
        this._xuanzerenshuNode = pcNode;
        for(var i = 0; i < pcNode.childrenCount; ++i){
            var playerRB = pcNode.children[i].getComponent("RadioButton");
            if(playerRB != null){
                this._renshuxuanze.push(playerRB);
            }
        }
        // this.setShowReplaceOpenBtn();
        
        var self = this;

      //  console.log(this.defaultPlayData);

        if (this.defaultPlayData !== undefined) {
            if (this.defaultPlayData.opType == 1) {
                this._idx = 0;
            }
            if (this.defaultPlayData.opType == 2) {
                this._idx = 1;
            }
            if (this.defaultPlayData.opType == 10) {
                this._idx = 2;
            }
            if (this.defaultPlayData.opType == 4) {
                if(this.defaultPlayData.issj){
                    this._idx = 3;
                }else
                this._idx = 1;
            }
        }

        this.showWanfa(this._idx);

        this.node.on("rb-updated", function(event) {
            var id = event.detail.id;
            var groupId = event.detail.groupId;      
            if (groupId ===60 && id===2){
                self._xuanzejushuNode.y = self._xuanzerenshuNode.y;
                self._xuanzejushuNode_PK.y = self._xuanzerenshuNode.y;
                self._xuanzejushuNode_PK.active = true;
                self._xuanzejushuNode.active = false;
                self._xuanzerenshuNode.active = false;
            } else {

                self._xuanzejushuNode.y = self._jushuNodeY;
                self._xuanzerenshuNode.active = true;
                self._xuanzejushuNode_PK.active = false;
                self._xuanzejushuNode.active = true;
            }
            
            self.showWanfa(id);
        });

        // this.node.on("cb-updated", function(event) {
        //     var id = event.detail.id;
        //     var checked = event.detail.checked;
        // });
    },

    setShowReplaceOpenBtn: function () {

        if (cc.vv.userMgr && cc.vv.userMgr.lv == 1) {
            var body = this.node.getChildByName("body");
            var replaceOpenBtn = body.getChildByName("btn_proxyCreate");
            var seeOpenedBtn = body.getChildByName("btn_hasCreate");
            replaceOpenBtn.active = false;
            seeOpenedBtn.active = false;
            var openBtn = body.getChildByName("btn_ok");
            openBtn.x = 0;

        }

    },

    showWanfa: function(id) {
       // console.log('288',id);
        if (id == null || id < 0 || id >= this.opTypeCount) {
            return;
        }

        cc.log("showWanfa id = ", id);

        this._idx = id;
        if(id===2){
            this.node.getChildByName('body').getChildByName('xuanzerenshu').active=false;
            this.node.getChildByName('body').getChildByName('xuanzejushu').active=false;
            this.node.getChildByName('body').getChildByName('xuanzejushu_PK').active=true;
            this.node.getChildByName('body').getChildByName('label1').active=false;

        }else{
            this.node.getChildByName('body').getChildByName('xuanzerenshu').active=true;
            this.node.getChildByName('body').getChildByName('xuanzejushu').active=true;
            this.node.getChildByName('body').getChildByName('xuanzejushu_PK').active=false;
            this.node.getChildByName('body').getChildByName('label1').active=true;
        }
        var wanfaTypes = cc.find('body/wanfa', this.node);
        for (var i = 0; i < wanfaTypes.childrenCount; i++) {
            var child = wanfaTypes.children[i];
            child.active = i == id;  
             
        }
    },
    
    onBtnBack:function(){
        cc.vv.utils.showDialog(this.node, 'body', false);
    },

    onBtn_Opened: function () {
        var self = this;

        cc.vv.utils.showDialog(self.node, 'body', false);
        var tmpTV =  cc.vv.hall.node.getChildByName('OpenedRoomView').getComponent('OpenedRoomView');
        tmpTV.requestDaiKaiRooms();

        // var viewRecord = function (ret) {
        //     cc.log("viewRecord ret = ", ret);
        //     cc.vv.wc.hide();
        //     if(ret.errcode !== 0){
        //         cc.vv.alert.show("查看已开房间失败!");  
        //     }else {
        //         cc.vv.roomCfg.setOpendedRoomsData(ret.data);
        //         cc.vv.utils.showDialog(self.node, 'body', false);



        //         // var openRoomsView = cc.vv.prefabMgr.getPrefab("prefabs/OpenedRoomView");
        //         // var hallCanvas = cc.director.getScene().getChildByName('Canvas');
        //         // var openView = cc.instantiate(openRoomsView);
        //         // hallCanvas.addChild(openView);
        //         // cc.vv.hall.isClub=false;
        //     }
        // }

        // var data = {
        //     account:cc.vv.userMgr.account,
        //     sign:cc.vv.userMgr.sign,
        //     userid:cc.vv.userMgr.userId
        // };
        // cc.vv.wc.show(2);
        // cc.vv.http.sendRequest("/get_daikai_rooms", data, viewRecord);   

    },

    onBtn_other:function(event,customEventData){
        var self = this;

        cc.vv.audioMgr.playButtonClicked();
        this._customEventData = customEventData;

        var replaceCreateRoom = function () {
            cc.vv.hall.isClubRoom=false;
            self.createRoom();
        }

        cc.vv.alert.show("代开房间将预扣房卡，房间在第一局结算时扣除。提前解散不扣房卡，确定要代开房间么？", replaceCreateRoom, true);  
        
    },
    
    onBtnOK:function(event,customEventData){
       
        clearTimeout(this.TimeOutObj) ;
        var self = this;
        this.TimeOutObj = setTimeout(() => {
            self.isMask(false);
            event.target.getComponent(cc.Button).interactable = true;
            cc.vv.alert.show('网络不好，请再次点击！')

        }, 10000);
        
        this.isMask(true);
        event.target.getComponent(cc.Button).interactable = false;
               
        cc.vv.audioMgr.playButtonClicked();
        //cc.vv.utils.showDialog(this.node, 'body', false);
        this._customEventData = customEventData;
      //  console.log(event)
        this.createRoom();
    },

    joinRoom: function (roomId) {
        cc.vv.userMgr.enterRoom(roomId, function(ret) {
            if (ret.errcode == 0){
                cc.vv.utils.showDialog(this.node, 'body', false);
            }
            else {
                var content = "房间["+ roomId +"]不存在，请重新输入!";
                if(ret.errcode == 4){
                    content = "房间["+ roomId + "]已满!";
                }else if (ret.errcode == 5) {
                    content = "房主不能进入自己代开的房间！";
                }
                cc.vv.alert.show(content);
            }
        }.bind(this)); 
    },

    onCreateRoomResult: function (ret) {
        var self = this;
        var eventData = this._customEventData;

        clearTimeout(this.TimeOutObj);
        if(ret.errcode !== 0){ 
            this.isMask(false);
            var body = this.node.getChildByName("body");
            var openBtn = body.getChildByName("btn_ok");
            openBtn.getComponent(cc.Button).interactable = true;
           
        }


        if (eventData != "forOther"){
            if(ret.errcode === 0){
                cc.vv.net_hall.endInterval();
                cc.vv.net_hall.endSocket();
                cc.vv.net_hall.isPinging = false;

                if(cc.vv.gameNetMgr !== ''){
                    cc.vv.gameNetMgr.clearHandlers();
                    cc.vv.gameNetMgr = ''
                }        
        
                if(ret.game==='ddz'){
                    cc.vv.pkgameNetMgr.init();
                    cc.vv.pkgameNetMgr.initHandlers();
                    cc.vv.gameNetMgr = cc.vv.pkgameNetMgr
                }else{
                    cc.vv.mjgameNetMgr.init();
                    cc.vv.mjgameNetMgr.initHandlers();
                    cc.vv.gameNetMgr = cc.vv.mjgameNetMgr
                }
            }         
        }
     

        if(ret.errcode !== 0){
            cc.vv.wc.hide();

            if (ret.errcode == -102) {
                var content = "当前客户端版本过旧，请退出后重新登录！";
                cc.vv.alert.show(content,function(){
                    cc.game.end();
                });
                return;
            };

            //console.log(ret.errmsg);
            if(ret.errcode == 2222){
                if (eventData=="forOther") {
                    setTimeout(function () {
                        cc.vv.alert.show("房卡数不够，不能代开房间！");
                    }, 500);
                }else if (eventData=="forMy") {
                    cc.vv.alert.show("房卡不足，创建房间失败!"); 
                }
            }else if (ret.errcode == -1) {
                var tipRoom = function () {
                    self.joinRoom(ret.roomid);
                    //cc.vv.global.restartGame();

                }
                var content = "您还有正在进行的牌局，现在进入" + ret.roomid + "房间？";
                cc.vv.alert.show(content, tipRoom, true);
            }else {
                cc.vv.alert.show("创建房间失败,错误码:" + ret.errcode);
            }
        }
        else{
            if (eventData=="forMy") {
                cc.log("creater room ret = ", ret);
                if(ret.daikai==1){
                    var tipString = "为好友代开茶楼房间成功！\n" + "房间号：" + ret.roomid + "\n" + "预扣除：" + ret.cost + "张房卡";
                    cc.vv.alert.show(tipString);
                }
                if(!cc.vv.hall._isLv) {
                    cc.vv.utils.showDialog(this.node, 'body', false);//关闭创建房间界面
                    cc.vv.gameNetMgr.connectGameServer(ret);
                }
            }else if (eventData=="forOther") {
                cc.vv.wc.hide();
                var tipString = "为好友代开房间成功！\n" + "房间号：" + ret.roomid + "\n" + "预扣除：" + ret.cost + "张房卡";
                if (ret.own_card_num == null) {
                    cc.log("ret.own_card_num is null");
                    return;
                }
                cc.vv.hall.setGems(ret.own_card_num.gems);
                cc.vv.userMgr.gems = ret.own_card_num.gems;
                var replaceSuccess = function () {
                    self.onBtn_Opened();
                }
                setTimeout(function () {
                    cc.vv.alert.show(tipString, replaceSuccess, true, "replaceCreateRoom");
                }, 500);
                  
            }
        }
    },
    
    createRoom:function(){
        var self = this;
        var eventData = this._customEventData;
        var onCreate = function(ret){
            self.onCreateRoomResult(ret);
        };
        var jushuxuanze = 0;
        for(var i = 0; i < self._jushuxuanze.length; ++i){
            if(self._jushuxuanze[i].checked){
                jushuxuanze = i;
                break;
            }     
        }

        var jushuxuanze_PK = 0;
        for(let i=0;i<self._jushuxuanze_PK.length;++i){
            if(self._jushuxuanze_PK[i].checked){
                jushuxuanze_PK = i;
                break;
            }     

        }


        var renshuxuanze = 0;
        for(var i = 0; i < self._renshuxuanze.length; ++i){
            if(self._renshuxuanze[i].checked){
                renshuxuanze = i;
                break;
            }     
        }

        var id = this._idx;
        var wanfa = this._wanfaxuanze[id];

        var conf = {
            type: cc.vv.gameName,
            jushuxuanze:jushuxuanze, //局数
            nSeats:renshuxuanze,//选择人数
        }
        // var opType = 0;
        // for (var i = 0; i < self._wanfa.length; ++i) {
        //     if (self._wanfa[i].checked) {
        //         opType = i+1;
        //         // conf.opType=opType;
        //         break;
        //     }
        // }


        var tmpJushuxuanze = 0;
        if(id===2){
            tmpJushuxuanze = jushuxuanze_PK;
        } else{
            tmpJushuxuanze = jushuxuanze;
        }

        conf.jushuxuanze = tmpJushuxuanze;


        if(cc.vv.hall.isClubRoom){
            conf.clubid=cc.vv.hall._clubid;
        }

       
        var radioBtnList = wanfa[0];
        var radioFields = this.getWanfaRadioChoice(radioBtnList);
        var checkBoxList = wanfa[1];

        // if(opType === 3){
        //     conf.zha = checkBoxList[0].checked;//炸翻倍
        //  }

        if (id == 0) {
            conf.opType=1;
            //radioButton
            var hunCount = 3 - radioFields[0];//混数量选择
            var reset_count = this.getPiaoChoiceIndex(radioFields[1]);//漂方式选择

            //checkBox
            var daifeng = checkBoxList[0].checked;//带风
            var fangzuobi= false;//checkBoxList[1].checked;
            //parameter
            conf.hunCount = hunCount;
            conf.daifeng = daifeng;
            conf.reset_count = reset_count;
            conf.daihun = true;
            conf.paoType = true;
        }else if (id == 1) {
            // conf.opType=2;
            // //radioButton
            // var fengding = radioFields[0] + 1;//封顶选择
            // var reset_count = this.getPiaoChoiceIndex(radioFields[1]);//漂方式选择

            // //checkBox
            // var dianpaopei = checkBoxList[0].checked;//大包
            // var fangzuobi = false;//checkBoxList[1].checked;//gps

            // //parameter                                                                                                                                                                                                         
            // conf.fengding = fengding;
            // conf.dianpaopei = dianpaopei;
            // conf.reset_count = reset_count;
            // conf.daifeng = true;
            // conf.daihun = false;
            // conf.paoType = false;

            var fangzuobi  = false;

            conf.opType=4;
            conf.hzhg=false;
            conf.chi=false;
            conf.hupaiType=false;
            conf.baoting=false;
            conf.ypdx=true;
            conf.fanpai=-1;
            conf.quan=false;
            conf.paoType=false;
            conf.reset_count=1;
            conf.fenzhuang=false;
            conf.dpb3j=checkBoxList[2].checked;
            conf.daifeng=checkBoxList[1].checked;
            conf.daihun=checkBoxList[0].checked;
            conf.issj = true;

        }else if(id==2){
            //radioButton
            var fangzuobi  = false;
            conf.opType=10;
            conf.nSeats = 0;//人数选择
            //checkBox
            var daiti = checkBoxList[0].checked;
            conf.daiti=daiti;

        }else if(id===3){

            var fangzuobi  = false;
            conf.opType=4;
            conf.reset_count=4;
            conf.hzhg=false;
            conf.chi=false;
            conf.hupaiType=false;
            conf.baoting=false;
            conf.ypdx=true;
            conf.quan=false;
            conf.fenzhuang=false;
            conf.pinghu=!checkBoxList[4].checked;
            conf.dpb3j=checkBoxList[3].checked;
            conf.daifeng=checkBoxList[2].checked;
            conf.paoType=checkBoxList[1].checked;
            conf.daihun=checkBoxList[0].checked;
            
            conf.fanpai = this.getNiaoChoiceIndex(radioFields[0]);//抓鸟方式选择
            conf.issj = false;
        }

        
        conf.fangzuobi=fangzuobi;
        if (eventData=="forOther") {
            conf.daikai = 1;
        }
        
        var data = {
            client_version: cc.client_version,
            location:cc.vv.GPSMgr.getLocation(),
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            conf:JSON.stringify(conf)
        };
        if(conf.daikai!=1 && conf.fangzuobi){
            var chk=cc.vv.GPSMgr.chkGps();
            if(!chk){
                return;
            }

            console.log('luobin-gps','creatRoom','data.location:',data.location);
            if(data.location){

                var p = JSON.parse(data.location);
                console.log('luobin-gps','creatRoom','data.location:',data.location);
                if(p.latitude==null || p.longitude==null){

                    var locateAccurate=function(){
                        self.gpsChkFlag = 5;
                        cc.vv.alert.close();
                        cc.vv.wc.show(3);
                        var errorWillCheck = true;
                        cc.vv.GPSMgr.locateAccurate(errorWillCheck);
                    };
                    cc.vv.alert.show("没有GPS定位数据!请定位", locateAccurate, true);
                    return;
                }
            }
        }
       // console.log(data);
        // cc.vv.wc.show(2);
        // cc.vv.http.sendRequest("/create_private_room",data,onCreate);   

        if (this.defaultPlayData != null && this.defaultPlayData.clubId != null && this.defaultPlayData.clubId > 0) {
            data.clubid = this.defaultPlayData.clubId;
            data.type = 'clubAuto';
            data.optype = conf.opType;
            this.clubSureDefaultPlay(data);
        } else {
            //cc.vv.wc.show(2);
            //cc.vv.alert.show('正在进入房间，请稍候....');/防止两次点击

            if(cc.vv.hallreconnect != undefined && cc.vv.hallreconnect != null){
                cc.vv.hallreconnect.cleanTimeout();
                cc.vv.net_hall.endInterval();
            }

            cc.vv.http.sendRequest("/create_private_room", data, onCreate);
        }

    },

    getWanfaRadioChoice: function (radioBtnList) {
        var radioFields = [];
        for (var i = 0; i < radioBtnList.length; i++) {
            var radioChoiceList = radioBtnList[i];
            for (var j = 0; j < radioChoiceList.length; j++) {
                if(radioChoiceList[j].checked){
                    radioFields.push(j);
                }  
            };
        };

        return radioFields;
    },

    getPiaoChoiceIndex: function (radioIndex) {
        var choiceIndex = 4;
        switch (radioIndex) {
            case 0:
                choiceIndex = 4;
                break;
            case 1:
                choiceIndex = 1;
                break;
        }
        return choiceIndex;
    },


    getNiaoChoiceIndex: function (radioIndex) { //3
        var choiceIndex = 4;
        switch (radioIndex) {
            case 0:
                choiceIndex = 0;
                break;
            case 1:
                choiceIndex = 2;
                break;
            case 2:
                choiceIndex = 4;
                break;
            case 3:
                choiceIndex = 6;
                break;
        }
        return choiceIndex;
    },
    ////////////////////////////
    //茶楼默认玩法

    showView: function (isShow) {
        this.node.active = isShow;
    },

    init: function (data) {
        this.defaultPlayData = data;
        this.showView(true);
    },

    start: function () {

        this.onEnable();

        var isClubDefault = false;

        //默认玩法(根据实际工程玩法自己改动)
        if (this.defaultPlayData != null && this.defaultPlayData.clubId != null && this.defaultPlayData.clubId > 0) {
            this.setDefaultPlayView();

            isClubDefault = true;
        }

        this.initView(isClubDefault);

        if (isClubDefault == false) {
            this.setShowReplaceOpenBtn();
        }
    },

    setDefaultPlayView: function () {
        var opType = this.defaultPlayData.opType;
        var tmpOptype = 0;
        if(opType == 10){
            tmpOptype =4;
        }else if (opType == 4) {
            if(this.defaultPlayData.issj)
            tmpOptype = 3;
            else 
            tmpOptype = 1;
        }else{
            tmpOptype = opType
        }           
        
       // console.log(this._wanfa)
        this._wanfa[tmpOptype - 1].onClicked();

        var isquan = false;
        if (this.defaultPlayData.quan) {
            isquan = this.defaultPlayData.quan;
        }
        var countIndex = this.getDefaultCountIndex(isquan, this.defaultPlayData.maxGames);
        var playerIndex = this.getDefaultPlayerIndex(this.defaultPlayData.nSeats);


        var radioBtnList = this._wanfaxuanze[this._idx][0];
        var checkBoxList = this._wanfaxuanze[this._idx][1];
        if (this._idx == 0) {

            if (this._jushuxuanze[countIndex].checked == false) {
                this._jushuxuanze[countIndex].onClicked();
            }

            if (this._renshuxuanze[playerIndex].checked == false) {
                this._renshuxuanze[playerIndex].onClicked();
            }

            var hunCount = this.defaultPlayData.hunCount; //混数量选择
            if (radioBtnList[0][3-hunCount].checked == false) {
                radioBtnList[0][3-hunCount].onClicked();
            }

            var reset_count = this.defaultPlayData.reset_count;//漂方式选择

            if(reset_count === 4){
                reset_count = 0
            }else{
                reset_count = 1
            }

            if (radioBtnList[1][reset_count].checked == false) {
                radioBtnList[1][reset_count].onClicked();
            }

            //var daifeng = checkBoxList[0].checked;//带风
            if (checkBoxList[0].checked != this.defaultPlayData.daifeng) {
                checkBoxList[0].onClicked();
            }

        } else if (this._idx == 1) {
            // if (this._jushuxuanze[countIndex].checked == false) {
            //     this._jushuxuanze[countIndex].onClicked();
            // }

            // if (this._renshuxuanze[playerIndex].checked == false) {
            //     this._renshuxuanze[playerIndex].onClicked();
            // }

            // var fengding = this.defaultPlayData.fengding; //封顶选择
            // if (radioBtnList[0][fengding-1].checked == false) {
            //     radioBtnList[0][fengding-1].onClicked();
            // }

            // var reset_count = this.defaultPlayData.reset_count;//漂方式选择

            // if(reset_count === 4){
            //     reset_count = 0
            // }else{
            //     reset_count = 1
            // }
            // if (radioBtnList[1][reset_count].checked == false) {
            //     radioBtnList[1][reset_count].onClicked();
            // }

            // //var dianpaopei = checkBoxList[0].checked;//大包
            // if (checkBoxList[0].checked != this.defaultPlayData.dianpaopei) {
            //     checkBoxList[0].onClicked();
            // }

            if (this._jushuxuanze[countIndex].checked == false) {
                this._jushuxuanze[countIndex].onClicked();
            }

            if (this._renshuxuanze[playerIndex].checked == false) {
                this._renshuxuanze[playerIndex].onClicked();
            }


           
            if (checkBoxList[0].checked != this.defaultPlayData.daihun) {
                checkBoxList[0].onClicked();
            }

            if (checkBoxList[1].checked != this.defaultPlayData.daifeng) {
                checkBoxList[1].onClicked();
            }

            if (checkBoxList[2].checked != this.defaultPlayData.dpb3j) {
                checkBoxList[2].onClicked();
            }

        } else if (this._idx == 3) {

            if (this._jushuxuanze[countIndex].checked == false) {
                this._jushuxuanze[countIndex].onClicked();
            }

            if (this._renshuxuanze[playerIndex].checked == false) {
                this._renshuxuanze[playerIndex].onClicked();
            }

            // conf.dahu=checkBoxList[4].checked;
            // conf.dpb3j=checkBoxList[3].checked;
            // conf.daifeng=checkBoxList[2].checked;
            // conf.paoType=checkBoxList[1].checked;
            // conf.daihun=checkBoxList[0].checked;
            
            // conf.fanpai = this.getNiaoChoiceIndex(radioFields[0]);//抓鸟方式选择
            
            if (checkBoxList[0].checked != this.defaultPlayData.daihun) {
                checkBoxList[0].onClicked();
            }

            if (checkBoxList[1].checked != this.defaultPlayData.paoType) {
                checkBoxList[1].onClicked();
            }

            if (checkBoxList[2].checked != this.defaultPlayData.daifeng) {
                checkBoxList[2].onClicked();
            }

            if (checkBoxList[3].checked != this.defaultPlayData.dpb3j) {
                checkBoxList[3].onClicked();
            }

            if (checkBoxList[4].checked != !this.defaultPlayData.pinghu) {
                checkBoxList[4].onClicked();
            }
           
            var fanpai = this.defaultPlayData.fanpai
            var niaoIndex = 0;
            if(fanpai == 2){
                niaoIndex = 1;
            }else if(fanpai == 4){
                niaoIndex = 2;
            }else if(fanpai == 6){
                niaoIndex = 3;
            }
            if (radioBtnList[0][niaoIndex].checked == false) {
                radioBtnList[0][niaoIndex].onClicked();
            }

        }  else if (this._idx == 2) {

            if (this._jushuxuanze_PK[countIndex].checked == false) {
                this._jushuxuanze_PK[countIndex].onClicked();
            }


            if (checkBoxList[0].checked != this.defaultPlayData.daiti) {
                checkBoxList[0].onClicked();
            }

        }

        //桌子修改玩法
        if (this.defaultPlayData.playKey != null) {
            this.grayOpType();//确定那个按钮显示
        }
    },

    getDefaultCountIndex: function (isquan, gameCount) {
        var index = 0;
        if (isquan == true && gameCount == 2) {
            index = 3;
        } else if (isquan == true && gameCount == 4) {
            index = 4;
        } else if (isquan == true && gameCount == 8) {
            index = 5;
        } else if (gameCount == 4) {
            index = 0;
        } else if (gameCount == 8) {
            index = 1;
        } else if (gameCount == 12) {
            index = 2;
        }

        if (this.defaultPlayData != undefined){
            if(this.defaultPlayData.opType == 10){

                if (gameCount == 10){
                    index = 0;
                }else if(gameCount == 20){
                    index = 1;
                }                
            } 
        }

        return index;
    },

    getDefaultPlayerIndex: function (playerCount) {
        var index = 0;
        if (playerCount == 2) {
            index = 0;
        } else if (playerCount == 3) {
            index = 1;
        } else if (playerCount == 4) {
            index = 2;
        } else if (playerCount == 5) {
            index = 3;
        } else if (playerCount == 6) {
            index = 4;
        }

        return index;
    },

    initView: function (isClub) {

        var body = this.node.getChildByName("body");
        var replaceOpenBtn = body.getChildByName("btn_proxyCreate");
        var seeOpenedBtn = body.getChildByName("btn_hasCreate");
        var openBtn = body.getChildByName("btn_ok");

        var sureBtn = body.getChildByName("btnSure");

        replaceOpenBtn.active = !isClub;
        seeOpenedBtn.active = !isClub;
        openBtn.active = !isClub;
        sureBtn.active = isClub;

        if (isClub == true && this.defaultPlayData.playKey != null && this.defaultPlayData.playKey == "see") {
            sureBtn.active = false;
        } else {
            sureBtn.active = isClub;
        }

        // var clubBg = body.getChildByName("club_logo");
        // var clubName = body.getChildByName("club_name");

        var nameString = "";
        if (isClub == true) {
            nameString = this.defaultPlayData.clubName;
        }

        // clubBg.active = isClub;
        // clubName.active = isClub;
        //clubName.getComponent("cc.Label").string = nameString;

    },

    clubSureDefaultPlay: function (playData) {
        cc.vv.audioMgr.playButtonClicked();


        if(cc.vv.clubview.viewData.clubsInfo == null || cc.vv.clubview.viewData.clubsInfo == undefined){
            return;
        }

        playData.account = cc.vv.userMgr.account;
        playData.sign = cc.vv.userMgr.sign;

        var tmpObj = cc.vv.clubview.viewData.clubsInfo.clubInfo.defaultConf;
        if (tmpObj === undefined) {
            var gamePlayData = {};
        } else {
            var gamePlayData = tmpObj
            gamePlayData.opType = parseInt(gamePlayData.opType)
        }


        var NewPlayData = cc.vv.global.deepCopy(JSON.parse(playData.conf))
        NewPlayData.clubid = this.defaultPlayData.clubId;
        NewPlayData.clubId = this.defaultPlayData.clubId;
        NewPlayData.clubName = this.defaultPlayData.clubName;

        NewPlayData = cc.vv.clubview.getChangeConf(NewPlayData)

      //  console.log(cc.vv.global.diff(NewPlayData, gamePlayData))
        var isChang = cc.vv.global.diff(NewPlayData, gamePlayData);

        //数据变动才会发送请求
        if (!isChang) {

            
            if (this.defaultPlayData.playKey != null && this.defaultPlayData.playKey == "change") {

                var tmpObj = {
                    roomid: this.defaultPlayData.roomId,
                    NewConf: playData.conf,
                    clubid: this.defaultPlayData.clubId,
                }

             //   cc.log("wujun tmpObj = ", tmpObj);

                //cc.vv.clubview.changeTableData(tmpObj);//以后改为用socket触发，需要修改


                //牌桌的修改玩法
                cc.vv.userMgr.setTableGamePlay(tmpObj, function (ret) {

                    if (ret.errcode == 0) {
                        clearTimeout(this.TimeOutObj)
                        var content = "设置牌桌默认玩法成功!";
                        cc.vv.alert.show(content);
                        this.node.destroy();

                        //直接进入房间
                        console.log('直接进入房间')
                        cc.vv.userMgr.enterRoom(this.defaultPlayData.roomId)

                    } else {

                        var content = "";
                        if (ret.errmsg == "ok") {
                           content = "设置牌桌默认玩法失败!"; 
                        }else {
                            content = ret.errmsg;//"设置牌桌默认玩法失败!";
                        }
                        
                        cc.vv.alert.show(content);
                    }

                }.bind(this));

            } else {
               
                cc.vv.clubview.isModifyDefaultWanfa = true; //通知正在修改默认玩法，不进行界面刷新
               
                cc.vv.userMgr.setClubGamePlay(playData, function (ret) {

                    if (ret.errcode == 0) {
                        clearTimeout(this.TimeOutObj)
                        //gamePlayData = ret.data;

                        setTimeout(() => {
                            var content = "设置默认玩法成功!";
                            cc.vv.alert.show(content,function(){
                                console.log('已经点击')
                                cc.vv.clubview.isModifyDefaultWanfa = false; //通知正在修改默认玩法，不进行界面刷新
                                //刷新界面
                                cc.vv.clubview.TableSort();
                                cc.vv.clubview.setCenter();
       
                            });
                            this.node.destroy();
                        }, 1000);
                       
                        cc.vv.clubview.setCleatTimeObj()



                    } else {
                        var content = "设置默认玩法失败!";
                        cc.vv.alert.show(content);
                    }

                }.bind(this));
            }


        } else this.node.destroy();

    },

    /// 桌子查看、修改玩法 ///

    grayOpType: function () {
        var opType = this.defaultPlayData.opType;
        var tmpOptype = 0;
        if(opType == 10){
            tmpOptype =4;
        }else if (opType == 4) {
            if(this.defaultPlayData.issj)
            tmpOptype = 3;
            else 
            tmpOptype = 1;
        }else{
            tmpOptype = opType
        }        

        var choosePlayNode = cc.find("body/grpWanfa", this.node);
        var playCount = choosePlayNode.childrenCount;




        for (var i = 0; i < playCount; i++) {
            if (i != (tmpOptype - 1)) {
                var playBtn = choosePlayNode.children[i].getComponent("cc.Button")
                playBtn.enableAutoGrayEffect = true;
                playBtn.interactable = false;
            }
        };
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
