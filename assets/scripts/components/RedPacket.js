cc.Class({
    extends: cc.Component,

    properties: {
        redScrollView: cc.ScrollView,
        cell: cc.Node
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
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.redpacket = this;
    },
    start:function(){
        this.getActivityInfo();
    },
    getActivityInfo: function () {
        console.log("mengdong getActivityInfo");
        var self = this;
        cc.vv.userMgr.getActivity(function (data) {
            if (!data) {
                return;
            }
           // console.log("getActivityInfo", data);
            var cardL = self.node.getChildByName("receiveNode").getChildByName("receiveCardL");
            var receiveCard = self.node.getChildByName("receiveNode").getChildByName("receiveCard");
            var receiveCard1=self.node.getChildByName("receiveNode").getChildByName("receiveCard1");
            var receiveRP=self.node.getChildByName("receiveNode").getChildByName("receiveRP");
            var receiveSuccess = self.node.getChildByName("receiveNode").getChildByName("receiveSuccess");
            var receiveFailure = self.node.getChildByName("receiveNode").getChildByName("receiveFailure");
            cardL.active = false;
            receiveRP.active = false;
            receiveCard.active = false;
            receiveCard1.active = false;
            receiveSuccess.active = false;
            receiveFailure.active = false;
            self.node.getChildByName("receiveNode").getChildByName("shareRP").active = false;
            switch (data.status) {
                case 0:
                    self.currentRound = 0;
                    self.rewardRound = data.activity.conf.rule["0"];
                    for (var i = 0; i < data.tongji.length; i++) {
                        if (data.tongji[i].type == 0) {
                            self.currentRound = data.tongji[i].num;
                        }
                    }
                    cardL.active = true;
                    cardL.getComponent(cc.Label).string = self.currentRound + "/" + self.rewardRound + "局,差" + (self.rewardRound - self.currentRound) + "局奖励一个红包，加油哦！";
                  //  console.log("getActivityInfo", data);
                    break;
                case 1:
                    self.node.getChildByName("receiveNode").getChildByName("shareRP").active = false;
                    receiveRP.getComponent(cc.Label).string = "您已有红包一个\n请前往微信公众号：云端世纪 客户中心点击领取红包";
                    receiveRP.active = true;
                    break;
                case 2:
                    receiveSuccess.getComponent(cc.Label).string = "恭喜您，已成功领取红包！";
                    receiveSuccess.active = true;
                    break;
                case 3:
                    receiveFailure.getComponent(cc.Label).string = "抱歉，今天的红包已经领完了，下一次早点哦！";
                    receiveFailure.active = true;
                    break;
                case 4:
                    self.node.getChildByName("receiveNode").getChildByName("shareRP").active = true;
                    receiveCard.getComponent(cc.Label).string = "您已有红包一个,";
                    receiveCard1.getComponent(cc.Label).string = "后即可领取";
                    receiveCard.active = true;
                    receiveCard1.active = true;
                    break;
            }
        });
        this.getRedPacketRecord();
    },

    getRedPacketRecord: function () {
        var self = this;
        cc.vv.userMgr.getAwardsLog(function (data) {
            if (data.errcode == 0) {
               // console.log("getRedPacketRecord", data);
                self.setupRecording(data.list);
            }
        })
    },
    setupRecording: function (data) {
        if (data.length) {
            this.redScrollView.content.removeAllChildren()
            for (var i = 0; i < data.length; i++) {
                var recording = data[i]
                var cloneItem = cc.instantiate(this.cell)
                var contentL = cloneItem.getChildByName("content").getComponent(cc.Label)
                cloneItem.x = 0
                cloneItem.y = -30 * i
                this.redScrollView.content.addChild(cloneItem)
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
                if (hour.length == 1) {
                    hour = "0" + hour
                }
                if (minute.length == 1) {
                    minute = "0" + minute
                }
                var timeStr = hour + ":" + minute;
                var userid = (recording.userid + "").substring(0, 2) + "***" + (recording.userid + '').substr(5, 1);
                if (recording.type == 0 && recording.status == 1) {
                    contentL.string = timeStr + "，玩家" + userid + "领取了一个现金红包";
                }
            }
            this.redScrollView.content.setContentSize(cc.size(this.redScrollView.node.width, 30 * data.length))
        }
    },
    onShareFriendCircleRP: function () {
        setTimeout(function () {
            cc.vv.anysdkMgr.shareRedPack();
        }, 100);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
