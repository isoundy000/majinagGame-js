if(window.io == null){
    window.io = require("socket-io");
}
 
var Net = cc.Class({
    extends: cc.Component,
    statics: {
        ip:"",
        sio:null,
        isPinging:false,
        fnDisconnect:null,
        handlers:{},
        addHandler:function(event,fn){
            if(this.handlers[event]){
                console.log("event:" + event + "' handler has been registered.");
                return;
            }

            var self = this;
            var handler = function(data){
                // // //console.log(event + "(" + typeof(data) + "):" + (data? data.toString():"null"));
                // if(event != "disconnect" && typeof(data) == "string"){
                //     data = JSON.parse(data);
                // }
                // fn(data);

                try {
                    if(event != "disconnect" && typeof(data) == "string"){
                        data = JSON.parse(data);
                    }
                    fn(data);
                } catch (e) {
                    var dataString = "Error Handler Name: ";
                    var eventStrng = event + "\n";
                    dataString += eventStrng;
                    var nameString = "e.name = " + e.name + "\n";
                    dataString += nameString;
                    var messageString = "e.message = " + e.message + "\n";
                    dataString += messageString;
                    var fileNameString = "e.fileName = " + e.fileName + "\n";
                    dataString += fileNameString;
                    var lineNumberString = "e.lineNumber = " + e.lineNumber + "\n";
                    dataString += lineNumberString;
                    var descriptionString = "e.description = " + e.description + "\n";
                    dataString += descriptionString;
                    var numberString = "e.number = " + e.number + "\n";
                    dataString += numberString;
                    var roomIdstring = 'e.roomId = '+ cc.vv.gameNetMgr.roomId + "\n";
                    dataString += roomIdstring;
                    var userIdstring = 'e.userId = '+ cc.vv.userMgr.userId + "\n";
                    dataString += userIdstring;
                    var stackString = "e.stack = " + e.stack;
                    dataString += stackString;

                    console.log("err dataString: " + dataString);

                    self.send("client_error_msg", dataString);
                }
            };

                        
            this.handlers[event] = handler; 
            if(this.sio){
                console.log("register:function " + event);
                this.sio.on(event,handler);
            }
        },

        // deleteHandlers:function(event){
        //     if(this.handlers[event]){
        //         delete(this.handlers[event] ) 
        //     }
        // },

        

        connect:function(fnConnect,fnError) {
            var self = this;
            
            var opts = {
                'reconnection':false,
                'force new connection': true,
                'transports':['websocket', 'polling']
            }
            this.sio = window.io.connect(this.ip,opts);
            this.sio.on('reconnect',function(){
                console.log('reconnection');
            });
            this.sio.on('connect',function(data){
                if (self.sio) {
                    self.sio.connected = true;
                }
                fnConnect(data);
            });
            
            this.sio.on('disconnect',function(data){
                console.log("----------net------------disconnect");
                if (self.sio) {
                    self.sio.connected = false;  
                }
                self.isPinging = false;
                self.close();
            });
            
            this.sio.on('connect_failed',function (){
                console.log('connect_failed');
                self.reconnectFailed();
            });

            this.sio.on('connect_timeout',function (){
                console.log('connect_timeout');
                self.reconnectFailed();
            });

            this.sio.on('connect_error',function (){
                console.log('connect_error');
                self.reconnectFailed();
            });

            this.sio.on('error',function (){
                console.log('error');
                self.reconnectFailed();
            });
            
            for(var key in this.handlers){
                var value = this.handlers[key];
                if(typeof(value) == "function"){
                    if(key == 'disconnect'){
                        this.fnDisconnect = value;
                    }
                    else{
                        console.log("register:function " + key);
                        this.sio.on(key,value);                        
                    }
                }
            };


            
            this.startHearbeat();
        },
        
        startHearbeat:function(){
            if (!this.sio)
            {
                cc.log("-----------------startHearbeat--------dispatchEvent-----disconnect----------")
                cc.vv.gameNetMgr.dispatchEvent('disconnect');
                return
            }
            
            this.sio.on('game_pong',function(){
                console.log('game_pong');
                self.lastRecieveTime = Date.now();
                self.delayMS = self.lastRecieveTime - self.lastSendTime;
                console.log(self.delayMS);
            });
            this.lastRecieveTime = Date.now();
            var self = this;
           // console.log(1);
            cc.log("---------开启心跳-------");
            cc.log("-----------!self.isPinging: ", !self.isPinging);
            if(!self.isPinging){
                self.isPinging = true;
                cc.game.on(cc.game.EVENT_HIDE,function(){
                    self.ping();
                });

                self.endInterval();
                self.pingID = setInterval(function(){
                    if(self.sio){
                        self.ping();                
                    }
                }.bind(this),3000);
                self.pingID2 = setInterval(function(){
                    console.log('pingID2')
                    if(self.sio){
                        if(Date.now() - self.lastRecieveTime > 10000){
                            self.close();
                        }         
                    }
                }.bind(this),500);

               
            }   
        },
        send:function(event,data){

            if (this.sio)
            {
                if(this.sio.connected){
                    if(data != null && (typeof(data) == "object")){
                        data = JSON.stringify(data);
                        //console.log(data);              
                    }
                    this.sio.emit(event,data);                
                }
            }
        },
        
        ping:function(){
            if(this.sio){
                console.log('send ping')
                this.lastSendTime = Date.now();
                this.send('game_ping');
            }
        },
        
        // 关闭当前sio, 重连方法存在则重连
        close:function(){
            console.log('close');
            this.delayMS = null;
            if(this.sio && this.sio.connected){
                console.log("---------sio ----已经---close---");
                this.sio.connected = false;
                this.sio.disconnect();
            }
            this.sio = null;
            if(this.fnDisconnect){
                this.fnDisconnect();
                this.fnDisconnect = null;
            }else {
                console.log("----------- this.fnDisconnect == null --------");
            }
        },

        reconnectFailed: function () {
            
            if (cc.vv.reconnect) {
                var reconnectSio = function () {
                    cc.vv.reconnect.reconnectFn();
                }

                cc.vv.reconnect.node.on('disconnect', reconnectSio);
            }

            if(this.fnDisconnect == null){
                this.fnDisconnect = this.handlers['disconnect'];
            }
            
            this.close();
        },
        
        test:function(fnResult){
            var xhr = null;
            var fn = function(ret){
                fnResult(ret.isonline);
                xhr = null;
            }
            
            var arr = this.ip.split(':');
            var data = {
                account:cc.vv.userMgr.account,
                sign:cc.vv.userMgr.sign,
                ip:arr[0],
                port:arr[1],
            }
            xhr = cc.vv.http.sendRequest("/is_server_online",data,fn);
            setTimeout(function(){
                if(xhr){
                    xhr.abort();
                    fnResult(false);                    
                }
            },1500);
            /*
            var opts = {
                'reconnection':false,
                'force new connection': true,
                'transports':['websocket', 'polling']
            }
            var self = this;
            this.testsio = window.io.connect(this.ip,opts);
            this.testsio.on('connect',function(){
                console.log('connect');
                self.testsio.close();
                self.testsio = null;
                fnResult(true);
            });
            this.testsio.on('connect_error',function(){
                console.log('connect_failed');
                self.testsio = null;
                fnResult(false);
            });
            */
        },

        /*新加入*/

        deleteHandlers: function (event) {
            if (event == 'disconnect') {
                this.fnDisconnect = null;
            }

            if (this.handlers[event]) {
                console.log(this.handlers)
                delete (this.handlers[event])
            }
        },



        endInterval: function () {
           
            this.lastRecieveTime = Date.now();
            if (this.pingID !== null) {
                clearInterval(this.pingID);
            }
            if (this.pingID2 != null) {
                clearInterval(this.pingID2)
            }

        },

       
       
        endActiveSocket: function () {

            if (cc.vv.net.sio) {
                cc.vv.net.sio.disconnect();
                cc.vv.net.sio = null;
            }

            if (this.sio) {
                this.sio.connected = false;  
            }   
            this.close();

            if (cc.vv.net) {
                cc.vv.net.isPinging = false;
                cc.vv.net.endInterval();
                cc.vv.net.fnDisconnect = null;

            }

        },

        endSocket: function () {

            //cc.vv.alert.show('断SOCKET')

            if (cc.vv.net) {

                cc.vv.net.endInterval();
                cc.vv.net.fnDisconnect = null;
                cc.vv.net.isPinging = false;

            }

            if (cc.vv.net.sio) {
                cc.vv.net.sio.disconnect();
                cc.vv.net.sio = null;
            }

        },


    },
});