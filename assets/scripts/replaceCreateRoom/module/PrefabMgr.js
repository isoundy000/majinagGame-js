
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
    },

    onLoad: function() {
    },

    init: function () {
       this.initData();

       this.loadPrefabs();
    },

    initData: function () {
        this._res = [
            "prefabs/OpenedPlayerInfo",
            "prefabs/OpenedRoomInfo",
            "prefabs/OpenedRoomView",
            "prefabs/OpenRoomRecord",
            "prefabs/OpenedClubRoomInfo",
            //"prefabs/OpenClubRoomRecord",
            "prefabs/PKGame/RoleView",
            "prefabs/PKGame/seat",
            "prefabs/MJGame/FoldMJFocus",
            "prefabs/MJGame/PlayOption",
            "prefabs/PKGame/RoleView",
            "prefabs/PKGame/seat",
            "prefabs/PKGame/ani_bomb",
            "prefabs/PKGame/ani_chuntian",
            "prefabs/PKGame/ani_feiji",
            "prefabs/PKGame/ani_liandui",
            "prefabs/PKGame/ani_roket",
            // "prefabs/PKGame/ani_shengli",
            // "prefabs/PKGame/ani_shibai",
            "prefabs/PKGame/ani_shunzi",
            "prefabs/PKGame/MyPK"
        ];

        this._prefabs = {};
    },

    loadPrefabs: function () {
        
        for (var i = 0; i < this._res.length; i++) {
            var path = this._res[i];

            this.preloadPrefab(path);
        };
    },

    preloadPrefab: function (path) {
        var self = this;
        cc.loader.loadRes(path, function (err, prefab) {
            if(prefab)
            {
                self._prefabs[path] = prefab;
            }
            else
            {
                cc.error(err);

                var loadErrorString = "预制加载有误！";
                if (cc.vv.net) {
                    cc.vv.net.send("client_error_msg", loadErrorString);
                }
                if (cc.vv.alert) {
                    cc.vv.alert.show(loadErrorString);  
                }
                
            }
        })
    },

    getPrefab:function(path)
    {
        return this._prefabs[path]
    }

});