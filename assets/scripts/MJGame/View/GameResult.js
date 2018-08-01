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
        _gameresult:null,
        _seats:[],
        owners: [],

        _lastSeconds: 0,
        _time: null,
        _roominfo: null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        // this._gameresult = this.node.getChildByName("game_result");
        this._gameresult = this.node.getChildByName("game_result_new");
        //this._gameresult.active = false;

        this._time = cc.find('head/time', this._gameresult).getComponent(cc.Label);
        this._roominfo = cc.find('head/roominfo', this._gameresult).getComponent(cc.Label);
        
        var seats = this._gameresult.getChildByName("seats");
        for(var i = 0; i < seats.children.length; ++i){
            this._seats.push(seats.children[i].getComponent("Seat"));  

            var fangzhu = seats.children[i].getChildByName("fangzhu");
            this.owners.push(fangzhu);
        }
        
        // var btnClose = cc.find("Canvas/game_result/btnClose");
        var btnClose = cc.find("Canvas/game_result_new/btnClose");
        if(btnClose){
            cc.vv.utils.addClickEvent(btnClose,this.node,"GameResult","onBtnCloseClicked");
        }
        
        // var btnShare = cc.find("Canvas/game_result/btnShare");
        var btnShare = cc.find("Canvas/game_result_new/btnShare");
        if(btnShare){
            cc.vv.utils.addClickEvent(btnShare,this.node,"GameResult","onBtnShareClicked");
        }
        
        //初始化网络事件监听器
        var self = this;
        this.node.on('game_end',function(data){self.onGameEnd(data.detail);});

        this.onEventListener();
    },
    
    showResult:function(seat,info,isZuiJiaPaoShou){
        seat.node.getChildByName("zuijiapaoshou").active = isZuiJiaPaoShou;
        
        seat.node.getChildByName("zimocishu").getComponent(cc.Label).string = info.numzimo;
        seat.node.getChildByName("jiepaocishu").getComponent(cc.Label).string = info.numjiepao;
        seat.node.getChildByName("dianpaocishu").getComponent(cc.Label).string = info.numdianpao;
        seat.node.getChildByName("angangcishu").getComponent(cc.Label).string = info.numangang;
        seat.node.getChildByName("minggangcishu").getComponent(cc.Label).string = info.numminggang;
        seat.node.getChildByName("wangangcishu").getComponent(cc.Label).string = info.numwangang;
        seat.node.getChildByName("diangangcishu").getComponent(cc.Label).string = info.numdiangang;
    },
    
    onGameEnd:function(data){
        //增加代开房主
        var endinfo = data.endinfo
        var info = data.info

        // var ownerImg = cc.find("Canvas/game_result/owner");
        // var ownerName = cc.find("Canvas/game_result/name");

         var ownerImg = cc.find("Canvas/game_result_new/owner");
        var ownerName = cc.find("Canvas/game_result_new/name");

        var daikai = info.daikai

        var self = this
        if (daikai)
        {
            for (var i = 0; i < self.owners.length; i++) {
                self.owners[i].active = false;
            };
            ownerImg.active = true
            ownerName.getComponent(cc.Label).string = info.creator_name
        }
        else
        {
            ownerImg.active = false
            ownerName.getComponent(cc.Label).string = ""
        }

        var seats = cc.vv.gameNetMgr.seats;
        var maxscore = -1;
        var maxdianpao = 0;
        var dianpaogaoshou = -1;
        for(var i = 0; i < seats.length; ++i){
            var seat = seats[i];
            if(seat.score > maxscore){
                maxscore = seat.score;
            }
            if(endinfo[i].numdianpao > maxdianpao){
                maxdianpao = endinfo[i].numdianpao;
                dianpaogaoshou = i;
            }
        }
        
        for(var i = 0; i < seats.length; ++i){
            var seat = seats[i];
            var isBigwin = false;
            if(seat.score > 0){
                isBigwin = seat.score == maxscore;
            }
            this._seats[i].setInfo(seat.userid, seat.name,seat.score, isBigwin);
            this._seats[i].setID(seat.userid);
            var isZuiJiaPaoShou = dianpaogaoshou == i;
            this.showResult(this._seats[i],endinfo[i],isZuiJiaPaoShou);
        }

        
        var gameNetMgr = cc.vv.gameNetMgr; 
        var roomid = gameNetMgr.roomId;
        if (gameNetMgr.roomId == null && cc.vv.userMgr.playingRoomId != null) {
            roomid = cc.vv.userMgr.playingRoomId;
        } 
        this._roominfo.string = '房间号: ' + roomid + ' 局数: ' + gameNetMgr.numOfGames + '/' + gameNetMgr.maxNumOfGames;
    },
    
    onBtnCloseClicked:function(){
        cc.vv.gameNetMgr.seats = null;
       
        cc.vv.net.endInterval();
        cc.vv.net.endSocket();
        
        // setTimeout(() => {
        //     cc.vv.net.isPinging = false;
        //     cc.vv.hallgameNetMgr.createHallSocket()
        //     cc.director.loadScene("hall")
        // }, 500);

        cc.director.loadScene("hall")

    },
    
    onBtnShareClicked:function(){
        cc.vv.gameNetMgr.seats = null;
        cc.vv.anysdkMgr.shareResult();
    },

    onEventListener: function () {
        this._gameresult.on(cc.Node.EventType.TOUCH_START,function(event){
        });
    },

    curentTime: function() {
        var now = new Date();

        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();

        var hh = now.getHours();
        var mm = now.getMinutes();
        var ss = now.getSeconds();

        var clock = year + "-";

        if (month < 10) {
            clock += "0";
        }

        clock += month + "-";

        if (day < 10) {
            clock += "0";
        }

        clock += day + " ";

        if (hh < 10) {
            clock += "0";
        }

        clock += hh + ":";
        if (mm < 10) {
            clock += '0';
        }

        clock += mm + ":";

        if (ss < 10) {
            clock += '0';
        }

        clock += ss;
        
        return clock;
    },

    update: function (dt) {
        var seconds = Math.floor(Date.now()/1000);
        if (this._lastSeconds != seconds) {
            this._lastSeconds = seconds;

            this._time.string = this.curentTime();
        }
    },
});
