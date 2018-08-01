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
        _gameresult: null,
        _huase: [],
        _you: [],
        _seats: [],
        owners: [],
        _isend: false,
        _lastSeconds: 0,
        _time: null,
        _roominfo: null,
        _endData: null,
        _ZhaNum: [],
        _baseInfo: null,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.vv == null) {
            return;
        }
        this._gameresult = this.node.getChildByName("game_result");
        //this._gameresult.active = false;
        this._time = cc.find('head/time', this._gameresult).getComponent(cc.Label);
        this._roominfo = cc.find('head/roominfo', this._gameresult).getComponent(cc.Label);
        this._baseInfo = cc.find('head/baseinfo', this._gameresult).getComponent(cc.Label);

        for (var i = 0; i < cc.vv.SelectRoom.getRoomPeople(); ++i) {
            var seatPre = cc.vv.prefabMgr.getPrefab("prefabs/PKGame/seat");
            var seat = cc.instantiate(seatPre);
            this._seats.push(seat.getComponent("Seat"));
            seat.getComponent("Seat").initMyData();
            var fangzhu = seat.getChildByName("fangzhu");
            this.owners.push(fangzhu);

            var zhaRoot = seat.getChildByName('end_Zha');
            var tmpzha = zhaRoot.getChildByName('num').getComponent(cc.Label);
            this._ZhaNum[i] = tmpzha;

            var tmpYou = []
            var youRoot = seat.getChildByName('end_you')

            for (let k = 0; k < youRoot.children.length; k++) {
                tmpYou.push(youRoot.children[k]);
                youRoot.children[k].active = false;
            }
            this._you[i] = tmpYou;

            var tmpHuase = []
            var huaseRoot = seat.getChildByName('end_huase');
            for (let k = 0; k < huaseRoot.children.length; k++) {
                tmpHuase.push(huaseRoot.children[k]);
                huaseRoot.children[k].active = false;
            }
            this._huase[i] = tmpHuase;


        }


        var btnClose = cc.find("Canvas/game_result/btnClose");
        if (btnClose) {
            cc.vv.utils.addClickEvent(btnClose, this.node, "PKGameResult", "onBtnCloseClicked");
        }
        var btnShare = cc.find("Canvas/game_result/btnShare");
        if (btnShare) {
            cc.vv.utils.addClickEvent(btnShare, this.node, "PKGameResult", "onBtnShareClicked");
        }
        var btnOver = cc.find("Canvas/game_result/btnOver");
        if (btnOver) {
            cc.vv.utils.addClickEvent(btnOver, this.node, "PKGameResult", "onBtnOverClicked");
        }


        //初始化网络事件监听器
        var self = this;
        this.node.on('game_over', function (data) {
            self.onGameEnd(data.detail);
            self.showOverOrEnd_showReady();
        });

        this.node.on('game_end', function (data) {
            self.onGameEnd(data.detail);
            self._endData = data.detail;
            self.showOverOrEnd_showOver();

        });

        this.onEventListener();
    },

    showResult: function (seat, info, isZuiJiaPaoShou) {
        seat.node.getChildByName("zuijiapaoshou").active = isZuiJiaPaoShou;

        seat.node.getChildByName("zimocishu").getComponent(cc.Label).string = info.numzimo;
        seat.node.getChildByName("jiepaocishu").getComponent(cc.Label).string = info.numjiepao;
        seat.node.getChildByName("dianpaocishu").getComponent(cc.Label).string = info.numdianpao;
        seat.node.getChildByName("angangcishu").getComponent(cc.Label).string = info.numangang;
        seat.node.getChildByName("minggangcishu").getComponent(cc.Label).string = info.numminggang;
        seat.node.getChildByName("wangangcishu").getComponent(cc.Label).string = info.numwangang;
        seat.node.getChildByName("diangangcishu").getComponent(cc.Label).string = info.numdiangang;
    },

    // hhhhh

    chlearZha: function () {
        for (let k = 0; k < this._ZhaNum.length; ++k) {
            this._ZhaNum[k].string = '0';
        }

    },
    hideZha: function () {
        for (let k = 0; k < this._ZhaNum.length; ++k) {
            this._ZhaNum[k].node.parent.active = false;
        }
    },
    showZha: function (userID) {
        var seats = cc.vv.gameNetMgr.seats;
        for (let k = 0; k < seats.length; ++k) {
            if (userID === seats[k].userid) {
                if (cc.vv._zhaNum)
                    this._ZhaNum[k].string = cc.vv._zhaNum[k];

            }
        }
    },
    hideHuaseAndYou: function () {
        for (let i = 0; i < cc.vv.SelectRoom.getRoomPeople(); ++i) {
            var seat = this._seats[i].node;
            var youRoot = seat.getChildByName('end_you');
            for (let k = 0; k < youRoot.children.length; k++) {
                youRoot.children[k].active = false;
            }
            var huaseRoot = seat.getChildByName('end_huase');
            for (let k = 0; k < huaseRoot.children.length; k++) {
                huaseRoot.children[k].active = false;
            }
            var foldsarr = this._seats[i].getFolds();

            for (let k in foldsarr) {
                foldsarr[k].active = false;
            }
        }
    },
    onGameEnd: function (data) {
        console.log('157',this._isend);
        var num = cc.vv.SelectRoom.getRoomPeople();
        var info = data.info;
        var endinfo = data.endinfo;
        if (num == 3) {
            var scale = 1;
            var offset = 1.5;
        } else if (num == 4) {
            var scale = 1;
            var offset = 2.3;
        } else if (num == 5) {
            var scale = 0.8;
            var offset = 2.7;
        } else {
            var scale = 0.6;
            var offset = 3;
        }
        var scoreDatas = [];
        if (this._isend) {
            for (let k in data.endinfo) {
                scoreDatas.push(data.endinfo[k].totalscore)
            }
        } else if (!data.results == undefined || !data.results.length == 0) {
            for (let k in data.results) {
                scoreDatas.push(data.results[k].score)
            }
        }
        var maxscore = -1;
        for (var i = 0; i < scoreDatas.length; ++i) {
            var score = scoreDatas[i];
            if (score > maxscore) {
                maxscore = score;
            }
        }
        for (var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i) {

            var seat = cc.vv.gameNetMgr.seats[i];
            if (endinfo) {
                this.owners[i].active = (seat.userid == info.conf.creator);
            }
            var foldsarr = this._seats[i].getFolds();

            for (let k in foldsarr) {
                foldsarr[k].active = false;
            }
            console.log("meng foldsarr", foldsarr);
            var score = scoreDatas[i];
            var isBigwin = false;
            if (score > 0) {
                isBigwin = (score == maxscore) && this._isend;
            }
            // cc
            this._seats[i].setInfo(seat.userid, seat.name, score, isBigwin);
            this._seats[i].setID(seat.userid);
            var width = scale * this._seats[i].node.getChildByName("GameEnd2").width;
            var tap = 1280 / num - width;
            this._seats[i].node.getChildByName("GameEnd2").setScale(scale, 1);
            this._seats[i].node.parent = this._gameresult.getChildByName("seats");
            var pos = this._seats[i].node.parent.convertToWorldSpaceAR(cc.p((i - num + offset) * width + tap, 246));
            var p = this._gameresult.convertToNodeSpaceAR(pos);
            this._seats[i].node.setPosition(p);
            var winNum = this._seats[i].node.getChildByName("winNum");
            var loseNum = this._seats[i].node.getChildByName("loseNum");
            var pingNum = this._seats[i].node.getChildByName("pingNum");
            if (this._isend && endinfo) {
                winNum.getChildByName("num").getComponent(cc.Label).string = endinfo[i].winNum ? endinfo[i].winNum : 0;
                loseNum.getChildByName("num").getComponent(cc.Label).string = endinfo[i].loseNum ? endinfo[i].loseNum : 0;
                pingNum.getChildByName("num").getComponent(cc.Label).string = endinfo[i].pingNum ? endinfo[i].pingNum : 0;
                winNum.active = true;
                loseNum.active = true;
                pingNum.active = true;

            }

           var tmpHolds = this.sortHolds(data.results[i])


            var holds_len = tmpHolds.length
            for (var j = 0; j < holds_len; ++j) {
                // console.log("meng foldsarr i j",foldsarr,i,j);
                var sprite = foldsarr[j].getComponent(cc.Sprite);
                cc.vv.controlMgr.setSpriteFrameByMJID("default-", sprite, tmpHolds[j]);
                if (this._isend) {
                    foldsarr[j].active = false;
                } else {
                    foldsarr[j].active = true;
                }
            }

        }
        var GameEnd6 = this._gameresult.getChildByName("GameEnd6");
        GameEnd6.getChildByName('title_ping').active = false;
        GameEnd6.getChildByName('title_win').active = false;
        GameEnd6.getChildByName('title_lose').active = false;
        //增加代开房主
        var ownerImg = cc.find("Canvas/game_result/owner");
        var ownerName = cc.find("Canvas/game_result/name");

        var daikai = info.daikai

        var self = this
        if (daikai) {
            for (var i = 0; i < self.owners.length; i++) {
                self.owners[i].active = false;
            }
            ;
            ownerImg.active = true
            ownerName.getComponent(cc.Label).string = info.creator_name
        }
        else {
            ownerImg.active = false
            ownerName.getComponent(cc.Label).string = ""
        }
        if (data.results == undefined || data.results.length == 0) {
            this._gameresult.active = true;
            this._baseInfo.string = "";
            this.hideHuaseAndYou();
            return;
        }
        this.showGameEnd6(data.results)
        var seats = cc.vv.gameNetMgr.seats;
        for (var i = 0; i < seats.length; ++i) {
           
            if(this._isend && endinfo){
                this._seats[i].hideDZorNM(false);
            }else{
                if ((info.dz||info.dz===0) && info.dz !== -1) {
                    if (i === info.dz) {
                        this._seats[i].setDZorNM(true);
                    } else {
                        this._seats[i].setDZorNM(false);
                    }
                }
            }           

            var tmpzha4Num = data.results[i].zha4Num;
            if (tmpzha4Num === undefined) {
                tmpzha4Num = 0;
            }
            var tmpwangzhaNum = data.results[i].wangzhaNum;
            if (tmpwangzhaNum === undefined) {
                tmpwangzhaNum = 0;
            }

            this.showZha(data.results[i].userId);

            this._seats[i].HideAllHuaSe();
            var liangList = data.results[i].liangList;
            if (liangList !== undefined) {
                var userid_liang = data.results[i].userId

                if (liangList.length !== 0) {
                    // this._seats[i].setHuaSe(liangList);
                    //this.showHuase(userid_liang,liangList);
                }
            }


            this._seats[i].hideAllYou();
            var huOrder = data.results[i].huOrder;
            if (huOrder !== undefined) {

                if (huOrder > -1) {

                    // this._seats[i].setYou(huOrder);
                }
            }
            // this.showResult(this._seats[i],endinfo[i],isZuiJiaPaoShou);
        }
        var gameNetMgr = cc.vv.gameNetMgr;
        var roomid = gameNetMgr.roomId;
        if (gameNetMgr.roomId == null && cc.vv.userMgr.playingRoomId != null) {
            roomid = cc.vv.userMgr.playingRoomId;
        }
        this._roominfo.string = '房间号: ' + roomid + ' 局数: ' + gameNetMgr.numOfGames + '/' + gameNetMgr.maxNumOfGames;

        var tmpinfo = [];
        var tmpbaseinfo = data.statInfo;
        // if(tmpbaseinfo.baseScore !== undefined){
        //     tmpinfo.push('基础分:'+tmpbaseinfo.baseScore)
        // }
        // if(tmpbaseinfo.liangNum !== undefined){
        //     tmpinfo.push('亮3数:'+tmpbaseinfo.liangNum)
        // }
        // if(tmpbaseinfo.zhuoNum !== undefined){
        //     tmpinfo.push('捉:'+tmpbaseinfo.zhuoNum)
        // }
        // if(tmpbaseinfo.guNum !== undefined){
        //     tmpinfo.push('股:'+tmpbaseinfo.guNum)
        // }
        // if(tmpbaseinfo.zhaNum !== undefined){
        //     tmpinfo.push('炸:'+tmpbaseinfo.zhaNum)
        // }


        if (cc.vv.gameNetMgr.isSync && cc.vv.gameNetMgr.gamestate === 'playing') {
            tmpinfo.push('炸弹总数:' + cc.vv.gameNetMgr._zhacount);
        } else {
            console.log('336 zhanum', cc.vv._zhaNum);
            if (cc.vv._zhaNum)
                tmpinfo.push('炸弹总数:' + cc.vv._zhaNum);
        }
        this._baseInfo.string = tmpinfo.join("  ");


        // if (endinfo) {
        //     //
        //     this.showOverOrEnd(false);
        // }else{
        //     this.showOverOrEnd(true);
        // }
        var pkgame = this.node.getComponent('PKGame');
        if (info.chuntian && this._isend===false) {
            pkgame.play_chuntian(true);
        } else if (info.fanchun && this._isend===false) {
            pkgame.play_chuntian(false);
        } else {
            console.log('349 gameresult');
            this._gameresult.active = true;
        }
    },

    hideAllyou: function () {
        for (var k in this._you) {
            var you = this._you[k];
            for (var i in you) {
                you[i].active = false;
            }
        }
    },


    sortHolds: function (seatData) {


        var holds = seatData.holds;

        if (holds == null) {
            return;
        }
        for (let i = 0; i < holds.length; i++) {
            if (holds[i] === 52 || holds[i] === 53) {
                holds[i] = (holds[i] + 1) * 100
            }
        }
        holds = cc.vv.controlMgr.sortPK(holds);
        for (let i = 0; i < holds.length; i++) {
            if (holds[i] > 99) {
                holds[i] = holds[i] / 100 - 1
            }
        }

        return holds;
    },

    showGameEnd6: function (data) {
        var isping = false;
        var GameEnd6 = this._gameresult.getChildByName("GameEnd6");
        GameEnd6.getChildByName('title_ping').active = false;
        GameEnd6.getChildByName('title_win').active = false;
        GameEnd6.getChildByName('title_lose').active = false;

        for (let k = 0; k < data.length; k++) {
            if (data[k].win === 1) {
                isping = false;
                break;
            }
        }

        if (isping) {
            GameEnd6.getChildByName('title_ping').active = true;
        } else {
            GameEnd6.getChildByName('title_ping').active = false;

            for (let k in data) {
                var seat = cc.vv.gameNetMgr.getSeatByID(data[k].userId);
                var localindex = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex)
                if (localindex === 0) {
                    GameEnd6.getChildByName('title_win').active = data[k].score > 0;
                    GameEnd6.getChildByName('title_lose').active = data[k].score < 0;
                    break;
                }
            }
        }


    },

    showOverOrEnd_showOver: function () {
        this._gameresult.getChildByName("GameEnd6").active = true;
        this._gameresult.getChildByName("GameEnd7").active = false;
        this._gameresult.getChildByName("btnClose").active = false;
        this._gameresult.getChildByName("btnReady").active = false;
        this._gameresult.getChildByName("btnOver").active = true;
        this._gameresult.getChildByName("btnShare").active = false;
    },

    showOverOrEnd_showReady: function () {
        this._gameresult.getChildByName("GameEnd6").active = true;
        this._gameresult.getChildByName("GameEnd7").active = false;
        this._gameresult.getChildByName("btnClose").active = false;
        this._gameresult.getChildByName("btnReady").active = true;
        this._gameresult.getChildByName("btnOver").active = false;
        this._gameresult.getChildByName("btnShare").active = false;
    },


    showOverOrEnd: function (enable) {
        this._gameresult.getChildByName("GameEnd6").active = enable;
        this._gameresult.getChildByName("GameEnd7").active = !enable;
        this._gameresult.getChildByName("btnClose").active = !enable;
        this._gameresult.getChildByName("btnReady").active = enable;
        this._gameresult.getChildByName("btnOver").active = enable;
        this._gameresult.getChildByName("btnShare").active = !enable;
    },
    onBtnOverClicked: function () {
        this._isend = true;
        this.onGameEnd(this._endData);
        this.hideAllyou();
        this.hideZha();
        this._baseInfo.node.active = false;
        this.showOverOrEnd(false);
    },
    onBtnCloseClicked: function () {
        cc.vv.gameNetMgr.seats = null;

        cc.vv.net.endInterval();
        cc.vv.net.endSocket();

        // setTimeout(() => {
        //     cc.vv.net.isPinging = false;
        //     cc.vv.hallgameNetMgr.createHallSocket()
        //     cc.director.loadScene("hall")
        // }, 500);
        cc.director.loadScene("hall");

    },

    onBtnShareClicked: function () {
        cc.vv.gameNetMgr.seats = null;
        cc.vv.anysdkMgr.shareResult();
    },

    onEventListener: function () {
        this._gameresult.on(cc.Node.EventType.TOUCH_START, function (event) {
        });
    },

    curentTime: function () {
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
        var seconds = Math.floor(Date.now() / 1000);
        if (this._lastSeconds != seconds) {
            this._lastSeconds = seconds;

            this._time.string = this.curentTime();
        }
    },
});
