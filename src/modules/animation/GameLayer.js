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
    _beginPos: 0,
    _state:STATE_PLAYING,
    _texTransparentBatch:null,
    _texOpaqueBatch:null,
    _sparkBatch: null,
    ship:null,


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

        this.background = new cc.Sprite("Screen/map-green.png");
        this.background.setPosition(size.width/2, size.height/2);
        this.addChild(this.background);

        this.ship = new Ship();
        this.ship.setScale(2/3);
        this.addChild(this.ship, this.ship.zOrder, MW.UNIT_TAG.PLAYER);

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
    }
});

