cc.Class({
    extends: cc.Component,
    properties: {
        account: null,
        userId: null,
        userName: null,
        lv: 0,
        exp: 0,
        coins: 0,
        gems: 0,
        sign: 0,
        ip: "",
        sex: 0,
        roomData: null,

        oldRoomId: null,
        returnRoomId: null,

        boolReplyJoinGame: false,
        otherReplyUserId: null,
        boolOtherReply: false,
    },

    guestAuth: function () {
        var account = cc.args["account"];
        if (account == null) {
            account = cc.sys.localStorage.getItem("account");
        }

        if (account == null) {
            account = Date.now();
            cc.sys.localStorage.setItem("account", account);
        }

        cc.vv.http.sendRequest("/guest", { account: account }, this.onAuth);
    },

    onAuth: function (ret) {
        var self = cc.vv.userMgr;
        if (ret.errcode !== 0) {
            console.log(ret.errmsg);
        }
        else {
            self.account = ret.account;
            self.sign = ret.sign;

            var is_guest = self.getLocalServerType();
            if (is_guest) {
                cc.vv.http.url = "http://" + cc.vv.SI.hall;
            } else {
                cc.vv.http.url = self.getHallIP();
                if (cc.vv.http.url == "") {
                    return;
                }
            }

            self.login();
        }
    },

    getLocalServerType: function () {
        var is_guest = false;
        if (cc.vv.http.master_url == cc.guest_url) {
            is_guest = true;
        }
        return is_guest;
    },

    getHallIP: function () {
        var hallIP = "";
        if (cc.vv.SI.hall != null && typeof cc.vv.SI.hall == "string") {
            var hallIPArray = cc.vv.SI.hall.split(":");
            var port_index = hallIPArray.length - 1;
            var port = hallIPArray[port_index];

            hallIP = cc.formal_ip + ":" + port;
        }

        return hallIP;
    },

    login: function () {
        var self = this;
        var onLogin = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                if (!ret.userid) {
                    //jump to register user info.
                    var isGuest = self.removeLocalStorage();
                    if (isGuest == false) {
                        return;
                    }
                    cc.director.loadScene("createrole");
                }
                else {
                   // console.log(ret);
                    self.account = ret.account;
                    self.userId = ret.userid;
                    self.userName = ret.name;
                    self.lv = ret.lv;
                    self.exp = ret.exp;
                    self.coins = ret.coins;
                    self.gems = ret.gems;
                    self.roomData = ret.roomid;
                    self.sex = ret.sex;
                    self.ip = ret.ip;
                    //cc.director.loadScene("hall");
                    self.token = ret.token;

                    if (ret.roomid !== undefined) {
                        self.enterRoom(ret.roomid);
                    } else {
                        // var tmpSpace = cc.vv.gameNetMgr._space;
                        // cc.vv.net.isPinging = false;
                        // cc.vv.hallgameNetMgr.createHallSocket();
                        // console.log(cc.vv.hall);
                        // console.log(cc.vv.hallreconnect);
                       
                        cc.director.loadScene("hall")


                        // if (tmpSpace !== 'hallClub' && tmpSpace !== 'hallDaiKai'){
                        //     cc.director.loadScene("hall")
                        // } else{ 
                        //     cc.vv.gameNetMgr._space = 'hallClub';

                        //     cc.vv.hallreconnect.regDisconnect(true);
                        // }                       
                    }
                }
            }
        };
        cc.vv.wc.show("正在登录游戏");
        cc.vv.http.sendRequest("/login", { account: this.account, sign: this.sign }, onLogin);
    },


    reconnectLogin: function (callback) {
        var self = this;
    
        var onLogin = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                if (!ret.userid) {
                    //jump to register user info.
                    var isGuest = self.removeLocalStorage();
                    if (isGuest == false) {
                        return;
                    }
                    cc.director.loadScene("createrole");
                }
                else {
                  //  console.log(ret);
                    self.account = ret.account;
                    self.userId = ret.userid;
                    self.userName = ret.name;
                    self.lv = ret.lv;
                    self.exp = ret.exp;
                    self.coins = ret.coins;
                    self.gems = ret.gems;
                    self.roomData = ret.roomid;
                    self.sex = ret.sex;
                    self.ip = ret.ip;
                    //cc.director.loadScene("hall");
                    self.token = ret.token;

                    callback()//重新连接

                    // if (ret.roomid !== undefined) {
                    //     self.enterRoom(ret.roomid);
                    // } else {
                    //     var tmpSpace = cc.vv.gameNetMgr._space;
                    //     cc.vv.net.isPinging = false;
                    //     cc.vv.hallgameNetMgr.createHallSocket();
                    //     console.log(cc.vv.hall);
                    //     console.log(cc.vv.hallreconnect);
                        
                                                
                    //     if (tmpSpace !== 'hallClub' && tmpSpace !== 'hallDaiKai'){
                    //         cc.director.loadScene("hall")
                    //     } else{ 
                    //         cc.vv.gameNetMgr._space = 'hallClub';
                    //         cc.vv.hallreconnect.regDisconnect(true);
                    //     }                       
                    // }
                }
            }
        };
        cc.vv.wc.show("正在登录游戏");
        cc.vv.http.sendRequest("/login", { account: this.account, sign: this.sign }, onLogin);
    },


    removeLocalStorage: function () {
        var is_guest = false;
        if (cc.vv.http.master_url == cc.guest_url) {
            is_guest = true;
            return is_guest;
        }

        var wx_account = cc.sys.localStorage.getItem("wx_account");
        if (wx_account) {
            cc.sys.localStorage.removeItem("wx_account");
        }

        var wx_sign = cc.sys.localStorage.getItem("wx_sign");
        if (wx_sign) {
            cc.sys.localStorage.removeItem("wx_sign");
        }

        var guest_account = cc.sys.localStorage.getItem("account");
        if (guest_account) {
            cc.sys.localStorage.removeItem("account");
        }

        if (cc.vv && cc.vv.wc) {
            cc.vv.wc.hide();
        }

        return is_guest;
    },

    create: function (name) {
        var self = this;
        var onCreate = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                self.login();
            }
        };

        var data = {
            account: this.account,
            sign: this.sign,
            name: name
        };
        cc.vv.http.sendRequest("/create_user", data, onCreate);
    },

    enterRoom: function (roomId, callback) {

        var self = this;
        var strGameType = ''
        var onEnter = function (ret) {

            

            if (ret.errcode === 0) {
                cc.vv.net_hall.endInterval();
                cc.vv.net_hall.endSocket();
                cc.vv.net_hall.isPinging = false;

                if (cc.vv.gameNetMgr !== '') {
                    cc.vv.gameNetMgr.clearHandlers();
                    cc.vv.gameNetMgr = ''
                }
    
                strGameType = ret.game;//'poker'
                if (strGameType === 'ddz') {
                    cc.vv.pkgameNetMgr.init();
                    cc.vv.pkgameNetMgr.initHandlers();
                    cc.vv.gameNetMgr = cc.vv.pkgameNetMgr
                } else {
                    cc.vv.mjgameNetMgr.init();
                    cc.vv.mjgameNetMgr.initHandlers();
                    cc.vv.gameNetMgr = cc.vv.mjgameNetMgr
                }
            }

          
            if (ret.errcode == -102) {
                var content = "当前客户端版本过旧，请退出后重新登录！";
                cc.vv.alert.show(content,function(){
                    cc.game.end();
                });
                return;
            }
           
            if (ret.errcode == -2) //房间已经不存在
            {
                cc.vv.gameNetMgr.reset()
                cc.vv.gameNetMgr.roomId = null
                cc.vv.wc.hide()
                callback(ret);
                return
            }
            else if (ret.errcode !== 0) {
                if (ret.errcode == -1) {
                    setTimeout(function () {
                        self.enterRoom(roomId, callback);
                    }, 5000);
                } else if (ret.errcode == -3) {
                    var tipRoom = function () {
                       
                        self.enterRoom(ret.roomid, callback);
                        //cc.vv.global.restartGame();
                    }
                    var content = "您还有正在进行的牌局，现在进入" + ret.roomid + "房间？";
                    cc.vv.alert.show(content, tipRoom, true);
                }
                else {
                    cc.vv.wc.hide();
                    if (callback != null) {
                        callback(ret);
                    }
                }
            }
            else {
                cc.vv.wc.hide();
                if (callback != null) {
                    callback(ret);
                }
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var data = {
            client_version: cc.client_version,
            location: cc.vv.GPSMgr.getLocation(),
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            roomid: roomId
        };

        if(cc.vv.hallreconnect != undefined && cc.vv.hallreconnect != null){
            cc.vv.hallreconnect.cleanTimeout();
            cc.vv.net_hall.endInterval();
        }

      //  console.log(cc.vv.wc)
        //cc.vv.wc.show("正在进入房间 " + roomId);
       // console.log(cc.vv.http);
        cc.vv.http.sendRequest("/enter_private_room", data, onEnter);
    },
    getHistoryList: function (callback) {
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                console.log(ret.history);
                if (callback != null) {
                    callback(ret.history);
                }
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_history_list", data, onGet);
    },
    getGamesOfRoom: function (uuid, callback) {
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
              //  console.log(ret.data);
                callback(ret.data);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            uuid: uuid,
        };
        cc.vv.http.sendRequest("/get_games_of_room", data, onGet);
    },

    getDetailOfGame: function (uuid, index, callback) {
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
             //   console.log(ret.data);
                callback(ret.data);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            uuid: uuid,
            index: index,
        };
        cc.vv.http.sendRequest("/get_detail_of_game", data, onGet);
    },

    getGameGoods: function (callback) {
        var self = this;
        var onGet = function (ret) {
            cc.vv.wc.hide();
            if (ret != null) {
                callback(ret);
            }
        };

        cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/get_game_goods", null, onGet, shopURL);
    },

    // * 领取记录接口
    // http://47.93.78.162:9401/get_achieve_logs?account=guest_1496320626752&sign=6b3b05a62c78403521331db9a750261d&userid=12

    // * 返回
    // {
    //   "data": [         //领取记录
    //     {
    //       "id": 1,
    //       "userid": 12,
    //       "num": 20,    //领取元宝数量
    //       "time": 0     //领取事件
    //     }
    //   ],
    //   "card_num": 0,    //可领取的元宝数量
    //   "user_num": 0,    //可获取奖励的推广人数
    //   "errcode": 0,
    //   "errmsg": "ok"
    // }
    getAchieveLogs: function (callback) {
        var self = this
        var onGet = function (ret) {
            cc.vv.wc.hide();
            if (ret != null) {
                callback(ret);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
        };

        cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/get_achieve_logs", data, onGet);
    },

    // ====领取元宝接口
    // http://47.93.78.162:9401/achieve_card?account=guest_1496320626752&sign=6b3b05a62c78403521331db9a750261d&userid=12&user_num=13

    // * usr_num 可获取奖励的推广人数 从领取记录接口获取

    // 返回：

    // {
    //   "real_card_num": 0,//领取到的元宝数量
    //   "errcode": 0,
    //   "errmsg": "ok"
    // }
    getAchieveCard: function (userNum, callback) {
        var self = this
        var onGet = function (ret) {
            cc.vv.wc.hide();
            if (ret != null) {
                callback(ret);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
            user_num: userNum
        };

        cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/achieve_card", data, onGet);
    },
    getActivity: function (callback) {
        var self = this
        var onGet = function (ret) {
            cc.vv.wc.hide();
            if (ret != null) {
                callback(ret);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
            activity_id: 1
        };

        cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/get_activity", data, onGet);
    },
    getAwardsLog: function (callback) {
        var onGet = function (ret) {
            cc.vv.wc.hide();
            if (ret != null) {
                callback(ret);
            }
        };
        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            activity_id: 1
        };
        cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/get_awards_log", data, onGet);
    },
    shareRP: function () {
        var result = function (ret) {
          //  console.log("mengdong shareRP", ret);
            if (ret.errcode !== 0) {
                fn();
            } else {
                cc.vv.redpacket.getActivityInfo();
            }
        }
            ;
        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
            type: 101
        }
        var fn = function () {
            cc.vv.http.sendRequest("/share", data, result);
        }
        fn();
    },

    //他人回放
    getOtherReplyCode: function (roomid, roomUUid, index, callback) {

        var onGet = function (ret) {

         //   console.log("getOtherReplyCode ret", ret);
            cc.vv.wc.hide();

            if (ret != null) {
                callback(ret);
            }
        }
            ;

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            room_id: roomid,
            room_uuid: roomUUid,
            index: index,
            userid: cc.vv.userMgr.userId
        };

        cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/set_view_code", data, onGet);
    },

    getOtherReplyRommeInfoInCode: function (code, callback) {

        var onGet = function (ret) {

          //  console.log("getOtherReplyRommeInfoInCode ret", ret);
            cc.vv.wc.hide();

            if (ret != null) {
                callback(ret);
            }
        }
            ;

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            code: code
        };

        cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/get_view_code", data, onGet);
    },

    /**********************
   ***** 重写茶楼 *****
   **********************/

    getMyClub: function (callback) {

        var onGetMyClub = function (ret) {
            callback(ret)
        }

        var club_data = {
            userid: cc.vv.userMgr.userId,
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign
        }
        cc.vv.http.sendRequest("/get_my_club", club_data, onGetMyClub);
    },



    getDaiKaiRooms: function (clubid, callback) {

        var onGetDaiKaiRooms = function (ret) {
            callback(ret)
        }

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
            clubid: clubid
        };

        cc.vv.http.sendRequest("/get_daikai_rooms", data, onGetDaiKaiRooms);

    },


    joinClub: function (clubId, callback) {
        var self = this;
        var onJoinClub = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };


        //http://123.207.40.180:7465/apply_join_club?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&userid=29&clubid=12345

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
            clubid: clubId
        };

        cc.vv.http.sendRequest("/apply_join_club", data, onJoinClub);

    },


    enterClub: function (callback) {
        var self = this;
        var onEnterClub = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };

        var retData = {
            errcode: 0
        };
        onEnterClub(retData);

        // var data = {
        //     account:cc.vv.userMgr.account,
        //     sign:cc.vv.userMgr.sign,
        //     userid: cc.vv.userMgr.userId,
        // };

        // cc.vv.http.sendRequest("/enter_club",data,onEnterClub);

    },

    createClub: function (clubName, callback) {
        var self = this;
        var onCreateClub = function (ret) {
            callback(ret)
        }

        //http://123.207.40.180:7531/create_club?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&userid=58&name=zh1

        var club_data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
            name: clubName
        }
        cc.vv.http.sendRequest("/create_club", club_data, onCreateClub);
    },

    getApplyList: function (clubid, lastid, callback) {
        var self = this;
        var onApplyList = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };


        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            clubid: clubid,
            lastid: lastid,
            status: 0,
        };

        cc.vv.http.sendRequest("/get_club_users", data, onApplyList);

        //http://123.207.40.180:7531/get_club_users?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&clubid=8581876&lastid=0


    },

    getMemberList: function (clubid, lastid, callback) {
        var self = this;
        var onMemberList = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }

            if (callback != null) {
                callback(ret);
            }
        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            clubid: clubid,
            lastid: lastid,
            status: 1,
        };

        cc.vv.http.sendRequest("/get_club_users", data, onMemberList);

        //http://123.207.40.180:7531/get_club_users?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&clubid=8581876&lastid=0

    },

    getBlackList: function (clubid, lastid, callback) {
        var self = this;
        var onMemberList = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }

            if (callback != null) {
                callback(ret);
            }

        };


        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            clubid: clubid,
            lastid: lastid,
            status: 2,
        };

        cc.vv.http.sendRequest("/get_club_users", data, onMemberList);

        //http://123.207.40.180:7531/get_club_users?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&clubid=8581876&lastid=0

    },



    getClubRecordList: function (clubId, callback) {
        var self = this;
        var onRecordList = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };


        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
            clubid: clubId
        };

        cc.vv.http.sendRequest("/get_daikai_logs", data, onRecordList);

    },

    getClubGamePlay: function (clubId, callback) {
        var self = this;
        var onGamePlay = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };



        //http://123.207.40.180:7531/get_club_cfg?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&clubid=8581876

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            clubid: clubId
        };

        cc.vv.http.sendRequest("/get_club_cfg", data, onGamePlay);

    },



    setClubGamePlay: function (data, callback) {
        var self = this;
        var onGamePlay = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };
        data.account = cc.vv.userMgr.account;
        data.sign = cc.vv.userMgr.sign;

        cc.vv.http.sendRequest('/set_club_cfg', data, onGamePlay)

    },

    operateClub: function (data, callback) {

        var self = this;
        var onGamePlay = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };

        cc.vv.http.sendRequest('/operate_club', data, onGamePlay)


        //http://123.207.40.180:7531/operate_club?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&clubid=8581876&userid=58&users=69&status=4

    },

    //牌桌的玩法获取、设置
    getTableGamePlay: function (roomId, callback) {
        var self = this;
        var onTablePlay = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };

        var retData = {
            errcode: 0
        };
        onTablePlay(retData);

        // var data = {
        //     account: cc.vv.userMgr.account,
        //     sign: cc.vv.userMgr.sign,
        //     userid: cc.vv.userMgr.userId,
        //     roomId: roomId
        // };

        // cc.vv.http.sendRequest("/get_auto_cfg",data,onTablePlay);

    },

    setTableGamePlay: function (data, callback) {
        var self = this;
        var onTablePlay = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };

        var tmpObj = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            clubid: data.clubid,
            conf: data.NewConf,
            roomid: data.roomid,
        };

        //ttp://123.207.40.180:7531/modify_room?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&clubid=8581876
        cc.vv.http.sendRequest("/modify_room", tmpObj, onTablePlay);

    },

    dissolveClubRoom: function (data, callback) {
        var self = this;
        var onTablePlay = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };

        var tmpObj = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userid: cc.vv.userMgr.userId,
            clubid: data.clubid,
            roomid: data.roomid,
        };

        //ttp://123.207.40.180:7531/modify_room?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&clubid=8581876
        cc.vv.http.sendRequest("/dissolve_daikai_room", tmpObj, onTablePlay);
    },



    //游戏准备状态获取茶楼空闲成员
    getClubIdleMember: function (clubId, callback) {
        var self = this;
        var onIdleMember = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }
        };


        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            clubid: clubId
        };

        //http://123.207.40.180:7531/club_online_users?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&clubid=8581876

        cc.vv.http.sendRequest("/club_online_users", data, onIdleMember);

    },

    //发出邀请请求
    SendPlayGame: function (playid, roomid, callback) {
        var self = this;
        var onIdleMember = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            playid: playid,
            roomid: roomid
        };

        //http://123.207.40.180:7531/invite_play_game?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&playid=100&roomid=100

        cc.vv.http.sendRequest("/invite_play_game", data, onIdleMember);

    },

    getClubShare: function (clubid, callback) {
        var self = this;
        var onIdleMember = function (ret) {

            cc.vv.wc.hide();
            if (ret == null) {
                return;
            }


            if (callback != null) {
                callback(ret);
            }

        };

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            clubid: clubid,
        };

        //http://123.207.40.180:7531/club_share?account=guest_zh2&sign=8821d2545d93f926e65a4f872491da6f&clubid=8581876

        cc.vv.http.sendRequest("/club_share", data, onIdleMember);

    },

});
