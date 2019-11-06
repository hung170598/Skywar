var Bullet = cc.Sprite.extend({
    active:true,
    xVel: 0,
    yVel: 500,
    power:1,
    HP:1,
    zOrder:3000,
    attackMode: MW.ENEMY_ATTACK_MODE.NORMAL,
    parentType: MW.BULLET_TYPE.PLAYER,

    ctor:function(weaponType, attackMode){
        this._super("" + weaponType);
        this.attackMode = attackMode;
        this.scheduleUpdate();
    },
    update:function(dt){
        var x = this.x, y = this.y;
        if(x< 0 || y < 0 || x > cc.director.getVisibleSize().width || y > cc.director.getVisibleSize().height || this.HP <= 0){
            this.destroy();
        }
        else{
            this.x = x + this.xVel * dt;
            this.y = y + this.yVel * dt;
        }
    },
    destroy:function(){
        this.active = false;
        this.visible = false;
    },
    hurt:function(){
        this.HP--;
    },
    collideRect:function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    }

});
Bullet.getOrCreateBullet = function (weaponType, attackMode, zOrder, mode) {
    /**/
    var selChild = null;
    if (mode == MW.UNIT_TAG.PLAYER_BULLET) {
        for (var j = 0; j < MW.CONTAINER.PLAYER_BULLETS.length; j++) {
            selChild = MW.CONTAINER.PLAYER_BULLETS[j];
            if (selChild.active == false) {
                selChild.visible = true;
                selChild.HP = 1;
                selChild.active = true;
                return selChild;
            }
        }
    }
    else {
        for (var j = 0; j < MW.CONTAINER.ENEMY_BULLETS.length; j++) {
            selChild = MW.CONTAINER.ENEMY_BULLETS[j];
            if (selChild.active == false) {
                selChild.visible = true;
                selChild.HP = 1;
                selChild.active = true;
                return selChild;
            }
        }
    }
    selChild = Bullet.create(weaponType, attackMode, zOrder, mode);
    return selChild;
};

Bullet.create = function (weaponType, attackMode, zOrder, mode) {
    var bullet = new Bullet( weaponType, attackMode);
    g_sharedGameLayer.addChild(bullet, zOrder, mode);
    if (mode == MW.UNIT_TAG.PLAYER_BULLET) {
        MW.CONTAINER.PLAYER_BULLETS.push(bullet);
    } else {
        MW.CONTAINER.ENEMY_BULLETS.push(bullet);
    }
    return bullet;
};

Bullet.preset = function(){
    var bullet = null;
    for (var i = 0; i < 20; i++) {
        var bullet = Bullet.create("play/Player 1-dan 1.png", MW.ENEMY_ATTACK_MODE.NORMAL, 3000, MW.UNIT_TAG.PLAYER_BULLET);
        bullet.visible = false;
        bullet.active = false;
    }
    //for (var i = 0; i < 20; i++) {
    //    var bullet = Bullet.create("play/Player 1-dan 1.png", MW.ENEMY_ATTACK_MODE.NORMAL, 3000, MW.UNIT_TAG.ENEMY_BULLET);
    //    bullet.visible = false;
    //    bullet.active = false;
    //}
};



