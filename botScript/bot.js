const botcount =20;
const io = require('socket.io-client');
let poszoom = 300;
let nickname = "[bot]Bob";
let player;
let players = [];
let foods = [];
let indexofplayer = 0;
let color = [200, 200, 200];
let direct = {
    x: 0,
    y: 0
};
const collisionState = {
    sameSize: 0,
    firstPlayerBigger: 1,
    secondPlayerBigger: 2,
    noCollision: 3
}
class Point {
    constructor(velx, vely) {
        bot.x = velx;
        bot.y = vely;
    }
    setMag(c) {
        const Mag = Math.sqrt(bot.x * bot.x + bot.y * bot.y);
        if (bot.x === 0 && bot.y === 0) {
            bot.x = Math.random();
            bot.y = Math.random();
        } else {
            bot.x *= (c / Mag);
            bot.y *= (c / Mag);
        }
    };

    vector(x1, y1, x2, y2) {
        bot.x = x2 - x1;
        bot.y = y2 - y1;
    };
}
class Blob {
    constructor(nickname, x, y, r, c) {
        bot.nickname = nickname;
        bot.x = x;
        bot.y = y;
        bot.r = r;
        bot.c = c;
        bot.isitshown = false;
    }
}
class Player {
    constructor(id, nickname) {
        bot.id = id;
        bot.nickname = nickname;
        bot.blobs = [];
    }

}
class Food {
    constructor(type, x, y, r, id) {
        bot.type = type;
        bot.x = x;
        bot.y = y;
        bot.r = r;
        bot.id = id;
    }
}
class Bot {
    constructor() {
        let bot = this;
        bot.poszoom = 300;
        bot.nickname = "[bot]Bob";
        bot.player;
        bot.players = [];
        bot.foods = [];
        bot.indexofplayer = 0;
        bot.color = [200, 200, 200];
        bot.socket = io('http://localhost:5000');
        bot.direct = {
            x: 0,
            y: 0
        };
        
    }
    senddata() {
        // sending data
        setInterval(() => {
            const data = {
                mousex: bot.direct.x,
                mousey: bot.direct.y,
                zoomsize: bot.poszoom,
                width: 600,
                height: 800,
                c: bot.color,
            };
            bot.socket.emit('updateplayer', data);
        }, 24)
    }
    updatepeeps(pips) {
        bot.players = [];

        pips.forEach((pip, i) => {
            const blobs = [];
            // this for taking all the blobs from pip and store it in this variable
            if (pip.isitok) {
                pip.blobs.forEach(blob => {
                    blobs.push(new Blob(pip.nickname,
                        blob.x,
                        blob.y,
                        blob.r,
                        pip.c));
                });
            }
            // this function for updaing/creating player in the players list
            // with the same index
            bot.players[i] = new Player(pip.id, pip.nickname);
            bot.players[i].isitshown = pip.isitok;
            // this askes if the player is within my range
            if (pip.isitok) {
                bot.players[i].blobs = blobs;
            }
            // this asks wether this player is me
            if (bot.socket.id === pip.id) {
                bot.player = bot.players[i];
                bot.indexofplayer = i;
            }
        });

    }

    updateyamies(yams) {
        bot.foods = [];
        yams.forEach((yam, i) => {
            // show the food if its in range
            if (yam.isitok) {
                bot.foods[i] = new Food(yam.type, yam.x, yam.y, yam.r, yam.id);
                bot.foods[i].type = yam.type;
            }
        });
    }
    ready() {
        bot.player = new Player(bot.socket.id, bot.nickname);
        bot.player.blobs = new Blob();
        // the player sends to the server that he is connected/ready
        const data = {
            color,
            id: bot.socket.id,
            nickname
        };
        bot.socket.emit('ready', data);
        bot.socket.on('updatepipis', bot.updatepeeps);
        bot.socket.on('updateyamies', bot.updateyamies);
    }
    think() {
        // thinking
        setInterval(() => {
            const a = bot.stateZero();
            bot.direct = a;
        }, 1000);
    }
    stateZero() {

        const mouseX = movea[parseInt(Math.random() * 2 + 0)];
        const mouseY = movea[parseInt(Math.random() * 2 + 2)];
        if (!bot.comparisionwiththeclosest()) {
            return {
                x: mouseX,
                y: mouseY
            };
            console.log("state zero")
        } else {
            return bot.stateOne();
        }
    }
    stateOne() {

        if (bot.foods.length > 0) {
            // find the closest food
            bot.comparisionwiththeclosest();
            // go to the food and eat it

            bot.direction = new Point();
            bot.direction.vector(bot.player.blobs[0].x, bot.player.blobs[0].y, bot.foods[0].x + 1000, bot.foods[0].y + 800);
            console.log("state one")
            return bot.direction;
        }
        return bot.stateZero(); //activate state 0
    }
    sendmessage(message) {

        // send what he has typed
        var data = {
            // to: is to who he want to send the message
            // all mean to everyone
            to: 'all',
            nickname: bot.player.nickname,
            message
        };
        bot.socket.emit('chatup', data);
    }

    comparisionwiththeclosest() {
        if (bot.foods.length > 0) {
            debugger
            bot.foods.sort((food1, food2) => {
                debugger
                let dis1 = calculateDis(bot.player.blobs[0].x, bot.player.blobs[0].y, food1.x, food1.y);
                let dis2 = calculateDis(bot.player.blobs[0].x, bot.player.blobs[0].y, food2.x, food2.y);
                return dis2 - dis1;
            });
            return true;
        }
        return false;
    }
}
function calculateDis(x1, y1, x2, y2) {
    const xx = (x1 - x2) * (x1 - x2);
    const yy = (y1 - y2) * (y1 - y2);
    const distance = Math.sqrt(xx + yy);
    return distance;
}

function getCollisionState(player1, player2, minDiff) {
    const distance = calculateDis(player1.x, player1.y, player2.x, player2.y);

    if (distance <= player1.r) {
        if (player1.r > player2.r - minDiff) {
            return collisionState.firstPlayerBigger;
        }
        if (player1.r === player2.r - minDiff) {
            return collisionState.sameSize;
        }
        if (player1.r < player2.r - minDiff) {
            return collisionState.secondPlayerBigger;
        }
    }
    return collisionState.noCollision;
}



const move = [{
    right: 600 / 2 + 100, // x-axes right
    left: 600 / 2 - 100, // x-axes left
    up: 800 / 2 - 100, // y-axes up 
    down: 800 / 2 + 100 // y-axes down
}]
const movea = [
    600 / 2 + 100, // x-axes right
    600 / 2 - 100, // x-axes left
    800 / 2 - 100, // y-axes up 
    800 / 2 + 100 // y-axes down
]

function map(value, minvalue, maxvalue, newminvalue, newmaxvalue) {
    if (minvalue + maxvalue === 0) {
        return value;
    }
    let newvalue = value * (newminvalue) + newmaxvalue;
    newvalue /= (minvalue + maxvalue);
    return newvalue;
}

for(let i = 0;i<botcount;i++) {
    let bot = new Bot();
    bot.ready(); 
}