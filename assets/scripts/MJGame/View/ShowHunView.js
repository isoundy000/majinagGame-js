cc.Class({
    extends: cc.Component,

    properties: {
        _isPlayAction: false,
    },

    // use this for initialization
    onLoad: function () { 
    },

    init: function (isPlayAction) {
        this._isPlayAction = isPlayAction;

        this.setHunMahjong();

        if (isPlayAction == true) {
            this.node.setScale(0.7);
            this.node.setPosition(cc.v2(-555, 250));
        }else {
            this.showAction();
        }
    },

    setHunMahjong: function () {
        var template_hun_mahjong = this.node.children[0];
        this.setMahjongSpriteFrame(template_hun_mahjong, cc.vv.gameNetMgr.showHunMahjongArray[0]);

        var hun_mahjong_count = cc.vv.gameNetMgr.showHunMahjongArray.length;
        for (var i = 1; i < hun_mahjong_count; i++) {
            var hun_mahjong = cc.instantiate(template_hun_mahjong);
            this.setMahjongSpriteFrame(hun_mahjong, cc.vv.gameNetMgr.showHunMahjongArray[i]);
            this.node.addChild(hun_mahjong);
        };
        
    },

    setMahjongSpriteFrame: function (node, id) {
        node.getComponent("cc.Sprite").spriteFrame = cc.vv.controlMgr.getSpriteFrameByMJID("M_",id);
    },

    showAction: function () {
        this.node.stopAllActions();
        this.node.opacity = 0;
        var fade = cc.fadeTo(0.2, 255);
        var scale1 = cc.scaleTo(0.1, 2);
        var delay = cc.delayTime(1);
        var scale2 = cc.scaleTo(0.2, 0.7);
        var move = cc.moveTo(0.2, cc.v2(-555, 250));
        var spawn = cc.spawn(scale2, move);
        var seq = cc.sequence(fade, scale1, delay, spawn);
        this.node.runAction(seq);
    },
});