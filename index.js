const Bullet = require('./models/Bullet.js');
const Player = require('./models/Player.js');
const app = require('express')();
const http = require('http').Server(app)
const io = require("socket.io")(http, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
})

let nextid = 0
let gameObjects = []

function shoot(player) {
    let newBullet = new Bullet(++nextid, player)
    gameObjects.push(newBullet)
}

io.on('connect', (socket) => {
    let newPlayer = new Player(++nextid, socket)

    gameObjects.push(newPlayer)

    socket.emit('player-id', newPlayer.id)
    
    socket.on('disconnect', () => {
        gameObjects = gameObjects.filter( player => {
            return player.id != newPlayer.id
        })
    })

    socket.on('player-move', (movementData) => {

        player = gameObjects.filter( currentPlayer => {

            return currentPlayer.id == movementData.playerId 
        })

        player = player[0];

        switch(movementData.key) {
            case 'w':
                player.y -= player.speed;
                if(player.y < 0) player.y = 0;
                break;
            case 's':
                player.y += player.speed;
                if(player.y + player.size > 600) player.y = 600 - player.size;
                break;
            case 'd':
                player.x += player.speed;
                player.lastDirection = 1;
                if(player.x + player.size > 800) player.x = 800 - player.size;
                break;
            case 'a':
                player.x -= player.speed;
                player.lastDirection = -1;
                if(player.x < 0) player.x = 0;
                break;
            case ' ':
                shoot(player)
                break
        }

    })
})


function checkCollision() {
    gameObjects.forEach(gameObject => {
        gameObjects.forEach(target => {
            let horizontal = gameObject.x > target.x && gameObject.x < target.x + target.size;
            let vertical = gameObject.y > target.y && gameObject.y < target.y + target.size;
            
            if(horizontal && vertical) {
                gameObject.collide(target)
                target.collide(gameObject)
                console.log("colidiu alguma coisa")
            }
        })
    })
}
setInterval(() => {
    checkCollision()
    let gameData = [];
    gameObjects.forEach(gameObject => {
        gameObject.update()
        gameData.push(gameObject.serialize())
    })
    io.emit('render', gameData);
}, 16)

http.listen(3000, () => {
    console.log("Servidor está de pé");
})