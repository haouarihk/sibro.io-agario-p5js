const botcount = 5;
const io = require('socket.io-client');
let poszoom = 10;
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
function getIndexById(id, array) {
    let indexofar = -1;
    array.forEach((ar, i) => {
      if (ar.id === id) {
        indexofar = i;
      }
    });
    return indexofar;
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
class Bot {
    constructor(index) {
        let bot = this;
        this.poszoom = 300;
        this.nickname = "[bot]Bob" + index;
        this.player;
        this.players = [];
        this.foods = [];
        this.indexofplayer = 0;
        this.color = [200, 200, 200];
        this.direct = {
            x: 0,
            y: 0
        };

    }
    senddata() {
        // sending data
        setInterval(() => {
            const data = {
                mousex: this.direct.x,
                mousey: this.direct.y,
                zoomsize: this.poszoom,
                width: 600,
                height: 800,
                c: this.color,
            };
            this.socket.emit('updateplayer', data);
        }, 50)
    }
    updatepeeps(pips) {
        this.players = [];
        if (!this.player.blobs) {
            this.ready();
        }
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
            this.players[i] = new Player(pip.id, pip.nickname);
            this.players[i].isitshown = pip.isitok;
            // this askes if the player is within my range
            if (pip.isitok) {
                this.players[i].blobs = blobs;
            }
            // this asks wether this player is me
            if (this.socket.id === pip.id) {
                this.player = this.players[i];
                this.indexofplayer = i;
            }
        });

    }

    updateyamies(yams) {
        yams.forEach(yam=> {
            // show the food if its in range
                this.foods.push(new Food(yam.type, yam.x, yam.y, yam.r, yam.id));
        });
    }
    ready() {
        this.socket = io('http://localhost:5000');
        this.player = new Player(this.socket.id, this.nickname);
        this.player.blobs = new Blob();
        // the player sends to the server that he is connected/ready
        const data = {
            color,
            id: this.socket.id,
            nickname
        };
        this.socket.emit('ready', data);
        this.socket.on('set!', (settings) => {
            this.player.id = settings.id;
            this.foods = [];
            settings.foods.forEach(food => {
              this.foods.push(new Food(food.type, food.x, food.y, food.r, food.id))
            });
            this.player.blobs = settings.blobs;
            // listening for thoes when he is connected
            this.socket.on('updatePlayersData', (data) => {
                this.updatepeeps(data)
            });
            this.socket.on('updateyamies', (data) => {
                this.updateyamies(data)
            });
            //this.socket.on('warfeilddata', warfeilddata);
            //socket.on('recivechat', reciveTextChat);
            //socket.on('updateSnacks',updateSnacks);
            this.socket.on('foodeatenEvent',()=> {
                this.killthisfoodwiththatid();});
            // this for an instant kick for the player
            this.socket.on('disconnectThatSoc', () => {
              this.player = null;
              this.players = [];
              this.socket.disconnect();
              console.log('disconnection');
            });
          });

    }
    killthisfoodwiththatid(fooddata) {
        let index = getIndexById(fooddata, this.foods);
      
        if (index !== -1) {
          this.foods.splice(index, 1);
        }
      }
    think() {
        // thinking
        if (this.player) {
            if (this.player.blobs.length === 0) {
                this.socket.disconnect();
                this.ready();
                console.log("reconnecting")
                return;
            }
        }
        setInterval(() => {
            const a = this.stateZero();
            this.direct = a;
        }, 2000);
    }
    stateZero() {

        const mouseX = movea[parseInt(Math.random() * 2 + 0)];
        const mouseY = movea[parseInt(Math.random() * 2 + 2)];

        if (this.comparisionwiththeclosest() === false) {
            return {
                x: mouseX,
                y: mouseY
            };

        } else {
            return this.stateOne();
        }
    }
    stateOne() {

        if (this.foods.length > 0) {
            // find the closest food
            let newfoods = this.comparisionwiththeclosest();
            // go to the food and eat it

            this.direction = new Point();
            this.direction.vector(this.player.blobs[0].x, this.player.blobs[0].y, newfoods[0].x, newfoods[0].y);
            return this.direction;
        }
        return this.stateZero(); //activate state 0
    }
    sendmessage(message) {

        // send what he has typed
        var data = {
            // to: is to who he want to send the message
            // all mean to everyone
            to: 'all',
            nickname: this.player.nickname,
            message
        };
        this.socket.emit('chatup', data);
    }

    comparisionwiththeclosest() {
        if (this.foods.length > 0) {
            if(this.player.blobs[0]){
            this.foods.sort((food1, food2) => {
                let dis1 = calculateDis(this.player.blobs[0].x, this.player.blobs[0].y, food1.x, food1.y);
                let dis2 = calculateDis(this.player.blobs[0].x, this.player.blobs[0].y, food2.x, food2.y);
                return dis1 - dis2
            });
            return this.foods;
        }}
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

for (let i = 0; i < botcount; i++) {
    let bot = new Bot(i);
    bot.ready();
    bot.think();
    bot.senddata();
}