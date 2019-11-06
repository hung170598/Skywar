

var Enemy = cc.Sprite.extend({
    eID: 0,
    enemyType: 1,
    active: true,
    HP: 1,
    zOrder:1000,
    speed: 200,
    bulletSpeed: 400,
    bulletType: null,
    moveType: null,
    scoreValue: 10,
    attackMode: 0,
    delayTime: 1 + 2 * Math.random(),

    ctor:function(arg){
        this._super(arg.textureName);
        this.setScale(2/3)

        this.HP = arg.HP;
        this.moveType = arg.moveType;
        this.enemyType = arg.type;
        this.bulletType = arg.bulletType;
        this.attackMode = arg.attackMode;
        this.scoreValue = arg.scoreValue;
        this.speed = arg.speed;
        this.bulletSpeed = arg.bulletSpeed;
        this.scheduleUpdate();
    },
    update:function(dt){
        var x = this.getPosition().x;
        var y = this.getPosition().y;
        if(x<0 || x>cc.director.getVisibleSize().width || y > cc.director.getVisibleSize().height || y<0 || this.HP <= 0) {
            this.destroy();
        }
        if(this.moveType == MW.ENEMY_MOVE_TYPE.NORMAL){
            this.y -= this.speed*dt;
        }else if(this.moveType == MW.ENEMY_MOVE_TYPE.NORMAL){

        }
    },
    destroy:function(){
        if(this.HP <= 0) MW.SCORE += this.scoreValue;
        this.visible = false;
        this.active = false;
        this.unschedule(this.shoot);
        MW.ACTIVE_ENEMIES--;
    },
    hurt: function(){
        this.HP--;
    },
    shoot: function(dt){
        if(!this.bulletType) return;
        var x = this.x, y = this.y;
        var b = Bullet.getOrCreateBullet(this.bulletType, this.attackMode, 3000, MW.UNIT_TAG.ENMEY_BULLET);
        b.x = x;
        b.y = y - this.height/2;
    },
    collideRect:function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(x - w / 2, y - h / 4, w, h / 2+20);
    }
});

Enemy.create = function(arg){
    var enemy = new Enemy(arg);
    g_sharedGameLayer.addChild(enemy, enemy.zOrder, MW.UNIT_TAG.ENEMY);
    MW.CONTAINER.ENEMIES.push(enemy);
    return enemy;
};

Enemy.getOrCreate = function(arg){
    var selChild = null;
    for (var j = 0; j < MW.CONTAINER.ENEMIES.length; j++) {
        selChild = MW.CONTAINER.ENEMIES[j];

        if (selChild.active == false && selChild.enemyType == arg.type) {
            selChild.HP = arg.HP;
            selChild.active = true;
            selChild.schedule(selChild.shoot, this.delayTime);
            selChild.visible = true;
            MW.ACTIVE_ENEMIES++;
            return selChild;
        }
    }
    selChild = Enemy.create(arg);
    MW.ACTIVE_ENEMIES++;
    return selChild;
};

Enemy.preset = function () {
    var enemy = null;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < EnemyType.length; j++) {
            enemy = Enemy.create(EnemyType[j]);
            enemy.visible = false;
            enemy.active = false;
            enemy.unschedule(enemy.shoot());
        }
    }
};

