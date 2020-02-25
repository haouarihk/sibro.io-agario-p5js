let poszoom = 300;
let nickname = "[bot]Bob";
let player;
let players = [];
let foods = [];
let indexofplayer = 0;
let color = [200, 200, 200];
const brain = require('brain.js');
//const network = new brain.NeuralNetworkGPU();
/*
let savedrad;
let traindata=[];
const collisionState = {
    sameSize: 0,
    firstPlayerBigger: 1,
    secondPlayerBigger: 2,
    noCollision: 3
}
class Point {
    constructor(velx, vely) {
        this.x = velx;
        this.y = vely;
    }
    setMag(c) {
        const Mag = Math.sqrt(this.x * this.x + this.y * this.y);
        if (this.x === 0 && this.y === 0) {
            this.x = Math.random();
            this.y = Math.random();
        } else {
            this.x *= (c / Mag);
            this.y *= (c / Mag);
        }
    };

    vector(x1, y1, x2, y2) {
        this.x = x2 - x1;
        this.y = y2 - y1;
    };
}
class Blob {
    constructor(nickname, x, y, r, c) {
        this.nickname = nickname;
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = c;
        this.isitshown = false;
    }
}
class Player {
    constructor(id, nickname) {
        this.id = id;
        this.nickname = nickname;
        this.blobs = [];
    }

}
class Food {
    constructor(type, x, y, r, id) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.r = r;
        this.id = id;
    }
}

const io = require('socket.io-client');
// or with import syntax
const socket = io('http://localhost:5000');
socket.on('updatepipis', updatepeeps);
socket.on('updateyamies', updateyamies);
player = new Player(socket.id, nickname);
player.blobs = new Blob();
function map(value, minvalue,maxvalue,newminvalue,newmaxvalue){
    if(minvalue + maxvalue === 0) {
        return value;
    }
    let newvalue = value * (newminvalue) + newmaxvalue;
    newvalue/=(minvalue + maxvalue);
    return newvalue;
}
function updatepeeps(pips) {
    players = [];

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
        players[i] = new Player(pip.id, pip.nickname);
        players[i].isitshown = pip.isitok;
        // this askes if the player is within my range
        if (pip.isitok) {
            players[i].blobs = blobs;
        }
        // this asks wether this player is me
        if (socket.id === pip.id) {
            player = players[i];
            player.blobs = players[i].blobs;
            indexofplayer = i;
        }
    });

}

function updateyamies(yams) {
    foods = [];
    yams.forEach((yam, i) => {
        // show the food if its in range
        if (yam.isitok) {
            foods[i] = new Food(yam.type, yam.x, yam.y, yam.r, yam.id);
            foods[i].type = yam.type;
        }
    });
}
socket.on('connect', () => {
    console.log(socket.id); // 'G5p5...'
});
// the player sends to the server that he is connected/ready
const data = {
    color,
    id: socket.id,
    nickname
};
socket.emit('ready', data);
const move = {
    right: 300, // x-axes
    left: 72, // x-axes
    up: 200, // y-axes
    down: 400 // y-axes
}
setInterval(() => {
    if(player.r !== savedrad) {
        const food = comparisionwiththeclosest();
        const dis  = calculateDis(player.x,player.y.food.x.food.y);
        addnuron([{radiousethis:0,
            radiousethat:0,
            playerx:player.x,
            playery:player.y,
            otherx:food.x,
            othery:food.y,
            distance:dis
        }],
        [{  x : mouseX,
            y : mouseY
        }]);
        // reward machine
        savedrad = player.r;
    }
    const a = stateOne();
    network.train(traindata);
    const food = comparisionwiththeclosest();
    const dis  = calculateDis(player.x,player.y.food.x.food.y);
    const result = brain.likely([{radiousethis:0,
        radiousethat:0,
        playerx:player.x,
        playery:player.y,
        otherx:food.x,
        othery:food.y,
        distance:dis}],network);
    
    const data = {
        mousex: result.x,
        mousey: result.y,
        zoomsize: poszoom,
        width: 600,
        height: 800,
        c: color,
    };
    socket.emit('updateplayer', data);
    
}, 50);

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
function sendmessage(message){
    if (inputfeild.value().length > 0) {
        // send what he has typed
        data = {
          // to: is to who he want to send the message
          // all mean to everyone
          to: 'all',
          nickname: player.nickname,
          message: inputfeild.value()
        };
        socket.emit('chatup', data);
      }
}
function stateOne() {
    socket.emit('')
    if (foods.length > 0) {
        // find the closest food
        debugger
        comparisionwiththeclosest();
        debugger
        // go to the food and eat it

        direction = new Point();
        direction.vector(player.x, player.y, foods[0].x, foods[0].y);
        return direction;
    }
    return stateZero(); //activate state 0
}
function stateZero(){
    const mouseX = Math.random() * move.right + move.left;
    const mouseY = Math.random() * move.up + move.down;
    if(!comparisionwiththeclosest()) {
    return {x:mouseX,y:mouseY};
    }
}
function comparisionwiththeclosest() {
    if(foods.length>0){
    debugger
    foods.sort((food1, food2) => {
        debugger
        let dis1 = calculateDis(player.x, player.y, food1.x, food1.y);
        let dis2 = calculateDis(player.x, player.y, food2.x, food2.y);
        return dis2 - dis1;
    });
    return food[0];
    }
    return false;
}
function addnuron(input,output) {
data.push([input,output]);
}
*/

