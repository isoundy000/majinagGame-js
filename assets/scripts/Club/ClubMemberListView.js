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
        buttonGroup: {
            default: [],
            type: cc.Node
        },
        titleGroup: {
            default: [],
            type: cc.Node
        },
        listItem: {
            default: [],
            type:cc.Prefab
        },
        listScroll: {
            default: null,
            type: cc.ScrollView
        },

    },

    // use this for initialization
    onLoad: function () {

        this.init();
    },

    init: function () {

        cc.vv.clubmemberlistview = this;
        this.applyData = null;
        this.memberData = null;
        this.blackData = null;

        this.listItems = [];
        this.toggleIndex = 0;

        this.requestApplyList();

        // this.initToggle();
        // this.initScroll();
    },

    initToggle: function () {

        var rbScript = this.buttonGroup[this.toggleIndex].getComponent("RadioButton");
        cc.vv.radiogroupmgr.check(rbScript);

        for (var i = 0, titleCount = this.titleGroup.length; i < titleCount; i++) {
            var isShowTitle = (i == this.toggleIndex)?true:false;
            this.titleGroup[i].active = isShowTitle;
        };

        var applyTop = this.node.getChildByName("applyTop");
        var memberTop = this.node.getChildByName("memberTop");
        if (this.toggleIndex == 0) {
            applyTop.active = true;
            memberTop.active = false;
        }else if (this.toggleIndex == 1) {
            applyTop.active = false;
            memberTop.active = true;
        }else if (this.toggleIndex == 2) {
            applyTop.active = false;
            memberTop.active = false;
        }
    },

    initScroll: function () {
        var content = this.listScroll.content;
        content.removeAllChildren();
        this.listItems.splice(0, this.listItems.length);
        this.listItems = [];
    },

    initListScroll: function (isSearch, searchData) {
        this.initToggle();
        this.initScroll();

        var listData = null;
        if (isSearch == true) {
            listData = searchData;
        }else if (this.toggleIndex == 0) {
            listData = this.applyData;
        }else if (this.toggleIndex == 1) {
            listData = this.memberData;
        }else if (this.toggleIndex == 2) {
            listData = this.blackData;
        }

        if (listData == null) {
            return;
        }

        var list_num = listData.length;
        if (list_num <= 0) {
            return;
        }

        var content_height = 0;

        var content = this.listScroll.content;

        for (var i = 0; i < list_num; i++) {
            var itemData = listData[i];
            itemData.itemIndex = i+1;
            var item = cc.instantiate(this.listItem[this.toggleIndex]);

            var IScript = null;
            if (this.toggleIndex == 0) {
                IScript = item.getComponent('ApplyItem');
            }else if (this.toggleIndex == 1) {
                IScript = item.getComponent('MemberItem');
                itemData.isOwner = true;
            }else if (this.toggleIndex == 2) {
                IScript = item.getComponent('BlackListItem');
                itemData.isOwner = true;
            }

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

    requestApplyList: function () {


        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = 0;


        cc.vv.userMgr.getApplyList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

             
                //state：申请状态（0：按钮显示状态；1：已同意；2：已拒绝）
                // this.applyData = [
                //     {userId: 100001, name: "小袍子", time: "2018/10/02", state: 0},
                //     {userId: 100002, name: "小谁说的子", time: "2018/10/01", state: 1},
                //     {userId: 100003, name: "说的", time: "2018/09/02", state: 0},
                //     {userId: 100004, name: "发的人人个子", time: "2018/05/22", state: 2},
                //     {userId: 100005, name: "哦提供给", time: "2018/10/03", state: 0},
                //     {userId: 100006, name: "阿诗丹顿", time: "2018/04/13", state: 1},
                //     {userId: 100007, name: "哦提供给", time: "2018/10/03", state: 0},
                //     {userId: 100008, name: "阿诗丹顿", time: "2018/04/13", state: 1},
                // ];
                //数组转换
                this.applyData = [];
                for(let i = 0;i<ret.list.length;i++){
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;

                    if(ret.list[i].name !== undefined){
                        tmpobj.name = new Buffer(ret.list[i].name,'base64').toString();  
                    } 
                   // tmpobj.name = new Buffer(ret.list[i].name,'base64').toString();  
                    tmpobj.time = ret.list[i].login_time;
                    tmpobj.state = ret.list[i].status;
                    //tmpobj.isClubOwner =  (ret.list[i].lv === 10 )?true:false;
                    this.applyData.push(tmpobj);
                }



                this.setApplyDataSort(this.applyData);

                this.memberData = null;
                this.blackData = null;

                this.toggleIndex = 0;
                this.initListScroll(false, null);

            }else {
                var content = "获取申请列表失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    requestMemberList: function () {

        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = 0;
        cc.vv.userMgr.getMemberList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                // this.memberData = ret;
                //state：登录状态（0：离线状态；1：在线空闲中；2：在线游戏中）

                //数组转换
                this.memberData = [];
                for(let i = 0;i<ret.list.length;i++){
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    if(ret.list[i].name === undefined){
                        tmpobj.name = ''
                    }else{
                        tmpobj.name = new Buffer(ret.list[i].name,'base64').toString(); 
                    }
                    
                    
                    tmpobj.time = ret.list[i].login_time;
                    tmpobj.state = ret.list[i].online;
                    tmpobj.isClubOwner =  (ret.list[i].lv === 10 )?true:false;
                    this.memberData.push(tmpobj);
                }

                
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

                this.applyData = null;
                this.blackData = null;

                this.toggleIndex = 1;
                this.initListScroll(false, null);

            }else {
                var content = "获取成员列表失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    requestBlackList: function () {

        var clubid = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var lastid = 0;
        cc.vv.userMgr.getBlackList(clubid,lastid,function(ret) {

            if (ret.errcode == 0) {

                this.blackData = [];
                for(let i = 0;i<ret.list.length;i++){
                    var tmpobj = {}
                    tmpobj.userId = ret.list[i].userid;
                    tmpobj.name = new Buffer(ret.list[i].name,'base64').toString(); 
                  
                    this.blackData.push(tmpobj);
                }
               
                // this.blackData = ret;
                // this.blackData = [
                //     {userId: 100001, name: "小袍子"},
                //     {userId: 100002, name: "小谁说的子"},
                //     {userId: 100003, name: "说的"},
                //     {userId: 100004, name: "发的人人个子"},
                //     {userId: 100005, name: "哦提供给"},
                //     {userId: 100006, name: "阿诗丹顿"},
                //     {userId: 100007, name: "哦提供给"},
                //     {userId: 100008, name: "阿诗丹顿"},
                // ];
                this.setBlackDataSort(this.blackData);

                this.applyData = null;
                this.memberData = null;

                this.toggleIndex = 2;
                this.initListScroll(false, null);

            }else {
                var content = "获取黑名单失败!";
                cc.vv.alert.show(content);
            }

        }.bind(this));
    },

    setApplyDataSort: function (data) {
        //排序规则：茶楼主在最上面，其余的按照状态2>1>0，状态相同的按照时间逆序排序

        var dataLength = data.length;
        for (var j = 0; j < dataLength-1; j++) {

            for (var k = j+1; k < dataLength; k++) {

                if (data[k].state < data[j].state || (data[k].state == data[j].state && data[k].time > data[j].time)) {
                    var dataTest2 = this.getBeReplacedData(data[j]);
                    data[j] = this.getBeReplacedData(data[k]);
                    data[k] = this.getBeReplacedData(dataTest2);
                }
            };
        };
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

    setBlackDataSort: function (data) {
        //排序规则：茶楼主在最上面，其余的按照状态2>1>0，状态相同的按照时间逆序排序

        var dataLength = data.length;

        for (var j = 0; j < dataLength-1; j++) {

            for (var k = j+1; k < dataLength; k++) {

                if (data[k].name < data[j].name) {
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

    onApplyListClicked: function () {
        if (this.toggleIndex == 0) {
            return;
        }

        this.requestApplyList();
    },

    onMemberListClicked: function () {
        if (this.toggleIndex == 1) {
            return;
        }

        this.requestMemberList();
    },

    onBlackListClicked: function () {
        if (this.toggleIndex == 2) {
            return;
        }

        this.requestBlackList();
    },

    onInvateClicked: function () {
       
        var clubId = cc.vv.clubview.viewData.clubsInfo.clubInfo.id;
        var clubName = cc.vv.clubview.viewData.clubsInfo.clubInfo.username;
        cc.vv.userMgr.getClubShare(clubId,function(ret){
            if(ret.errcode===0){

                var title = "<国耀棋牌>";
                title = "茶楼ID:" + clubId + " " + title;

                var content = cc.vv.userMgr.userName + "茶楼主邀请您加入" + clubName + "茶楼。";
                cc.vv.anysdkMgr.share_club(title, content, false, ret.url);
            }else{
                cc.vv.alert.show('获取分享链接失败')
            }
        })
       
       
       
    },

    onCloseClicked: function () {
        cc.vv.audioMgr.playButtonClicked();
        this.node.destroy();
    },

    onEditBoxStartClicked: function (event) {

        if (this.memberData == null) {
            return;
        }

        var searchData = this.getSearchData(event.string);
        this.initListScroll(true, searchData);
    },

    onEditBoxChangeClicked: function (event) {

        if (this.memberData == null) {
            return;
        }

        var searchData = this.getSearchData(event);
        this.initListScroll(true, searchData);
    },

    onEditBoxEndClicked: function (event) {

        if (this.memberData == null) {
            return;
        }

        var searchData = this.getSearchData(event.string);
        this.initListScroll(true, searchData);
    },

    getSearchData: function (searchString) {

        var searchData = [];
        var searchLength = searchString.length;

        var memberCount = this.memberData.length;
        for (var i = 0; i < memberCount; i++) {

            var isMatchingSearch = true;
            var memberID = this.memberData[i].userId.toString();
            for (var j = 0; j < searchLength; j++) {
                if (searchString[j] != memberID[j]) {
                    isMatchingSearch = false;
                }
            };

            if (isMatchingSearch == true) {
                searchData.push(this.memberData[i]);
            }
        };

        return searchData;
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
