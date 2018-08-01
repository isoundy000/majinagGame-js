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
        
        headNode: {
            default: null,
            type: cc.Node
        },
        lblContent: {
            default: null,
            type: cc.RichText
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.clubPrompt = this;
        this.node.setLocalZOrder(10);
        this.showView(false);
    },

    showView: function (isShow) {
        this.node.active = isShow;
    },

    init: function (data) {

        this.promptData = data;

        this.showView(true);

        this.initPlayerInfo();
    },

    initPlayerInfo: function () {
        var headLoader = this.headNode.getComponent("ImageLoader");
        if(headLoader && this.promptData.userId && this.promptData.userId > 0){
            headLoader.setUserID(this.promptData.userId);
        }

        var playString = this.getGamePlay(this.promptData.conf);
        //+ this.promptData.tableId.toString() + "号桌。"
        var contentString = "<color=#ff7a00>" + this.promptData.invateName + "</c>" + "<color=#363636>" + "邀请您加入" + "</color>" + "<color=#d600ff>" + this.promptData.clubName + "</color>" + "<color=#363636>" + "茶楼."  + playString + "</color>";
        this.lblContent.string = contentString;
    },



    getGamePlay: function (conf) {

        var strArr = [];
        if (conf && conf.maxGames!=null) {
            
            if(typeof(conf.opType) === 'string' ){
                conf.opType = parseInt(conf.opType)
            }

            if (conf.opType == 1) {
                strArr.push("凉城玩法: ");
            }else if (conf.opType == 2) {
                strArr.push("保定玩法: ");
            }else if(conf.opType ==4){
                if(conf.issj){
                    strArr.push('推到胡玩法');
                }else{
                    strArr.push('国耀麻将');
                }
            }else if(conf.opType == 10){
                strArr.push("斗地主玩法: ")
            }

            if (conf.nSeats && conf.nSeats > 0) {
                strArr.push(conf.nSeats + "人")
            }

            strArr.push(", " + conf.maxGames + "局");

            // var gemsNum = 0;
            // if (conf.quan == true && conf.maxGames == 2) {
            //     gemsNum = 3;
            // }else if (conf.quan == true && conf.maxGames == 4) {
            //     gemsNum = 4;
            // }else if (conf.quan == true && conf.maxGames == 8) {
            //     gemsNum = 5;
            // }else if (conf.maxGames == 4) {
            //     gemsNum = 2;
            // }else if (conf.maxGames == 8) {
            //     gemsNum = 3;
            // }else if (conf.maxGames == 12) {
            //     gemsNum = 4;
            // }

            // //var gemsString = "(" + gemsNum.toString() + "张房卡)";

            //strArr.push(gemsString);

            if(conf.opType!==4) {


                switch (conf.reset_count) {
                    case 1:
                        strArr.push("一局选漂");
                        break;
                    case 4:
                        strArr.push("四局选漂");
                        break;
                }
            }

            if (conf.opType == 1) {

                if (conf.daifeng) {
                    strArr.push("带风");
                }

                switch (conf.hunCount) {
                    case 1:
                        strArr.push("单混(下)");
                        break;
                    case 2:
                        strArr.push("2混(上下)");
                        break;
                    case 3:
                        strArr.push("3混(上中下)");
                        break;
                }
                
            }else if (conf.opType == 2) {

                if (conf.dianpaopei) {
                    strArr.push("大包");
                }

                switch (conf.fengding) {
                    case 1:
                        strArr.push("32封顶");
                        break;
                    case 2:
                        strArr.push("64封顶");
                        break;
                    case 3:
                        strArr.push("不限");
                        break;
                }

            }else if(conf.opType == 3){
                if(conf.zha){
                    strArr.push('炸翻倍')
                }
            }else if(conf.opType===4){
                if(conf.dpb3j){
                    strArr.push('点炮包三家');
                }
                if(conf.paoType){
                    strArr.push('带飘');
                }
                if(conf.daifeng){
                    strArr.push('带风');
                }
                if(conf.daihun){
                    strArr.push('带混');
                }
                if(!conf.pinghu && !conf.issj){
                    strArr.push('大胡');
                }
                if(conf.fanpai && conf.fanpai === 2){
                    strArr.push('抓二鸟');
                }else if(conf.fanpai && conf.fanpai === 4){
                    strArr.push('抓四鸟');
                }else if(conf.fanpai && conf.fanpai === 6){
                    strArr.push('抓六鸟');
                }else if(!conf.issj)
                strArr.push('不抓鸟');
            } else if(conf.opType == 10){
                if(conf.daiti){
                    strArr.push('带踢');
                }
            }

            if (conf.fangzuobi) {
                strArr.push(", 开启GPS");
            }

            strArr.push(".");

            return strArr.join("");
        }

        return "";
    },

    onJoinClicked: function () {
        //cc.log("加入");
        cc.vv.userMgr.enterRoom(this.promptData.roomid)
    },

    onCancalClicked: function () {
        //cc.log("取消");
        this.showView(false);
    },

   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
