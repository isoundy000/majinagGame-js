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
        _chatRoot:null,
        _tabQuick:null,
        _tabEmoji:null,
        _iptChat:null,
        
        _quickChatInfo:null,
        _btnChat:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        cc.vv.chat = this;
        
        this._btnChat = this.node.getChildByName("btn_chat");
        this._btnChat.active = (cc.vv.replayMgr.isReplay() == false || cc.vv.PKReplayMgr.isReplay() == false);
    
        
        this._chatRoot = this.node.getChildByName("chat");
        this._chatRoot.active = false;
        
        this._tabQuick = this._chatRoot.getChildByName("quickchatlist");
        this._tabEmoji = this._chatRoot.getChildByName("emojis");
        
        this._iptChat = this._chatRoot.getChildByName("iptChat").getComponent(cc.EditBox);
        
        this._allQuickChatInfo = {
            "Mandarin": {
                "Man": {
                    "item0" : {index:0,content:"出啊，好牌留着存银行啊！",sound:"fix_msg_1.mp3"},
                    "item1" : {index:1,content:"快点吧，我等的花儿都谢了！",sound:"fix_msg_2.mp3"},
                    "item2" : {index:2,content:"没梦游吧，都在等你那。",sound:"fix_msg_3.mp3"},
                    "item3" : {index:3,content:"这么慢，你是属蜗牛的吧。",sound:"fix_msg_4.mp3"},
                    "item4" : {index:4,content:"哈哈哈，胡牌胡到手软了。",sound:"fix_msg_5.mp3"},
                    "item5" : {index:5,content:"财运来的时候，真是挡也挡不住啊。",sound:"fix_msg_6.mp3"},
                    "item6" : {index:6,content:"牌这么好，想输都难那！",sound:"fix_msg_7.mp3"},
                    "item7" : {index:7,content:"哎，一手烂牌臭到底！",sound:"fix_msg_8.mp3"},
                    "item8" : {index:8,content:"辛辛苦苦二十年，一把输到解放前！",sound:"fix_msg_9.mp3"},
                    "item9" : {index:9,content:"你们是一伙的吧。",sound:"fix_msg_10.mp3"},
                    "item10" : {index:10,content:"呦，牌技不错嘛！",sound:"fix_msg_11.mp3"},
                    "item11" : {index:11,content:"你的牌打的真好，让我意乱神迷了！",sound:"fix_msg_12.mp3"},

                },
                "Woman": {
                    "item0" : {index:0,content:"快点啊，都等到我花儿都谢了！",sound:"fix_msg_1.mp3"},
                    "item1" : {index:1,content:"怎么又断线了，网络怎么这么差啊！",sound:"fix_msg_2.mp3"},
                    "item2" : {index:2,content:"不要走，决战到天亮！",sound:"fix_msg_3.mp3"},
                    "item3" : {index:3,content:"你的牌打得也太好了！",sound:"fix_msg_4.mp3"},
                    "item4" : {index:4,content:"你是妹妹还是哥哥啊？",sound:"fix_msg_5.mp3"},
                    "item5" : {index:5,content:"和你合作真是太愉快了！",sound:"fix_msg_6.mp3"},
                    "item6" : {index:6,content:"大家好，很高兴见到各位！",sound:"fix_msg_7.mp3"},
                    "item7" : {index:7,content:"各位，真是不好意思，我得离开一会儿。",sound:"fix_msg_8.mp3"},
                    "item8" : {index:8,content:"不要吵了，专心玩游戏吧！",sound:"fix_msg_9.mp3"}
                }
                
            },
            "Dialect": {
                "Man": {
                    "item0" : {index:0,content:"别走啊，在玩会儿啊！",sound:"fix_msg_1.mp3"},
                    "item1" : {index:1,content:"快点吧，都等不见你了！",sound:"fix_msg_2.mp3"},
                    "item2" : {index:2,content:"啥破网又掉线了啊！",sound:"fix_msg_3.mp3"},
                    "item3" : {index:3,content:"呦，这牌可以啊！",sound:"fix_msg_4.mp3"},
                    "item4" : {index:4,content:"真个牌真背一个胡都没有！",sound:"fix_msg_5.mp3"},
                },
                "Woman": {
                    "item0" : {index:0,content:"别走，再玩一会儿啊！",sound:"fix_msg_1.mp3"},
                    "item1" : {index:1,content:"快点吧，都等不见你了！",sound:"fix_msg_2.mp3"},
                    "item2" : {index:2,content:"啥破网，咋又掉线了啊！",sound:"fix_msg_3.mp3"},
                    "item3" : {index:3,content:"呦，这牌好啊！",sound:"fix_msg_4.mp3"},
                    "item4" : {index:4,content:"这牌真背一个胡都没有！",sound:"fix_msg_5.mp3"},
                }
            }
        }

        this.setChatInfoCount();
    },

    initMyQuickChatInfo: function () {
        var getLName = cc.vv.audioMgr.getLanguageName();
        var getMySName = cc.vv.gameNetMgr.getMySex();
        this._quickChatInfo = this._allQuickChatInfo[getLName][getMySName];
    },
    
    getOtherChatInfo: function (languageType, sexType, index) {
        var otherInfo = this._allQuickChatInfo[languageType][sexType];
        if (this._allQuickChatCount == null || index < 0 || index >= this._allQuickChatCount[languageType][sexType]) {
            return null;
        }
        var key = "item" + index;
        return otherInfo[key];
    },
    
    getQuickChatInfo: function(languageType, sexType, index){
        if (this._allQuickChatCount == null || index < 0 || index >= this._allQuickChatCount[languageType][sexType]) {
            return null;
        }
        var key = "item" + index;
        return this._quickChatInfo[key];  
    },
    
    onBtnChatClicked:function(){
        this.showQuickChatList();
        this._chatRoot.active = true;
    },
    
    onBgClicked:function(){
        this._chatRoot.active = false;
    },
    
    onTabClicked:function(event){
        if(event.target.name == "tabQuick"){
            this._tabQuick.active = true;
            this._tabEmoji.active = false;
        }
        else if(event.target.name == "tabEmoji"){
            this._tabQuick.active = false;
            this._tabEmoji.active = true;
        }
    },
    
    onQuickChatItemClicked:function(event){
        this._chatRoot.active = false;
        var info = this._quickChatInfo[event.target.name];

        var getLName = cc.vv.audioMgr.getLanguageName();
        var getSName = cc.vv.gameNetMgr.getMySex();
        var chatData = {
            languageType: getLName,
            sexType: getSName,
            index: info.index
        };
        cc.vv.net.send("quick_chat",chatData); 
    },
    
    onEmojiItemClicked:function(event){
        console.log(event.target.name);
        this._chatRoot.active = false;
        cc.vv.net.send("emoji",event.target.name);
    },
    
    onBtnSendChatClicked:function(){
        this._chatRoot.active = false;
        if(this._iptChat.string == ""){
            return;
        }
        cc.vv.net.send("chat",this._iptChat.string);
        this._iptChat.string = "";
    },

    setChatInfoCount: function () {
        if (this._allQuickChatInfo == null) {
            this._allQuickChatCount = null;
            return;
        }
        this._allQuickChatCount = {};

        for (var languageKey in this._allQuickChatInfo) {
           
            var languageInfo = this._allQuickChatInfo[languageKey];
            this._allQuickChatCount[languageKey] = {};

            for (var sexKey in languageInfo) {

                var itemInfo = languageInfo[sexKey];
                var itemCount = 0;
                for (var itemKey in itemInfo) {
                    if (typeof (itemInfo[itemKey]) === "object") {
                        itemCount++;
                    }
                }
                
                this._allQuickChatCount[languageKey][sexKey] = itemCount;
            }; 
        }
    },

    showQuickChatList: function () {
        this.initMyQuickChatInfo();

        if (this._tabQuick == null) {
            this._tabQuick = this._chatRoot.getChildByName("quickchatlist");
        }

        var content = this._tabQuick.getComponent("cc.ScrollView").content;
        var templateItem = content.children[0];
        var item_height = templateItem.height;
        var content_child_count = content.childrenCount;
        if (content_child_count > 1) {
            content.children.splice(1, (content_child_count-1));
            content.height = item_height;
        }

        var getLName = cc.vv.audioMgr.getLanguageName();
        var getMySName = cc.vv.gameNetMgr.getMySex();
        var localListCount = this._allQuickChatCount[getLName][getMySName];

        if (localListCount <= 0) {
            templateItem.active = false;
            return;
        }else {
            templateItem.active = true;
        }

        for (var i = 0; i < localListCount; i++) {
            var key = "item" + i;
            if (i == 0) {
                templateItem.getChildByName("label").getComponent("cc.Label").string = this._quickChatInfo[key].content;
            }else {
                var addItem = cc.instantiate(templateItem);
                addItem.getChildByName("label").getComponent("cc.Label").string = this._quickChatInfo[key].content;
                addItem.name = key;
                content.addChild(addItem);
            }
        };

        content.height = item_height * localListCount;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
