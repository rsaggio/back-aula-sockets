class Player {
    constructor(id, socket) {
        let colors = ['red', 'pink', 'blue', 'gray', 'black'];
        this.type = 'player',
        this.id = id,
        this.x = Math.floor(Math.random() * 400),
        this.y = 100 + Math.floor(Math.random() * 300),
        this.size = 30,
        this.color = colors[Math.floor(Math.random() * 5)],
        this.speed = 5
        this.socket = socket
        this.lastDirection = null
    }
    
    collide(target) {
        if(target.type == 'bullet') {
            this.socket.emit('die');
        }
    }

    update() {

    }

    serialize() {
        return {
            type: 'player',
            id : this.id,
            x: this.x,
            y: this.y,
            size : 30,
            color: this.color,
            speed : 5
        }
    }
}

module.exports = Player