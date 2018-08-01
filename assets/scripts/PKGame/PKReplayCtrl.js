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
        _nextPlayTime:1,
        _replay:null,
        _isPlaying:true,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this._replay = cc.find("Canvas/replay");
        this._replay.active = cc.vv.PKReplayMgr.isReplay();
        var btnPase=this._replay.getChildByName('btn_pause');
        var btnPlay=this._replay.getChildByName('btn_play');
        var btnBack=this._replay.getChildByName('btn_back');
        cc.vv.utils.addClickEvent(btnPase,this.node,'PKReplayCtrl','onBtnPauseClicked');
        cc.vv.utils.addClickEvent(btnPlay,this.node,'PKReplayCtrl','onBtnPlayClicked');
        cc.vv.utils.addClickEvent(btnBack,this.node,'PKReplayCtrl','onBtnBackClicked');
    },
    
    onBtnPauseClicked:function(){
        this._isPlaying = false;
    },
    
    onBtnPlayClicked:function(){
        this._isPlaying = true;
    },
    
    onBtnBackClicked:function(){
        cc.vv.PKReplayMgr.clear();
        cc.vv.pkgameNetMgr.reset();
        cc.vv.pkgameNetMgr.roomId = null;
        cc.vv.pkgameNetMgr.seats = null;
        cc.director.loadScene("hall");
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(cc.vv){
            if(this._isPlaying && cc.vv.PKReplayMgr.isReplay() == true && this._nextPlayTime > 0){
                this._nextPlayTime -= dt;
                if(this._nextPlayTime < 0){
                    this._nextPlayTime = cc.vv.PKReplayMgr.takeAction();
                }
            }
        }
    },
});
