
cc.Class({
    extends: cc.Component,

    properties: {
        _roomPeople:null,
        _roomType:null,
      
    },

    init:function(){
        this._roomPeople = 0;
        this._roomType = 0;
        console.log("SelectRoom.js+++++++++++++++++")

  
    },

    setRoomType: function (n) {
        var tmpn = n
        
        if(typeof(n) == 'string'){
            tmpn = parseInt(n)
        }
        
        this._roomType = tmpn;

    },

    getRoomType: function (n) {
        return this._roomType;
    },

    setRoomPeople:function(n){
        this._roomPeople = n;
        console.log("setRoomPeople+++++++++++++++++++"+n);
    },

    getRoomPeople:function(){
        return this._roomPeople;
    },

    setScence: function () {
        if(cc.vv.replayMgr.isReplay()==true || cc.vv.PKReplayMgr.isReplay()==true){
            cc.vv.net_hall.endSocket();
            cc.vv.net.endSocket();
            cc.vv.net_hall.isPinging = false;
            cc.vv.net.isPinging = false;
        }

        var roomPeople = this._roomPeople;
        var roomType = this._roomType;

        if (roomPeople !== null) {
            if (roomType === 10) {
                cc.director.loadScene("pkgame");
                cc.vv.PKlogic.nseat = this._roomPeople;
                         
            } else {

                if (roomPeople === 2) {
                    cc.director.loadScene("mjgame_2ren");

                } else if (roomPeople === 3) {
                    cc.director.loadScene("mjgame_3ren");
                } else if (roomPeople === 4) {
                    cc.director.loadScene("mjgame");
                }

            }
        }

       
    },  

    getLocalIndex: function (index) {
        
        
        var getNumOfPeople = function () {
            if (cc.vv.replayMgr.isReplay() == true || cc.vv.PKReplayMgr.isReplay() == true) {
                var count = cc.vv.gameNetMgr.seats.length;
            } else {
                var count = 4;
                if (cc.vv.gameNetMgr.conf.nSeats && cc.vv.gameNetMgr.conf.nSeats > 0) {
                    count = cc.vv.gameNetMgr.conf.nSeats;
                }
                
            }
            return count;
        };

        var PKgetLocalIndex = function (index) {
            var ret = 0; 
            var count = getNumOfPeople();
            var ret=(index-cc.vv.gameNetMgr.seatIndex+count)%count;
            return ret;
        }

        if(this._roomType ===10){
            ret = PKgetLocalIndex(index)
            
        } else {
            var count = getNumOfPeople();
            var ret = (index - cc.vv.gameNetMgr.seatIndex + count) % count;
            if (count == 2 && ret == 1) {
                ret++;
            } else if (count == 3 && ret == 2) {
                ret++;
            }
        }

        return ret;
    },


    initFolds:function(that){
        console.log("+++++++++++++++++++initFolds+++++++++++++++");
                
      //  console.log(that);
      //  console.log(Folds)
        var roomPeople = this._roomPeople;
        if (roomPeople !== null){
            if (roomPeople === 2){
                Folds.initView_two();
            }else if(roomPeople === 3){
                
            }else if(roomPeople === 4){
                Folds.initView();
            }
        }
      
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
