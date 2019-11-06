/**
 * Created by hungpq4 on 25/10/2015.
 */

var ScreenSkywar = cc.Layer.extend({
    background:null,
    logo:null,
    _beginPos:0,
    isMouseDown:false,
    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();

        background =cc.Sprite.create("Screen/bg-blue2.png");
        background.setPosition(size.width / 2, size.height / 2);
        this.addChild(background);

        logo = cc.Sprite.create("Screen/game_logo.png");
        logo.setAnchorPoint(0.5, 0);
        logo.setPosition(size.width / 2, 3 * size.height / 4);
        this.addChild(logo);

        var btnCampaign = new ccui.Button("Screen/button1-1.png", "Screen/button1-2.png");
        btnCampaign.setPosition(size.width/2, size.height/2);
        btnCampaign.setScale(1.5);
        btnCampaign.addClickEventListener(this.onSelectCampaign.bind(this));
        this.addChild(btnCampaign);

        var btnBattle = new ccui.Button("Screen/button2-1.png", "Screen/button2-2.png");
        btnBattle.setPosition(size.width/2, size.height/4);
        btnBattle.setScale(1.5);
        this.addChild(btnBattle);
    },
    onSelectCampaign:function(){
        fr.view(GameLayer);
    }
});