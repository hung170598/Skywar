/**
 * Created by hungpq4 on 25/10/2015.
 */

STATE_PLAYING = 0;
STATE_GAMEOVER = 1;
PLAYER_CENTER_WIDTH = 40;
PLAYER_CENTER_HEIGHT = 40;


var GameLayer = cc.Layer.extend({
    background: null,
    isMouseDown: false,
    _lbLife: null,
    _state:STATE_PLAYING,
    _texTransparentBatch:null,
    _texOpaqueBatch:null,
    _sparkBatch: null,
    ship:null,
    lbScore:null,
    _explosions:null,

    ctor:function(){
        this._super();
        this.init();
    },
    init:function() {
        this._state = STATE_PLAYING;
        MW.SCORE = 0;
        MW.LIFE = 1;

        MW.CONTAINER.ENEMIES = [];
        MW.CONTAINER.ENEMY_BULLETS = [];
        MW.CONTAINER.PLAYER_BULLETS = [];
        MW.CONTAINER.EXPLOSIONS = [];
        MW.CONTAINER.SPARKS = [];
        MW.CONTAINER.HITS = [];
        MW.CONTAINER.BACKSKYS = [];
        MW.CONTAINER.BACKTILEMAPS = [];
        MW.ACTIVE_ENEMIES = 0;


        var size = cc.director.getVisibleSize();
        winSize = cc.director.getVisibleSize();

        var texOpaque = cc.textureCache.addImage("play/textureOpaquePack.png");
        this._texOpaqueBatch = new cc.SpriteBatchNode(texOpaque);
        this._sparkBatch = new cc.SpriteBatchNode(texOpaque);
        if(cc.sys.isNative) this._sparkBatch.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.addChild(this._texOpaqueBatch);
        this.addChild(this._sparkBatch);

        this.lbScore = new cc.LabelBMFont("Score: 0", "play/arial-14.fnt");
        this.lbScore.attr({
            anchorX: 1,
            anchorY: 0,
            x: winSize.width - 5,
            y: winSize.height - 30,
            scale: MW.SCALE
        });
        this.lbScore.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
        this.addChild(this.lbScore, 1000);


        this._lbLife = new cc.LabelTTF("0", "Arial", 20);
        this._lbLife.x = 60;
        this._lbLife.y = MW.HEIGHT - 25;
        this._lbLife.color = cc.color(255, 0, 0);
        this.addChild(this._lbLife, 1000);

        this.background = new cc.Sprite("Screen/map-green.png");
        this.background.setPosition(size.width/2, size.height/2);
        this.addChild(this.background);

        this.ship = new Ship();
        this.ship.setScale(2/3);
        this.addChild(this.ship, this.ship.zOrder, MW.UNIT_TAG.PLAYER);

        cc.spriteFrameCache.addSpriteFrames("play/explosion.plist");
        var explosionTexture = cc.textureCache.addImage("play/explosion.png");
        this._explosions = new cc.SpriteBatchNode(explosionTexture);
        this._explosions.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.addChild(this._explosions);
        Explosion.sharedExplosion();

        if (cc.sys.capabilities.hasOwnProperty('keyboard'))
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:function (key, event) {
                    MW.KEYS[key] = true;
                },
                onKeyReleased:function (key, event) {
                    MW.KEYS[key] = false;
                }
            }, this);
        if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().processEvent(event);
                }
            }, this);

        if(cc.sys.capabilities.hasOwnProperty('touches'))
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMove: function(touches, event){
                    var touch = touches[0];
                    if (this.prevTouchId != touch.getID())
                        this.prevTouchId = touch.getID();
                    else event.getCurrentTarget().processEvent(touches[0]);
                }
            }, this);

        g_sharedGameLayer = this;

        Bullet.preset();
        Enemy.preset();

        this.scheduleUpdate();
        this.schedule(this.bornEnemy, 0.5);


    },
    processEvent:function (event) {
        var size = cc.director.getVisibleSize();
        if (this._state == STATE_PLAYING) {
            var delta = event.getDelta();
            var curPos = cc.p(this.ship.x, this.ship.y);
            curPos = cc.pAdd(curPos, delta);
            curPos = cc.pClamp(curPos, cc.p(0, 0), cc.p(size.width, size.height));
            this.ship.x = curPos.x;
            this.ship.y = curPos.y;
            curPos = null;
        }
    },
    update: function(dt){
        if (this._state == STATE_PLAYING) {
            this.checkIsCollide();
            this.checkGameOver();
            this.updateUI();
        }
    },
    checkIsCollide: function() {
        var selChild, bulletChild;
        var i, locShip =this.ship;
        for (i = 0; i < MW.CONTAINER.ENEMIES.length; i++) {
            selChild = MW.CONTAINER.ENEMIES[i];
            if (!selChild.active)
                continue;

            for (var j = 0; j < MW.CONTAINER.PLAYER_BULLETS.length; j++) {
                bulletChild = MW.CONTAINER.PLAYER_BULLETS[j];
                if (bulletChild.active && this.collide(selChild, bulletChild)) {
                    bulletChild.hurt();
                    selChild.hurt();
                }
            }
            if (this.collide(locShip, selChild)) {
                if (locShip.active) {
                    selChild.HP = 0;
                    locShip.hurt();
                }
            }
        }

        for (i = 0; i < MW.CONTAINER.ENEMY_BULLETS.length; i++) {
            selChild = MW.CONTAINER.ENEMY_BULLETS[i];
            if (selChild.active && this.collide(locShip, selChild)) {
                if (locShip.active) {
                    selChild.hurt();
                    locShip.hurt();
                }
            }
        }
    },
    collide: function(a, b){
        var ax = a.x, ay = a.y, bx = b.x, by = b.y;
        if (Math.abs(ax - bx) > PLAYER_CENTER_WIDTH || Math.abs(ay - by) > PLAYER_CENTER_HEIGHT)
            return false;

        var aRect = a.collideRect(ax, ay);
        var bRect = b.collideRect(bx, by);
        return cc.rectIntersectsRect(aRect, bRect);
    },
    bornEnemy: function(dt){
        var size = cc.director.getVisibleSize();
        if(Math.random() >= 1/4) return;
        var enemy = Enemy.getOrCreate(EnemyType[Math.floor(Math.random() * EnemyType.length)]);
        enemy.x = Math.random() * (size.width - enemy.width) + enemy.width/2;
        enemy.y = size.height;
    },
    checkGameOver: function(){
        if(MW.LIFE <= 0){
            this.onGameOver();
        }
    },
    onGameOver: function(){
        fr.view(ScreenSkywar,0.1);
    },
    updateUI: function(){
        this._lbLife.setString(this.ship.HP + '');
        this.lbScore.setString("Score: " + MW.SCORE);
    }
});

GameLayer.prototype.addExplosions = function (explosion) {
    this._explosions.addChild(explosion);
};

GameLayer.prototype.addBullet = function (bullet, zOrder, mode) {
    this._texOpaqueBatch.addChild(bullet, zOrder, mode);
};

