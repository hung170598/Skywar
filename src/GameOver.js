/**
 * Created by hungpq4 on 25/10/2015.
 */

var GameOver = cc.Layer.extend({
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

        var Score = new cc.LabelBMFont("Score: 0", "play/arial-14.fnt");
        Score.setString("Score: " + MW.SCORE);
        Score.setPosition(size.width/2, 2*size.height/5 + 200);
        Score.setScale(4);
        this.addChild(Score);

        var btnReplay = gv.commonButton(300, 100, size.width/2, 2*size.height/5, "Replay");
        btnReplay.addClickEventListener(this.onSelectReplay.bind(this));
        this.addChild(btnReplay);

        var btnHome = gv.commonButton(300, 100, size.width/2, 2*size.height/5 - 120, "Home");
        btnHome.addClickEventListener(this.onSelectHome.bind(this));
        this.addChild(btnHome);
    },
    onSelectReplay:function(){
        fr.view(GameLayer);
    },
    onSelectHome: function(){
        fr.view(ScreenSkywar);
    }
});