cc.Class({
    extends: cc.Component,

    properties: {
        // 0 - 5
        inputs: {
            default: [],
            type: [cc.Label],
        },
        
        _roomid: [],
        
        _inputIndex: 0,
        title: {
            default: null,
            type: cc.Sprite
        },
        titleFrames: {
            default: [],
            type: cc.SpriteFrame
        }
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        
    },
    
    onEnable:function(){
        this.setTitleFrame();
        this.onResetClicked();
    },
    
    onInputFinished: function(roomId) {

        if (cc.vv.userMgr.boolReplyJoinGame == true) {
            this.replyOtherGame(roomId);
        }else {
            this.joinGame(roomId);
        }
    },
    
    onInput: function(num) {
        cc.vv.audioMgr.playButtonClicked();
        var id = this._inputIndex;
        if (id >= this.inputs.length) {
            return;
        }
        this.inputs[id].string = num;
        this._inputIndex = id + 1;
        this._roomid.push(num);

        if (this._inputIndex == this.inputs.length) {
            var roomId = this.parseRoomID();
            this.onInputFinished(roomId);
        }
    },
    
    onN0Clicked: function() {
        this.onInput(0);
    },
    onN1Clicked:function(){
        this.onInput(1);  
    },
    onN2Clicked:function(){
        this.onInput(2);
    },
    onN3Clicked:function(){
        this.onInput(3);
    },
    onN4Clicked:function(){
        this.onInput(4);
    },
    onN5Clicked:function(){
        this.onInput(5);
    },
    onN6Clicked:function(){
        this.onInput(6);
    },
    onN7Clicked:function(){
        this.onInput(7);
    },
    onN8Clicked:function(){
        this.onInput(8);
    },
    onN9Clicked:function(){
        this.onInput(9);
    },

    onResetClicked: function() {
        cc.vv.audioMgr.playButtonClicked();

        for (var i = 0; i < this.inputs.length; ++i) {
            this.inputs[i].string = '';
        }
        this._inputIndex = 0;
        this._roomid = [];
    },

    onDelClicked: function() {
        cc.vv.audioMgr.playButtonClicked();
        if (this._inputIndex > 0) {
            this._inputIndex -= 1;
            this.inputs[this._inputIndex].string = '';
            this._roomid.pop();
        }
    },

    onCloseClicked: function() {
        cc.vv.audioMgr.playButtonClicked();
		cc.vv.utils.showDialog(this.node, 'panel', false);
    },
    
    parseRoomID: function() {
        var str = "";
        for (var i = 0; i < this.inputs.length; ++i) {
            str += this._roomid[i];
        }
        return str;
    },

    replyOtherGame: function (code) {

        var self = this;

        cc.vv.userMgr.getOtherReplyRommeInfoInCode(code, function(ret){

            var data = ret.data;

            if (data == null) {
                var content = "回放码["+ code +"]不存在，请重新输入!";
                cc.vv.alert.show(content);
                self.onResetClicked();
                return;
            }

            self.node.active = false;

            var roomUUID = data.room_uuid;
            var idx = data.index;
            var userData = {
                id: data.room_id,
                seats: data.history.seats
            };

            for (var i = 0; i < userData.seats.length; i++) {
                userData.seats[i].name = new Buffer(userData.seats[i].name,'base64').toString();
            };

            cc.vv.userMgr.getDetailOfGame(roomUUID,idx,function(dataGame){
                cc.vv.userMgr.boolOtherReply = true;
                cc.vv.userMgr.otherReplyUserId = data.userid;
                dataGame.base_info = JSON.parse(dataGame.base_info);
                dataGame.action_records = JSON.parse(dataGame.action_records);

                var opType = dataGame.base_info.conf.opType;
                cc.vv.SelectRoom.setRoomType(opType);
    
                if(cc.vv.gameNetMgr !== ''){
                    cc.vv.gameNetMgr.clearHandlers();
                    cc.vv.gameNetMgr = ''
                }        
        
                if(cc.vv.SelectRoom.getRoomType()===10){
                    cc.vv.pkgameNetMgr.init();
                    cc.vv.pkgameNetMgr.initHandlers();
                    cc.vv.gameNetMgr = cc.vv.pkgameNetMgr
                }else{
                    cc.vv.mjgameNetMgr.init();
                    cc.vv.mjgameNetMgr.initHandlers();
                    cc.vv.gameNetMgr = cc.vv.mjgameNetMgr
                }         
               

                cc.vv.gameNetMgr.prepareReplay(userData, dataGame);
               
                if(cc.vv.SelectRoom.getRoomType()===10){
                    cc.vv.PKReplayMgr.init(data)
                } else   cc.vv.replayMgr.init(dataGame);
                //cc.director.loadScene("mjgame"); 
                cc.vv.SelectRoom.setScence();
            });
        });
    },

    joinGame: function (roomId) {
        
        cc.vv.userMgr.enterRoom(roomId, function(ret) {
            if (ret.errcode == 0) {
                this.node.active = false;
            } else if (ret.errcode == -1) {

            }else {
                var content = "房间["+ roomId +"]不存在，请重新输入!";
                if(ret.errcode == 4){
                    content = "房间["+ roomId + "]已满!";
                }else if (ret.errcode == 5) {
                    content = "房主不能进入自己代开的房间！";
                }else if(ret.errcode == 6){
                    content ='与其他玩家ip相同或地理位置相近，无法进入该房间';
                }else if(ret.errcode==7){
                    // var chk=cc.vv.GPSMgr.chkGps();
                    // if(!chk){
                    //     return;
                    // }
                    // content='GPS数据获取失败';
                }
                cc.vv.alert.show(content);
                this.onResetClicked();
            }
        }.bind(this)); 
    },

    setTitleFrame: function () {
        if (cc.vv.userMgr.boolReplyJoinGame == true) {
            this.title.spriteFrame = this.titleFrames[1];
        }else {
            this.title.spriteFrame = this.titleFrames[0];
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
