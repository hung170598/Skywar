

var Ship = cc.Sprite.extend({
    speed:300,
    bulletSpeed: 900,
    HP:3,
    bulletTypeValue:1,
    bulletPowerValue:1,
    zOrder:3000,
    active: true,
    maxBulletPowerValue:4,

    ctor:function(){
        this._super("play/Player 1-1.png");
        this.setPosition(MW.WIDTH/2, MW.HEIGHT/2);
        this.scheduleUpdate();
        this.schedule(this.shoot, 1/8);
    },
    update:function(dt){

        if ((MW.KEYS[cc.KEY.w] || MW.KEYS[cc.KEY.up]) && this.y <= cc.director.getVisibleSize().height) {
            this.setPosition(this.getPosition().x, this.getPosition().y + dt * this.speed);
        }
        if ((MW.KEYS[cc.KEY.s] || MW.KEYS[cc.KEY.down]) && this.y >= 0) {
            this.setPosition(this.getPosition().x, this.getPosition().y - dt * this.speed);
        }
        if ((MW.KEYS[cc.KEY.a] || MW.KEYS[cc.KEY.left]) && this.x >= 0) {
            this.setPosition(this.getPosition().x - dt * this.speed, this.getPosition().y );
        }
        if ((MW.KEYS[cc.KEY.d] || MW.KEYS[cc.KEY.right]) && this.x <= cc.director.getVisibleSize().width) {
            this.setPosition(this.getPosition().x + dt * this.speed, this.getPosition().y );
        }
        if(this.HP<=0) this.destroy();
    },

    shoot: function (dt) {
        var bullet = Bullet.getOrCreateBullet("play/Player 1-dan 1.png", MW.ENEMY_ATTACK_MODE.NORMAL, 3000, MW.UNIT_TAG.PLAYER_BULLET);
        bullet.x = this.x;
        bullet.y = this.y + this.height/2;
    },
    destroy: function(){
        this.active = false;
        this.visible = false;
        MW.LIFE--;
    },
    hurt:function(){
        this.HP--;
    },
    collideRect:function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(x - w / 2, y - h / 2, w, h);
    }
});

