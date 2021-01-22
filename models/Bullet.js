class Bullet {

    constructor(id, player) {
        this.type =  'bullet';
        this.id =  id;

        if(player.lastDirection > 0) {
            this.x = player.x + player.size;
        }else {
            this.x = player.x;
        }
       
        this.y = player.y + player.size/2,
        this.size = 5,
        this.speed = 5 * player.lastDirection,
        this.alive = true
    }

    collide() {

    }
   
    update() {
        this.x += this.speed
    }

    serialize() {
        return {
            type: this.type,
            id: this.id,
            x: this.x,
            y: this.y,
            size: this.size,
            speed: this.speed,
            alive: this.alive
        }
    }
}

module.exports = Bullet