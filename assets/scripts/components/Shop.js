var PayBase = require('PayBase');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
		var shop = this.node.getChildByName('shop');
		shop.active = false;

		var btngem = cc.find('top_left/gemsinfo/bg/gem', this.node);
		cc.vv.utils.addClickEvent(btngem, this.node, 'Shop', 'onBtnGemClicked');
	
		var btnBuy = cc.find('bottom_right/btn_buy', this.node);
		cc.vv.utils.addClickEvent(btnBuy, this.node, 'Shop', 'onBtnShopClicked');

		var btnAddGems = cc.find('top_left/gemsinfo/bg/btnAddGems', this.node);
		cc.vv.utils.addClickEvent(btnAddGems, this.node, 'Shop', 'onBtnShopClicked');

		var btnBack = cc.find('body/btnBack', shop);
		cc.vv.utils.addClickEvent(btnBack, this.node, 'Shop', 'onBtnBackClicked');

		var goods = cc.find('body/goods', shop);
		for (var i = 0; i < goods.childrenCount; i++) {
			var good = goods.children[i];
			cc.vv.utils.addClickEvent(good, this.node, 'Shop', 'onBtnGoodsClicked');
		}

		this._payApi = new PayBase();

		this.requestAgentCount = 0;
    },

    onBtnGemClicked:function(event){
		cc.vv.hall.refreshInfo();
	},

	onBtnGoodsClicked: function(event) {
		console.log('onBtnGoodsClicked');

		// var good = event.target;
		// var info=good.goodsInfo;
		// if(info.type){
		// 	var url=this._payApi.payUrl(cc.vv.userMgr.userId,info.type);
		// 	cc.sys.openURL(url);
		// }
    },

	onBtnShopClicked: function(event) {
		if(true){
			var content = "请联系微信客服";
			cc.vv.alert.show(content);
			return;
		}


		if (this.requestAgentCount == 0) {
            cc.vv.hall.refreshMessage("agent");
            this.requestAgentCount ++;
        }

		var self = this;
		var shop = this.node.getChildByName('shop');

		cc.vv.audioMgr.playButtonClicked();
		// cc.vv.utils.showFrame(shop, 'head', 'body', true);
		cc.vv.utils.showDialog(shop, 'body', true);
      	

		// todo
		// var goods = cc.find('body/goods', shop);
		// self._payApi.goodsList(function(data){
		// 	show(data);
		// });
		// function show(data){
		// 	for (var i = 0; i < goods.childrenCount; i++) {
		// 		var good = goods.children[i];
		// 		var info = data[i] || {};

		// 		var price = cc.find('bgMoney/price', good).getComponent(cc.Label);
		// 		var number = cc.find('cardNum', good).getComponent(cc.Label);

		// 		price.string = '￥' + (info.goods_price || "??");
		// 		number.string = (info.goods_num || "??") + '个';

		// 		good.goodsInfo = info;
		// 	}
		// }


		var goods = cc.find('body/goods', shop);
		var data = [
					{goods_price: 10, goods_num: 10},
					{goods_price: 50, goods_num: 50},
					{goods_price: 100, goods_num: 100}]

		for (var i = 0; i < goods.childrenCount; i++) {
			var good = goods.children[i];
			var info = data[i];

			var price = cc.find('bgMoney/price', good).getComponent(cc.Label);
			var number = cc.find('cardNum', good).getComponent(cc.Label);

			price.string = '￥' + info.goods_price;
			number.string = info.goods_num + '个';

			good.goodsInfo = info;
		}
    },

	onBtnBackClicked: function(event) {
		var shop = this.node.getChildByName('shop');

		cc.vv.audioMgr.playButtonClicked();
	    // cc.vv.utils.showFrame(shop, 'head', 'body', false);
	    cc.vv.utils.showDialog(shop, 'body', false);
    },
});

