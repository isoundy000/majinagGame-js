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
        _reconnect: null,
        _focusBtn: null,
        _lblTip: null,
        _timeoutObj: null,
        _lastPing: 0,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.vv) {
            cc.vv.hallreconnect = this;
        }

        this._reconnect = cc.find("Canvas/reconnect");
        this._lblTip = cc.find("Canvas/reconnect/tip").getComponent(cc.Label);
        this._focusBtn = cc.find("Canvas/reconnect/btnFocusConnet");
        cc.vv.utils.addClickEvent(this._focusBtn,this.node,"ReConnect","onClickedFouceBtn");
        this._focusBtn.active = false;
        var self = this;

        var fnTestServerOn = function () {
            cc.vv.net_hall.test(function (ret) {
                if (ret) {
                    self.cleanTimeout();
                    
                    cc.vv.gameNetMgr = cc.vv.hallgameNetMgr;

                    //cc.vv.userMgr.login();
                    cc.vv.hallgameNetMgr.createHallSocket();
                    self.node.on('Halldisconnect',fn);

                    if (cc.vv.global._space === 'hallClub') {
                        cc.vv.clubview.reConnectRes();
                    }                    
              
                }
                else {
                    // self.cleanTimeout();
                    // self._timeoutObj = setTimeout(fnTestServerOn, 3000);
                }
            });
        }

        this.reconnectFn = function () {
            cc.vv.http.needHttpReconnect = false;//建立soket的时候，这个控制是否出Http重连的对话

           cc.vv.gameNetMgr.clearHandlers();
          
            cc.vv.hallgameNetMgr.clearHandlers();
    
            // cc.vv.hallgameNetMgr.init();
            // cc.vv.hallgameNetMgr.initHandlers();
           
            if (this.node == null) {
                return;
            }
            this.node.off('Halldisconnect', fn);
            
            //this.regDisconnect(false);
            this._reconnect.active = true;

            self._timeoutObj = setInterval(fnTestServerOn,3000);

       
            // this.cleanTimeout();
            // fnTestServerOn();
        };

        var fn = function (data) {
            setTimeout(function () {
                if (cc.vv.global._space === 'hall' ||cc.vv.global._space === 'hallClub'||cc.vv.global._space === 'hallDaiKai') {
                    this.reconnectFn();
                }
            }.bind(self), 2000);
        };
          
      
        this.node.on('game_finished', function () {
            self._reconnect.active = false;
            cc.vv.gameNetMgr.setSeatOnline(true);
            self.node.on('Halldisconnect', fn);
        });
        this.node.on('Halldisconnect', fn);
        //this.regDisconnect(true);
    },

   
    cleanTimeout: function () {
        if (this._timeoutObj != null) {
            clearTimeout(this._timeoutObj);
        }
        this._timeoutObj = null;
    },

    onClickedFouceBtn: function () {
        var net = cc.vv.net_hall;
        if(net.sio && net.sio.connected){
            net.sio.connected = false;
            net.sio.disconnect();
        }
        net.sio = null;
        this.reconnectFn();

        this._focusBtn.active = false;
        this._lastPing = 0;
    },

    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this._reconnect.active) {
            
            var t = Math.floor(Date.now() / 1000) % 4;
            this._lblTip.string = "正在对接大厅数据";
            for(var i = 0; i < t; ++ i){
                this._lblTip.string += '.';
            }

            if (cc.vv.net_hall.sio && cc.vv.net_hall.sio.connected == true) {
                this._reconnect.active = false;               
            }

            if (this._lastPing >= 10) {
                //this._focusBtn.active = true;
            }else {
                this._lastPing += dt;
            }
        }
    },

    onDestroy:function(){
        console.log("HallReconnect onDestroy");
        if(cc.vv && cc.vv.hallreconnect){
            this.cleanTimeout();
            cc.vv.hallreconnect = null;  
        }
    }
});
