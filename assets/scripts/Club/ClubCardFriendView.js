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
        
        memberItem: {
            default: null,
            type:cc.Prefab
        },
        memberScroll: {
            default: null,
            type: cc.ScrollView
        },

    },

    // use this for initialization
    onLoad: function () {

        this.init();
    },

    init: function () {

        cc.vv.clubCardFriendView = this;
        this.memberData = null;

        this.listItems = [];

        this.requestMemberList();
    },

    initScroll: function () {
        var content = this.memberScroll.content;
        content.removeAllChildren();
        this.listItems.splice(0, this.listItems.length);
        this.listItems = [];
    },

    initListScroll: function () {
        this.initScroll();

        var listData = this.memberData;
        if (listData == null) {
            return;
        }

        var list_num = listData.length;
        if (list_num <= 0) {
            return;
        }

        var content_height = 0;

        var content = this.memberScroll.content;

        for (var i = 0; i < list_num; i++) {
            var itemData = listData[i];
            itemData.itemIndex = i+1;
            var item = cc.instantiate(this.memberItem);

            var IScript = item.getComponent('MemberItem');
            itemData.isOwner = false;
            itemData.isMyself = (cc.vv.userMgr.userId === itemData.userId) ? true : false;
            
            if (IScript) {
                IScript.init(itemData);
            }

            var itemLength = item.height;
            item.y = -(content_height + itemLength*0.5);
            content_height = content_height + itemLength;
            content.height = content_height;
            content.addChild(item);

            this.listItems.push(item);
        }
    },

    requestMemberList: function () {

        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = 0;

        cc.vv.userMgr.getMemberList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                //数组转换
                this.memberData = [];
                for (let i = 0; i < ret.list.length; i++) {
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    tmpobj.name = new Buffer(ret.list[i].name, 'base64').toString();
                    tmpobj.time = ret.list[i].login_time;
                    tmpobj.state = ret.list[i].online;
                    tmpobj.isClubOwner = (ret.list[i].lv === 10) ? true : false;
                    this.memberData.push(tmpobj);
                }

                // this.memberData = ret;
                //state：登录状态（0：离线状态；1：在线空闲中；2：在线游戏中）
                
                // this.memberData = [
                //     {userId: 100002, name: "小谁说的子", time: "2018/10/01", state: 1},
                //     {userId: 100003, name: "说的", time: "2018/09/02", state: 0},
                //     {userId: 100001, name: "小袍子", time: "2018/10/02", state: 0, isClubOwner: true},
                //     {userId: 100004, name: "发的人人个子", time: "2018/05/22", state: 2},
                //     {userId: 100005, name: "哦提供给", time: "2018/10/03", state: 0},
                //     {userId: 100006, name: "阿诗丹顿", time: "2018/04/13", state: 1},
                //     {userId: 100007, name: "哦提供给", time: "2018/11/03", state: 0},
                //     {userId: 100008, name: "阿诗丹顿", time: "2018/04/23", state: 1},
                // ];
                this.setMemberDataSort(this.memberData);
                this.initListScroll();

            }else {
                var content = "获取成员列表失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    setMemberDataSort: function (data) {
        //排序规则：茶楼主在最上面，其余的按照状态2>1>0，状态相同的按照时间逆序排序

        var dataLength = data.length;
        for (var i = 0; i < dataLength; i++) {
            if (data[i].isClubOwner != null && data[i].isClubOwner == true && i > 0) {
                var dataTest1 = this.getBeReplacedData(data[0]);
                data[0] = this.getBeReplacedData(data[i]);
                data[i] = this.getBeReplacedData(dataTest1);
                break;
            }
        };


        for (var j = 1; j < dataLength-1; j++) {

            for (var k = j+1; k < dataLength; k++) {

                if (data[k].state > data[j].state || (data[k].state == data[j].state && data[k].time > data[j].time)) {
                    var dataTest2 = this.getBeReplacedData(data[j]);
                    data[j] = this.getBeReplacedData(data[k]);
                    data[k] = this.getBeReplacedData(dataTest2);
                }
            };
        };
    },

    getBeReplacedData: function (dataJ) {
        var dataReplace = [];
        for (var key in dataJ) {
            dataReplace[key] = dataJ[key];
        }

        return dataReplace;
    },

    onCloseClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        this.node.destroy();
    },

    getLoginTime: function (Time) {
        var createTime = new Date(Time * 1000)
        var year = createTime.getFullYear()
        var month =(createTime.getMonth() + 1).toString()  
        var day = (createTime.getDate()).toString()
        // var hour = (createTime.getHours()).toString()
        // var minute = (createTime.getMinutes()).toString()
        // var seconds = (createTime.getSeconds()).toString()
        if (month.length == 1) {  
            month = "0" + month
        }  
        if (day.length == 1) {  
            day = "0" + day
        }  
        // if (hour.length == 1) {  
        //     hour = "0" + hour  
        // }  
        // if (minute.length == 1) {  
        //     minute = "0" + minute  
        // }  
        // if (seconds.length == 1) {
        //     seconds = "0" + seconds
        // }
        var timeString = year + "/" + month + "/" + day;
        return timeString;
        
    },

    onDestroy: function () {
        
    }

   
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
