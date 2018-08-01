cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
        roomId:null,
        maxNumOfGames:0,
        numOfGames:0,
        numOfMJ:0,
        seatIndex:-1,
        seats:null,
        turn:-1,
        button:-1,
        gamestate:"",
        isOver:false,
        dissoveData:null,
        projectState:"",
    },

    
    dispatchEvent:function(event,data){
            
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }    
    },
    
    getSeatIndexByID:function(userId){
        if (this.seats == null) {
            return -1;
        }
        for(var i = 0; i < this.seats.length; ++i){
            var seat = this.seats[i];
            if(seat.userid == userId){
                return i;
            }
        }
        return -1;
    },
    
    isOwner:function(){
        return this.seatIndex == 0;   
    },
    
    getSeatByID:function(userId){
        var seatIndex = this.getSeatIndexByID(userId);
        if (this.seats == null || seatIndex == -1) {
            return null;
        }
        var seat = this.seats[seatIndex];
        return seat;
    },
    
    getSelfData:function(){
        return this.seats[this.seatIndex];
    },
    
    getLocalIndex:function(index){
        var ret = cc.vv.SelectRoom.getLocalIndex(index);
        return ret;
    },
    
    prepareReplay:function(roomInfo,detailOfGame){
        this.roomId = roomInfo.id;
        this.seats = roomInfo.seats;
        this.opType = detailOfGame.base_info.conf.opType;
        cc.vv.SelectRoom.setRoomType(this.opType);//设置房间类型，判断是否为扑克
        cc.vv.SelectRoom.setRoomPeople(this.seats.length);

        this.turn = detailOfGame.base_info.button;

        var baseInfo = detailOfGame.base_info;
        if (detailOfGame.base_info.conf == null) {
            cc.vv.SelectRoom.setRoomPeople(this.seats.length);

            this.conf = {
                type:baseInfo.type,
            }
        }else {
            this.conf = detailOfGame.base_info.conf;
        }

        this.addAllHunPai(detailOfGame.base_info.hunpai);

        
        for(var i = 0; i < this.seats.length; ++i){
            var seatData = this.seats[i];
            seatData.seatindex = i;
            seatData.score = null;
            seatData.holds = baseInfo.game_seats[i];
            seatData.chis = [];
            seatData.pengs = [];
            seatData.angangs = [];
            seatData.diangangs = [];
            seatData.wangangs = [];
            seatData.folds = [];
            seatData.bright = [];//亮起的手牌
            seatData.secret = [];//暗扣的牌
            seatData.operation = [];//操作的手牌
          //  console.log(seatData);
            // if(cc.vv.userMgr.userId == seatData.userid){
            if(this.getMySeatUserId() == seatData.userid){
                this.seatIndex = i;
            }
        }
        // this.conf = {
        //     type:baseInfo.type,
        // }

        if(this.conf.type == null){
            this.conf.type == cc.vv.gameName;
        }

        var turnListString = detailOfGame.point;
        if (turnListString != "") {
            var turnListObj = JSON.parse(turnListString);
            this.setTurnIndexList(turnListObj);
        }
    },


    clearHandlers:function(){
        cc.vv.net_hall.deleteHandlers('club_room_update');
        cc.vv.net_hall.deleteHandlers('login_result');
        cc.vv.net_hall.deleteHandlers('monitor_club_result');
        cc.vv.net_hall.deleteHandlers('invite_play_game');
        cc.vv.net_hall.deleteHandlers('club_update_cfg');
        cc.vv.net_hall.deleteHandlers('unmonitor_club_result');
        cc.vv.net_hall.deleteHandlers('club_online_num');
        cc.vv.net_hall.deleteHandlers('club_total_num');
        cc.vv.net_hall.deleteHandlers('operate_club_notify');
        cc.vv.net_hall.deleteHandlers('login_finished');
        cc.vv.net_hall.deleteHandlers('Halldisconnect');
        cc.vv.net_hall.deleteHandlers('test_msg');
    },
    


    reConnectGameServer:function(){
        //cc.vv.userMgr.login();
        cc.vv.userMgr.reconnectLogin(this.connectHallServer)//回调重新连接，防止无限重连

        //this.connectGameServer();
    },


    initHandlers:function(){
        var self = this;       

        cc.vv.net_hall.addHandler("login_result",function(data){
            console.log("login_result");
           // console.log(data);
         
            if(data.errcode === 1){//需要http来进行登陆得到新的token 再来进行net_hall login

                self.reConnectGameServer();
            }

            if(data.errcode === 0){
                cc.vv.wc.hide();
            }
                      
        });

        cc.vv.net_hall.addHandler("club_gems", function (data) {
            console.log("club_gems");
          //  console.log(data);
            if(cc.vv.clubview !== undefined){
                if (cc.vv.clubview.viewData !== undefined ){
                    cc.vv.clubview.upDataGems(data)
                }        
            }               

        });


        cc.vv.net_hall.addHandler("club_room_update",function(data){
            console.log("club_room_update");
          //  console.log(data);

            cc.vv.clubview.updataClubViewData(data)                  
        });

        cc.vv.net_hall.addHandler("monitor_club_result",function(data){
            console.log("monitor_club_result");
          //  console.log(data);
         
          
        });

        cc.vv.net_hall.addHandler("invite_play_game",function(data){
            console.log("invite_play_game");
          //  console.log(data);
            cc.vv.clubview.showClubPrompt(data)         
          
        });

        cc.vv.net_hall.addHandler("club_update_cfg",function(data){
            console.log("club_update_cfg");
         //   console.log(data);
            if(data.type === 'clubAuto'){
                cc.vv.clubview.changeDefaultConf(data.conf)
                
            }
            if(data.type === 'clubCommon'){
                cc.vv.clubview.changeCfg(data);

            }
          
        });

        cc.vv.net_hall.addHandler("unmonitor_club_result",function(data){
            console.log("unmonitor_club_result");
          //  console.log(data);
            if(data.errcode === 0){
                cc.vv.clubview.monitorClub()
            }
          
        });

        cc.vv.net_hall.addHandler("club_online_num", function (data) {
            console.log("club_online_num");
          //  console.log(data);

            if(cc.vv.clubview !== undefined){

                if (cc.vv.clubview.viewData !== undefined ){
                    cc.vv.clubview.upDataOnlineNum(data)
                }
            }

        });

        cc.vv.net_hall.addHandler("club_total_num", function (data) {
            console.log("club_total_num");
          //  console.log(data);
            if(cc.vv.clubview !== undefined){
                if (cc.vv.clubview.viewData !== undefined ){
                    cc.vv.clubview.upDataTotalNum(data)
                }        
            }               

        });

        cc.vv.net_hall.addHandler('operate_club_notify',function(data){
            console.log('operate_club_notify');
          //  console.log(data)
            cc.vv.global.clubTempData.clubNotify = data;

            if(cc.vv.hall !== undefined){
                //cc.vv.hall.showRedPoint(true);
                cc.vv.clubview.updateHaveApply()
            }

                       
        })

        cc.vv.net_hall.addHandler('test_msg',function(data){
            console.log('test_msg');
          //  console.log(data)
            if(cc.vv.hall !== undefined){
                cc.vv.hall._testedit.string = data.errmsg
            }
           
        })

        cc.vv.net_hall.addHandler("Halldisconnect", function (data) {
            console.log('Halldisconnect')
            self.dispatchEvent("Halldisconnect");

        });
                
        cc.vv.net_hall.addHandler("login_finished",function(data){
            console.log("login_finished");
         //  console.log(data);
            cc.vv.SelectRoom.setScence();
        });

        
    },
   
    connectHallServer:function(){
        this.dissoveData = null;
        //cc.vv.net_hall.ip = data.ip + ":" + data.port;
        cc.vv.net_hall.ip = cc.vv.SI.hall;
        console.log(cc.vv.net_hall.ip);
      
        var onConnectOK = function () {
            console.log("onConnectOK");

            var sd = {
                token: cc.vv.userMgr.token,
                userId: cc.vv.userMgr.userId
            };
            cc.vv.net_hall.send("login", sd);
        };
        
        var onConnectFailed = function(){
            console.log("failed.");
            cc.vv.wc.hide();
        };
        //cc.vv.wc.show(0);
        cc.vv.net_hall.connect(onConnectOK,onConnectFailed);
    },

    judgeSeatsIDEqual: function () {

        if (this.seats == null) {

            if (cc.vv.alert) {
                var string = "玩家信息不存在！";
                cc.vv.alert.show(string); 
            }
            return;
        }

        var seatsLength = this.seats.length;
        for (var i = 0; i < seatsLength-1; i++) {
            var seatA = this.seats[i];

            for (var j = i+1; j < seatsLength; j++) {
                var seatB = this.seats[j];

                if (seatA.userid == seatB.userid) {
                    if (cc.vv.alert) {
                        var string = "错误：玩家ID相同，ID：" + seatB.userid + "，玩家名字：" + seatA.name + "、" + seatB.name;
                        cc.vv.alert.show(string); 
                        return;
                    }
                }
            };
        };
    },

    clearInitSeat: function () {
        if (this.seats == null) {
            return;
        }

        for (var i = 0; i < this.seats.length; i++) {
            var seat = this.seats[i];

            if (seat.userid <= 0) {
                if (seat.ip != null) {
                    seat.ip = null;
                }
            }
        };
    },

    getSeatByLocalIndex: function (localIndex) {

        if (this.seats == null) {
            return null;
        }

        var index = -1;
        for(var i = 0; i < this.seats.length; ++i){
            var seat = this.seats[i];
            var getSeatLocalIndex = this.getLocalIndex(seat.seatindex);

            if(getSeatLocalIndex == localIndex){
                index = i;
                break;
            }
        }

        if (index == -1) {
            return null;
        }else {
            var seat = this.seats[index];
            return seat;
        }
    },


    /**************************
    * 获取游戏中的音效路径
    **************************/

    //男女声音性别区分
    getSeatSex: function (seatIndex, localIndex) {
        if (this.seats == null) {
            return null;
        }

        var seat = null
        if (seatIndex < 0) {
            seat = this.getSeatByLocalIndex(localIndex);
        }else {
            seat = this.seats[seatIndex];
        }

        if (seat == null) {
            return null;
        }

        var seatUserId = seat.userid;
        var sexName = "Woman";
        if(cc.vv.baseInfoMap != null){
            var info = cc.vv.baseInfoMap[seatUserId];
            if(info != null && info.sex != null && info.sex == 1){
                sexName = "Man";
            }                
        }

        return sexName;
    },

    //获取音效文件名的前缀
    getNamePrefix: function (otherLName, otherSName) {
        var localNamePrefix = "mw_";
        var getLName = cc.vv.audioMgr.getLanguageName();
        var getSName = cc.vv.audioMgr.getSexName();

        if (otherLName != undefined && otherLName != "") {
            getLName = otherLName;
        }

        if (otherSName != undefined && otherSName != "") {
            getSName = otherSName
        }
        if (getLName == "Mandarin") {
            if (getSName == "Woman") {
                localNamePrefix = "mw_";
            }else if (getSName == "Man") {
                localNamePrefix = "mm_";
            }

        }else if (getLName == "Dialect") {
            if (getSName == "Woman") {
                localNamePrefix = "dw_";
            }else if (getSName == "Man") {
                localNamePrefix = "dm_";
            }
        }
        return localNamePrefix;
    },

    //播放音效
    setAudioSFX: function (seatIndex, localIndex, audioFolderName, audioName, otherLName) {
        var getLName = cc.vv.audioMgr.getLanguageName();
        var seatSex = this.getSeatSex(seatIndex, localIndex);
        if (seatSex != null) {
            var isEqualLanguage = true;
            cc.vv.audioMgr.setSexName(seatSex);
            var otherSName = seatSex;
            if (otherLName == undefined || otherLName == "") {
                otherSName = "";
            }else if (otherLName != getLName) {
                isEqualLanguage = false;
                cc.vv.audioMgr.setLanguageName(otherLName);
            }
            var prefix = this.getNamePrefix(otherLName, otherSName);
            var surePath = audioFolderName + "/" + prefix + audioName;
            cc.vv.audioMgr.playMJGameSFX(surePath);

            if (isEqualLanguage == false) {
                cc.vv.audioMgr.setLanguageName(getLName);
            }
        }
    },

    getMySex: function () {
        var sexName = "Woman";
        if(cc.vv.baseInfoMap != null){
            var info = cc.vv.baseInfoMap[cc.vv.userMgr.userId];
            if(info != null && info.sex != null && info.sex == 1){
                sexName = "Man";
            }                
        }

        return sexName;
    },

    showErrorTip: function (errorObj, objName) {
        var content = "显示有误，请重连！";
        if (errorObj == null) {
            content = objName + content;
        }else {
            return;
        }
        if (cc.vv.net) {
            cc.vv.net.send("client_error_msg", content);
        }
        if (cc.vv.alert) {
            cc.vv.alert.show(content);  
        }
    },


    /*新加函数 */
    createHallSocket: function () {

        cc.vv.mjgameNetMgr.clearHandlers();
        cc.vv.pkgameNetMgr.clearHandlers();
        cc.vv.hallgameNetMgr.clearHandlers();

        //cc.vv.hallgameNetMgr.init();
        cc.vv.hallgameNetMgr.initHandlers();

        cc.vv.net_hall.isPinging = false;
        cc.vv.http.needHttpReconnect = false;//建立soket的时候，这个控制是否出Http重连的对话
        cc.vv.gameNetMgr = cc.vv.hallgameNetMgr;

        cc.vv.hallgameNetMgr.connectHallServer();

    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
