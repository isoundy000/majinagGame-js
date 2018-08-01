cc.Class({
    extends: cc.Component,

    properties: {
        lblName: cc.Label,
        lblGems: cc.Label,
        lblID: cc.Label,
        lblNotice: cc.Label,
        joinGameWin: cc.Node,
        createRoomWin: cc.Node,
        settingsWin: cc.Node,
        helpWin: cc.Node,
        sprHeadImg: cc.Node,

        shopWin: cc.Node,

        cell: cc.Node,
        cardScrollView: cc.ScrollView,
        lblVersion: cc.Label,
        btnCreateGame: cc.Button,
        btnJoinGame: cc.Node,
        btnReturnGame: cc.Node,
        btnKaiFangButton : cc.Button,
        shopSupportLbl: cc.Label,
        bannerWXLbl: cc.Label,
        _isAlert: false,
        club: {
            default: null,
            type: cc.Prefab
        },
        isClubRoom: false,
        _clubid: null,
        _clubname: false,
        isClub: false,
        redPacketFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        _isLv: false,
        _isClub: false,
        _createBtn: [],


        btnClub:cc.Button,
        btnClubBlack:cc.Node,
        clubPrefab: {
            default: null,
            type: cc.Prefab
        },
        clubPromptPrefab: {
            default: null,
            type: cc.Prefab
        }

    },

    initNetHandlers: function () {
        var self = this;

        // if (cc.vv.global.clubTempData.clubNotify !== undefined) {
        //     this.showRedPoint(true);
        // }

        cc.vv.hallgameNetMgr.dataEventHandler = this.node;
    },
    hasRedPacket: function () {
        /*
        cc.vv.userMgr.getActivity(function (data) {
            if (!data) {
                return
            }
            if(data.status==1){
              cc.find("Canvas/top_left/redpacket").active=false;
              cc.find("Canvas/top_left/redpacket1").active=true;

            }

        });
        var needLoadActivity = cc.sys.localStorage.getItem('needLoadActivity');
        if(needLoadActivity == 1){
            this.onShare(null,1);
            cc.sys.localStorage.setItem('needLoadActivity',0);
        }
        */
    },
    onShare: function (event, customEventData) {
        var share = this.node.getChildByName('HouseCard');
        var btnCard = share.getChildByName("body").getChildByName("btnCard").getComponent("RadioButton");
        var btnRed = share.getChildByName("body").getChildByName("btnRed").getComponent("RadioButton");
        cc.vv.utils.showDialog(share, 'body', true);
        if (customEventData == 0) {
            this.setupReceiveCard(1);
            btnCard.onClicked();
        } else {
            this.setupReceiveCard(2);
            btnRed.onClicked();
        }
        cc.vv.audioMgr.playButtonClicked();
        var self = this;

        cc.vv.userMgr.getAchieveLogs(function (data) {
            if (!data) {
                return
            }

            var receiveCardL = cc.find('HouseCard/body/cardNode/receiveNode/receiveCardL', self.node).getComponent(cc.Label)
            receiveCardL.string = data.card_num
            var receiveCardBtn = cc.find("HouseCard/body/cardNode/receiveNode/receiveCardBtn", self.node).getComponent(cc.Button)
            if (parseInt(data.card_num) > 0) {
                receiveCardBtn.interactable = true
            }
            else {
                receiveCardBtn.interactable = false
            }

            self.userNum = data.user_num
            self.canReceiveNum = data.card_num
            self.cardArr = data.data
            self.setupRecording(data.data)
        })
    },

    setupRecording: function (data) {
        if (data.length) {
            this.cardScrollView.content.removeAllChildren()
            for (var i = 0; i < data.length; i++) {
                var recording = data[i]
                var cloneItem = cc.instantiate(this.cell)
                var contentL = cloneItem.getChildByName("content").getComponent(cc.Label)
                cloneItem.x = 0
                cloneItem.y = -30 * i
                this.cardScrollView.content.addChild(cloneItem)

                if (recording.time.toString().length == 13) {
                    var date = new Date(recording.time)
                }
                else {
                    var date = new Date(recording.time * 1000)
                }
                var year = date.getFullYear()
                var month = (date.getMonth() + 1).toString()
                var day = (date.getDate()).toString()
                var hour = (date.getHours()).toString()
                var minute = (date.getMinutes()).toString()
                if (month.length == 1) {
                    month = "0" + month
                }
                if (day.length == 1) {
                    day = "0" + day
                }
                if (hour.length == 1) {
                    hour = "0" + hour
                }
                if (minute.length == 1) {
                    minute = "0" + minute
                }
                var timeStr = year + "-" + month + "-" + day + " " + hour + ":" + minute
                contentL.string = timeStr + " 您领取了" + recording.num + "张房卡"
            }
            this.cardScrollView.content.setContentSize(cc.size(this.cardScrollView.node.width, 30 * data.length))
        }
    },

    onBtnReceiveClicked: function () {
        var self = this
        cc.vv.userMgr.getAchieveCard(self.userNum, function (data) {
            if (!data) {
                var receiveSuccessL = cc.find('HouseCard/body/cardNode/receiveNode/receiveSuccess', self.node)
                receiveSuccessL.active = true
                receiveSuccessL.getComponent("cc.Label").string = "领取失败,请稍后再试"

                var hideFun = function () {
                    var receiveSuccessL = cc.find('HouseCard/body/cardNode/receiveNode/receiveSuccess', self.node)
                    receiveSuccessL.active = false
                }
                setTimeout(hideFun, 1000);
                return
            }
            // 刷新元宝界面
            var receiveSuccessL = cc.find('HouseCard/body/cardNode/receiveNode/receiveSuccess', self.node)
            receiveSuccessL.active = true
            receiveSuccessL.getComponent("cc.Label").string = "领取成功";

            self.lblGems.string = data.own_card_num.gems//parseInt(data.real_card_num) + parseInt(self.lblGems.string)
            cc.vv.userMgr.gems = data.own_card_num.gems;

            var hideFun = function () {
                var receiveSuccessL = cc.find('HouseCard/body/cardNode/receiveNode/receiveSuccess', self.node)
                receiveSuccessL.active = false
            }
            setTimeout(hideFun, 1000);

            var receiveCardL = cc.find('HouseCard/body/cardNode/receiveNode/receiveCardL', self.node).getComponent(cc.Label)
            receiveCardL.string = "0"

            var receiveCardBtn = cc.find("HouseCard/body/cardNode/receiveNode/receiveCardBtn", self.node).getComponent(cc.Button)
            receiveCardBtn.interactable = false
            //刷新scrollview
            var timestamp = new Date().getTime()
            var data = {
                time: timestamp,
                num: self.canReceiveNum
            }
            self.cardArr.splice(0, 0, data);
            self.setupRecording(self.cardArr)
        })
    },

    onShareClose: function () {
        var share = this.node.getChildByName('HouseCard');

        cc.vv.audioMgr.playButtonClicked();
        cc.vv.utils.showDialog(share, 'body', false);
    },

    share: function (timeLine) {
        cc.vv.audioMgr.playButtonClicked();

        setTimeout(function () {
            cc.vv.anysdkMgr.share("国耀棋牌", "国耀棋牌，简单有趣，操作便捷，画面精美。", timeLine);
        }, 100);
    },

    onShareWeChat: function () {
        this.share();
    },

    onShareTimeLine: function () {
        this.share(true);
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.hall = this;
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }

        if (!cc.vv) {
            console.log('load loading');
            cc.director.loadScene("loading");
            return;
        }

        var content = this.node.getChildByName("gameScroll").getComponent(cc.ScrollView).content;
        // this.initCreateBtn();
        if (cc.vv.userMgr.returnRoomId == null) {
            this.btnJoinGame.active = true;
            this.btnReturnGame.active = false;
            this.btnCreateGame.interactable = true;
            this.btnClub.interactable = true;
            this.btnClubBlack.active = false;
            this.btnKaiFangButton.interactable = true;

            content.getChildByName('item1').getChildByName('btnClub').getComponent(cc.Button).interactable=true;
            content.getChildByName('item2').getChildByName('btnKoudajiang').getComponent(cc.Button).interactable=true;
            content.getChildByName('item3').getChildByName('btndoudizhu').getComponent(cc.Button).interactable=true;
            content.getChildByName('item3').getChildByName('btntuidaohu').getComponent(cc.Button).interactable=true;
            content.getChildByName('item4').getChildByName('btndaohongsan').getComponent(cc.Button).interactable=true;
            content.getChildByName('item4').getChildByName('btnyixian').getComponent(cc.Button).interactable=true;

        }
        else {
            this.btnJoinGame.active = false;
            this.btnReturnGame.active = true;
            this.btnCreateGame.interactable = false;
            this.btnClub.interactable = false;
            this.btnClubBlack.active = true;
            this.btnKaiFangButton.interactable = false;


            content.getChildByName('item1').getChildByName('btnClub').getComponent(cc.Button).interactable=false;
            content.getChildByName('item2').getChildByName('btnKoudajiang').getComponent(cc.Button).interactable=false;
            content.getChildByName('item3').getChildByName('btndoudizhu').getComponent(cc.Button).interactable=false;
            content.getChildByName('item3').getChildByName('btntuidaohu').getComponent(cc.Button).interactable=false;
            content.getChildByName('item4').getChildByName('btndaohongsan').getComponent(cc.Button).interactable=false;
            content.getChildByName('item4').getChildByName('btnyixian').getComponent(cc.Button).interactable=false;
        }

        this.addComponent("hallReConnect")//
        this.initLabels();

        var imgLoader = this.sprHeadImg.getComponent("ImageLoader");
        imgLoader.setUserID(cc.vv.userMgr.userId);

        this.initButtonHandler("Canvas/bottom_right/btn_shezhi");
        this.initButtonHandler("Canvas/top_right/btn_help");
        this.initButtonHandler("Canvas/bottom_right/btn_zhanji");
        // this.initButtonHandler("Canvas/bottom_right/btn_buy");

        if (!cc.vv.userMgr.notice) {
            cc.vv.userMgr.notice = {
                version: cc.VERSION,
                msg: "数据请求中...",
            }
        }

        if (!cc.vv.userMgr.agent) {
            cc.vv.userMgr.agent = {
                version: cc.VERSION,
                msg: "hallceshikefu",
            }
        }

        this.lblNotice.string = cc.vv.userMgr.notice.msg;

        this.refreshInfo();
        this.refreshMessage("notice");
        

        cc.vv.audioMgr.playBGM("bgMain.mp3");
        // cc.vv.audioMgr.playBackGround();

        var self = this
        this.node.on("rb-updated", function (event) {
            var index = event.detail.id;
            self.setupReceiveCard(index);
        });

        this.androidBackEvent();

        if (cc.mjVersion && cc.mjVersion.length) {
            this.lblVersion.string = cc.mjVersion
        }

        cc.vv.userMgr.boolOtherReply = false;

        if(cc.vv.global._space == 'hallClub'){
            this.onBtnClubClickedCaLou();
        }else  if(cc.vv.global._space == 'hallDaiKai'){
            this.onBtn_Opened();
        } else {
           cc.vv.global._space = 'hall'
        }

        if (cc.vv.global._space != 'hallClub') {
            this.addClubView();
            this.clubView = null;
        }

        var clubPrompt = cc.instantiate(this.clubPromptPrefab);
        this.node.addChild(clubPrompt);

        this.initNetHandlers();

        cc.vv.hallgameNetMgr.createHallSocket();
             
      
       
        // cc.game.on(cc.game.EVENT_HIDE, function () {
        //     console.log("over hall Socket");
        //     this.overSocket();
        // });
        // cc.game.on(cc.game.EVENT_SHOW, function () {
        //     console.log("cc.audioEngine.resumeAll");
        //     cc.audioEngine.resumeAll();
        // });


        //    if(cc.vv.global.isFormGame){
        //     this.refreshInfo_socket();
        //     cc.vv.global.isFormGame = false;
        //    }
       


    },

    // overSocket:function(){
        
        
    //     cc.vv.net_hall.endSocket();        

    // },


    // startSocket:function(){


    // },
    

    initCreateBtn: function () {
        var content = this.node.getChildByName("gameScroll").getComponent(cc.ScrollView).content;
       // console.log('289', content.childrenCount);
        for (let i = 0; i < content.childrenCount; ++i) {
            for (let j = 0; i < content.children[i].childrenCount; ++j) {
                if (j !== 2) {
                    this._createBtn.push(content.children[i].children[j]);
                }
            }
        }
    },
    greayCreatebtn: function (ishow) {
        for (let i = 0; i < this._createBtn.length; ++i) {
            this._createBtn[i].getComponent(cc.Button).interactable = ishow;
        }
    },
    setupReceiveCard: function (index) {
        var cardNode = cc.find('HouseCard/body/cardNode', this.node);
        var redNode = cc.find("HouseCard/body/redNode", this.node);
        var bodyPath = "textures/red_packet/";
        var sprite = cc.find("HouseCard/body", this.node).getComponent(cc.Sprite);
        if (index == 1) {
            cardNode.active = true
            redNode.active = false;
            // bodyPath += "share_gems";
        } else {
            cardNode.active = false;
            redNode.active = true;
            // bodyPath+="red_packet_bg";
        }
        cc.vv.redpacket.getActivityInfo();

        // cc.vv.utils.createSpriteFrame({path: bodyPath}, function (sp) {
        //     sprite.spriteFrame = sp;
        // }.bind(this));
    },

    start: function () {
        var roomId = cc.vv.userMgr.oldRoomId;
        if (roomId != null && cc.vv.userMgr.returnRoomId == null) {
            cc.vv.userMgr.oldRoomId = null;
            cc.vv.userMgr.enterRoom(roomId);
        }
        // this.initCreateBtn();
        // var people = cc.find('Canvas/bottom_left/people');
        // people.x = -598;
        // people.runAction(cc.moveTo(0.5, cc.p(0, 0)));

        // var btnCreate = cc.find('Canvas/btnCreateRoom');
        // btnCreate.x += 600;
        // btnCreate.runAction(cc.moveTo(0.5, cc.p(385, 77)));

        // var btnJoin = cc.find('Canvas/btnJoinRoom');
        // btnJoin.x += 600;
        // btnJoin.runAction(cc.moveTo(0.5, cc.p(300, -160)));

        // var logo = cc.find('Canvas/bottom_left/logo');
        // logo.opacity = 0;
        // logo.runAction(cc.fadeTo(0.8, 255));

        // var br = cc.find('Canvas/bottom_right');
        // br.opacity = 0;
        // br.runAction(cc.fadeTo(0.8, 255));

        // var tr = cc.find('Canvas/top_right');
        // tr.opacity = 0;
        // tr.runAction(cc.fadeTo(0.8, 255));

        // var tl = cc.find('Canvas/top_left');
        // tl.opacity = 0;
        // tl.runAction(cc.fadeTo(0.8, 255));
        // var club_btn=cc.find("Canvas/btnClub");
        // club_btn.x-=100;
        // club_btn.runAction(cc.moveTo(0.5,cc.p(-594,-50)));

        this.hasRedPacket();
    },


    refreshInfo: function () {
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
               // console.log(ret.errmsg);
            }
            else {
                if (ret.gems != null) {
                    this.lblGems.string = ret.gems;
                }
                
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_user_status", data, onGet.bind(this));
    },

    refreshMessage: function (type) {
        // var messageType = ["notice", "agent"];

        var onGet = function (ret) {
           // cc.log("refreshMessage ret = ", ret);
            if (ret.errcode !== 0) {
               // console.log(ret.errmsg);
            }
            else {
                this.refreshMessageUI(ret);
            }
        };

        // for (var i = 0; i < 2; i++) {
        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            type: type,//messageType[i],
            version: cc.VERSION
        };
        cc.vv.http.sendRequest("/get_message", data, onGet.bind(this));
        // };
    },

    refreshMessageUI: function (data) {
        switch (data.type) {
            case "notice":
                cc.vv.userMgr.notice.version = data.version;
                cc.vv.userMgr.notice.msg = data.msg;
                this.lblNotice.string = data.msg;
                break;
            case "agent":
                cc.vv.userMgr.agent.version = data.version;
                cc.vv.userMgr.agent.msg = data.msg;
                this.shopSupportLbl.string = "代理咨询请联系微信号: " + data.msg;
                this.bannerWXLbl.string = data.msg;
                break;
        }
    },

    initButtonHandler: function (btnPath) {
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn, this.node, "Hall", "onBtnClicked");
    },

    initLabels: function () {
        this.lblName.string = cc.vv.userMgr.userName;
        this.lblGems.string = cc.vv.userMgr.gems;
        this.lblID.string = "ID:" + cc.vv.userMgr.userId;
    },

    onSettingsClose: function () {
        cc.vv.utils.showDialog(this.settingsWin, 'body', false);
    },

    onBtnClicked: function (event) {
        cc.vv.audioMgr.playButtonClicked();

        var name = event.target.name;

        if (name == "btn_shezhi") {
            cc.vv.utils.showDialog(this.settingsWin, 'body', true);
        } else if (name == "btn_help") {
            // cc.vv.utils.showFrame(this.helpWin, 'head', 'body', true);
            cc.vv.utils.showDialog(this.helpWin, 'body', true);
        } else if (name == 'btn_buy') {
            // cc.vv.utils.showFrame(this.shopWin, 'head', 'body', true);
            cc.vv.utils.showDialog(this.shopWin, 'body', true);
        }
    },

    onJoinGameClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        cc.vv.userMgr.boolReplyJoinGame = false;
        this._isClub = false;
        cc.vv.utils.showDialog(this.joinGameWin, 'panel', true);
    },

    onReturnGameClicked: function (event) {
       
        event.target.getComponent(cc.Button).interactable = false;

        var tmpObj = setTimeout(() => {
            event.target.getComponent(cc.Button).interactable = true;
            cc.vv.alert.show('网络不好，请再次点击！')

        }, 10000);


        cc.vv.net_hall.endInterval();
        cc.vv.net_hall.endSocket()
        if (cc.vv && cc.vv.userMgr.returnRoomId != null) {
            cc.vv.userMgr.enterRoom(cc.vv.userMgr.returnRoomId, function (ret) {
               
                clearTimeout(tmpObj)

                if(ret.errcode !== 0){
                    event.target.getComponent(cc.Button).interactable = true;
                }
                
                if (ret.errcode == 3) {
                    cc.vv.userMgr.returnRoomId = null;
                    cc.director.loadScene("hall")

                }
            });
        }
    },

    // onReturnGameClicked: function () {
    //     if (cc.vv.net_hall.sio && cc.vv.net_hall.sio.connected == true) {
    //         cc.vv.SelectRoom.setScence();
    //         //cc.director.loadScene("mjgame");
    //     } else {
    //         if (cc.vv && cc.vv.userMgr.returnRoomId != null) {
    //             cc.vv.userMgr.enterRoom(cc.vv.userMgr.returnRoomId, function (ret) {
    //                 if (ret.errcode == 3) {
    //                     cc.vv.userMgr.returnRoomId = null;
    //                     cc.director.loadScene("hall");
    //                 }
    //             });
    //         }
    //     }
    // },

    onBtnAddGemsClicked: function () {
        cc.vv.audioMgr.playButtonClicked();

        cc.vv.utils.showFrame(this.shopWin, 'head', 'body', true);
    },

    onCreateRoomClicked: function (event, customEventData) {


        var gameName = "";
        if (customEventData == "guoyao") {
            this.gameIndex = 3;
        } else if (customEventData == "tuidaohu") {
            this.gameIndex = 1;
        } else if (customEventData == "doudizhu") {
            this.gameIndex=2;
        } else if (customEventData == "159majiang") {
            gameName = "159麻将";
        } else if (customEventData == "daohongsan") {
            gameName = "硬三嘴";
        } else if (customEventData == "yixian") {
            gameName = "一门牌";
        } else {
            gameName = "其他";
        }

        if (gameName != "") {
            if (cc.vv.alert) {
                var alertContent = gameName + "游戏正在开发，敬请期待！";
                cc.vv.alert.show(alertContent);
            }

            return;
        }

        cc.vv.audioMgr.playButtonClicked();
        cc.vv.hall.isClubRoom = false;
        this._isClub = false;
        this._isLv = false;
        this.createRoomWin.getChildByName("body").getChildByName("club_logo").active = false;
        /*        if(cc.vv.gameNetMgr.roomId != null){
                    cc.vv.alert.show("房间已经创建!\n必须解散当前房间才能创建新的房间");
                    return;
                }*/

        // this.createRoomWin.active = true;
        if (cc.vv.userMgr && cc.vv.userMgr.lv !== 1) {
            this.createRoomWin.getChildByName("body").getChildByName("btn_hasCreate").active = true;
            this.createRoomWin.getChildByName("body").getChildByName("btn_proxyCreate").active = true;
        }
        this.createRoomWin.getChildByName("body").getChildByName("club_name").getComponent(cc.Label).string = "";
        /*        if(cc.vv.gameNetMgr.roomId != null){
                    cc.vv.alert.show("房间已经创建!\n必须解散当前房间才能创建新的房间");
                    return;
                }*/

        // this.createRoomWin.active = true;
        cc.vv.utils.showDialog(this.createRoomWin, 'body', true);
    },

    //代开
    onBtn_Opened: function () {
        var self = this;
        var viewRecord = function (ret) {
           // cc.log("viewRecord ret = ", ret);
            cc.vv.wc.hide();
            if (ret.errcode !== 0) {
                cc.vv.alert.show("查看已开房间失败!");
            } else {
               cc.vv.global._space = 'hallDaiKai';
                cc.vv.roomCfg.setOpendedRoomsData(ret.data);
                // cc.vv.utils.showDialog(self.node, 'body', false);
                var openRoomsView = cc.vv.prefabMgr.getPrefab("prefabs/OpenedRoomView");
                // var hallCanvas = cc.director.getScene().getChildByName('Canvas');
                var openView = cc.instantiate(openRoomsView);
                self.node.addChild(openView);

               // console.log(self);
                cc.vv.hall.isClub = false;


            }
        }

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId
        };
       // cc.vv.wc.show(2);
        cc.vv.http.sendRequest("/get_daikai_rooms", data, viewRecord);

    },


    onBtnClubClicked: function () {

        if (cc.vv.alert) {
            cc.vv.alert.show("茶楼功能暂未开放，敬请期待！");
        }
        return;

        this._isClub = true;
        cc.vv.hall.isClubRoom = true;
        this.createRoomWin.getChildByName("body").getChildByName("club_logo").active = true;
        // var hallCanvas = cc.director.getScene().getChildByName('Canvas');
        var club = cc.instantiate(this.club);
        this.node.addChild(club);
    },

    addClubView: function () {
        this.clubView = cc.instantiate(this.clubPrefab);
        this.node.addChild(this.clubView);
    },



    onBtnClubClickedCaLou: function () {



        if (this.clubView == null) {
            this.addClubView();
        }


        var clubScript = this.clubView.getComponent("ClubView");
        if (clubScript) {
            clubScript.init();
        }

    },

    showRedPoint: function (isShow) { //显示俱乐部红点
        if (this.node !== null) {
            var redPoint = this.node.getChildByName("btnClub").getChildByName("applyRedPoint");
            redPoint.active = isShow;
        }
    },




    setGems: function (gems) {
        this.lblGems.string = gems.toString();
    },

    androidBackEvent: function () {


        //onKeyReleased onKeyPressed
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                if (keyCode === cc.KEY.back) {
                   // console.log("return button clicked. keycode:" + keyCode);
                    var endGame = function () {
                        cc.game.end();
                        // cc.director.end();
                    };
                    cc.vv.alert.show("是否退出国耀棋牌？", endGame, true);
                }
                else if (keyCode === cc.KEY.menu) {
                   // console.log("menu button clicked. keycode:" + keyCode);
                }
            }
        }, this.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var x = this.lblNotice.node.x;
        x -= dt * 100;
        if (x + this.lblNotice.node.width < -1000) {
            x = 500;
        }
        this.lblNotice.node.x = x;

        // if (cc.vv && cc.vv.userMgr.roomData != null) {
        //     cc.vv.userMgr.enterRoom(cc.vv.userMgr.roomData);
        //     cc.vv.userMgr.roomData = null;
        // }
    },
});
