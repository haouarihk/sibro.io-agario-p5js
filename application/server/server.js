/* eslint-disable linebreak-style */
/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable spaced-comment */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const objppl = [{
    un: 'gx',
    pw: '123456789',
  },
  {
    un: 'wolfpat',
    pw: '123456789',
  },
  {
    un: 'nbstID',
    pw: '123456789',
  }
];
///// Calculators
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


function getIndexById(id, array) {
  let indexofar = -1;
  array.forEach((ar, i) => {
    if (ar.id === id) {
      indexofar = i;
    }
  });
  return indexofar;
}

function getCenterDot(blobs) {

  const center = new Point(0, 0);
  let radiouseSum = 0;
  // the form of room.equation is:
  // g1 = sum((a * Ma) + (b * Mb) + ...) i=>length
  // r = sum(Ma + Mb + ...) i => length
  if (blobs) {
    blobs.forEach(blob => {
      center.x += blob.x * blob.r;
      center.y += blob.y * blob.r;
      radiouseSum += blob.r;
    });
    // g = g1 / (length + r)
    center.x /= (blobs.length) + radiouseSum;
    center.y /= (blobs.length) + radiouseSum;
    // g =
    return center;
  }
  // console.error("There is something wrong with getting the center blob is not defined getCenterDot()");
  return new Point(0, 0);
}

function limitNumberWithinRange(num, min, max) {
  const MIN = min || 1;
  const MAX = max || 20;
  const parsed = parseInt(num);
  return Math.min(Math.max(parsed, MIN), MAX);
}

function getFreeRandomPosition() {
  let collision = true;
  let x = 0;
  let y = 0;

  let tries = 10000;

  while (collision && tries > 0) {
    x = Math.floor(Math.random() * room.worldSizeMax * 2) + room.worldSizeMin;
    y = Math.floor(Math.random() * room.worldSizeMax * 2) + room.worldSizeMin;
    if (room.isItAvaible(x, y)) {
      collision = false;
    }
    tries--;
  }
  if (tries === 0) {
    console.error("World is full!");
  }
  return {
    x,
    y
  }
}
///// Classes
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
class Food {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.type = 0;
    const position = getFreeRandomPosition();
    this.x = position.x;
    this.y = position.y;
    this.id = uniqid();
    this.r = Math.floor(Math.random() * room.maxFoodSize) + room.minFoodSize;
    const kindProbs = [0.8, 0.2];
    let food = this;
    this.type = food.getRandomType(kindProbs) + 1;

  }
  /**
   * Get Random number based on the provided varaibles
   * @param {*} kindProbs 
   * @returns {int} index of selected value
   */
  getRandomType(kindProbs) {
    const winner = Math.random();
    let threshold = 0;
    kindProbs.forEach((kind, i) => {
      threshold += kind
      if (threshold >= winner) {
        return i;
      }
    });
  }
}

class Blob {
  constructor(id, x, y, r, Timer) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.r = r;
    this.id = id;
    this.timertoeatme = Timer;
    this.eatmyself = false;
    this.vel = new Point(0, 0);
  }
  // this function for updating the location
  update(mousex, mousey, width, height) {
    const indexofplayer = getIndexById(this.id, room.players);
    if (indexofplayer !== -1) {
      if (this.timertoeatme <= 0) {
        this.eatmyself = true;
      } else {
        this.eatmyself = false;
      }
      if (this.eatmyself === true) {
        room.players[indexofplayer].blobs.forEach(blob => {
          if (this !== blob) {
            const dis = getCollisionState(this, blob, -blob.r - this.r + 20);
            if (dis === collisionState.firstPlayerBigger) {
              // this blob will eat another blob
              this.r += blob.r;
              room.players[indexofplayer].blobs.splice(i, 1);
              console.log("this has lunched")
            }
          }
        });

      }
      // console.log('wait what ' + indexofplayer);
      const middot = getCenterDot(room.players[indexofplayer].blobs);
      var direction = new Point(
        (mousex - (width / 2)),
        (mousey - (height / 2)));
      // setting the magnitude
      direction.setMag(room.avregePlayerSpeed);
      // moving the blob
      this.x += (direction.x) / this.r;
      this.y += (direction.y) / this.r;

    }

  };

  split() {
    let playerindex = getIndexById(this.id, room.players);
    if (playerindex !== -1) {
      if (room.players[playerindex].id === this.id) {
        room.players[playerindex].blobs.push(new Blob(this.id,
          this.x + 10,
          this.y + 10,
          this.r / 2,
          this.periodTime));
        this.timertoeatme = this.periodTime;
        this.r /= 2;
      }
    }
  };
  constrain() {
    // stop it from going outside of the world
    this.x = limitNumberWithinRange(this.x, room.worldSizeMin, room.worldSizeMax);
    this.y = limitNumberWithinRange(this.y, room.worldSizeMin, room.worldSizeMax);
  };

}
class Player {
  constructor(id, blobs, c, nickname) {
    this.id = id;
    this.c = c;
    this.r = 0;
    this.blobs = blobs;
    this.zoom = 1;
    this.nickname = nickname;
    this.middot = new Point(0, 0);
  }
}
class Room {

  constructor(playersQuantity, foodsQuantity, worldsize) {
    let room = this
    room.players = [];
    room.foods = [];
    // Server
    room.comparisonTimer = 500; // how much to refresh the Top 10 players list
    //
    // Food settings
    room.foodsMaxCount = foodsQuantity || 500; // how manny foods (default 500)
    room.howManyEvrytime = 200; // how much everytime (default 200)
    room.timerForFoodMaker = 200; // how mutch to wait to make another food object (default 200)
    room.maxFoodSize = 300; // how big can the food be (default 300)
    room.minFoodSize = 100; // how small can the food be (default 100)
    //
    // Player Settings
    room.howManyPlayersInThisRoom = playersQuantity || 24;
    room.startingSize = 1200; // in what size the player start with (default 1200)
    room.timerPlayerGetsOld = 5000; // how mutch to wait till his mass gose down (default 5000)
    room.timerPlayersUpdating = 24; // how mutch to wait till the server sends player info (default 24)
    room.avregePlayerSpeed = 60000; // how mutch speed can the player have (default 60000)
    room.minSizeToSplit = 400; // the minimume size for the player to split (default 400)
    room.maxBlobsForEachPlayer = 8; // the maximume number of blobs can the player have (default 8)
    room.minPlayerSize = 200; // the minimume size that can the player be (default 200)
    room.periodTime = 3; // how mutch to end the split (default 3)
    room.periodTimeCounter = 300; // how mutch to end the split 2 (default 300)
    room.zoomView = 8; // how much can the player see the world (default 8)
    //
    // World Settings
    room.worldSize = worldsize || 50000; // how big the world can be (default 50000)
    room.worldSizeMin = -room.worldSize;
    room.worldSizeMax = room.worldSize;


  }
  startListening() {

  }

  updatePlayerRadious() {
    room.players.forEach((player, index, playersArray) => {
      if (player.blobs) {
        player.r = player.blobs.reduce((sum, blob) => blob.r + sum, 0)
      } else {
        player.blobs = []
      }
    })
  }


  comparisionwithweight() {
    if (room.players.length > 1) {
      room.players.sort((player1, player2) => player2.r - player1.r);
    }
  }
  //// Generators
  /**
   * get free random position
   * @returns {{x, y}} return available postion(x,y)
   */


  isItAvaible(x, y) {
    return (!room.isThereAFood(x, y) && !room.isThereAPlayer(x, y));
  }

  isThereAFood(x, y) {
    room.foods.forEach((food) => {
      if (food.x === x && food.y === y) {
        return true;
      }
    });
    return false;
  }

  isThereAPlayer(x, y) {
    room.players.forEach((player) => {
      player.blobs.forEach((blob) => {
        const dist = blob.r - calculateDis(blob.x, blob.y, x, y);
        if ((blob.x === x && blob.y === y) || dist > 0) {
          return true;
        }
      })
    })
    return false;
  }
  ///// Events
  Connection(socket) {
    console.log(`new connection:${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`);
      const i = getIndexById(socket.id, room.players);
      // players.splice(i, 1);
      console.log(`${socket.id} sliced in index of ${i}`);
      socket.emit('disconnectThatSoc');

    });

    function checkNickname(nickname) {
      if (nickname.length > 10) {
        return nickname.substring(0, 9);
      }
      return nickname;
    }
    // When a new player joins
    function newPlayer(playerInfo) {

      const blobs = [];
      const position = new getFreeRandomPosition();
      // creating the player
      blobs.push(new Blob(socket.id, position.x, position.y, room.startingSize, 0));
      room.players.push(new Player(socket.id,
        blobs,
        playerInfo.color,
        checkNickname(playerInfo.nickname)));
      // sending back the info
      const settingsofplayer = {
        blobs,
        id: socket.id,
        minSizeToSplit: room.minSizeToSplit,
      };

      socket.emit('set!', settingsofplayer);
    }

    socket.on('ready', newPlayer);

    function Login(logindata) {
      objppl.forEach(data => {
        if (logindata.user === data.un && logindata.pass === data.pw) {
          adminsID.push(logindata.id);
        }
      });
    }

    socket.on('login', Login);

    // update every blob's velocity
    function updateplayer(uplayer) {
      // updating players list
      room.players.forEach((player, i) => {
        if (player.id === socket.id) {
          room.players[i].blobs.forEach((blob, j) => {
            blob.id = socket.id;
            blob.update(uplayer.mousex,
              uplayer.mousey,
              uplayer.width,
              uplayer.height);
          })
          player.zoom = uplayer.zoomsize;
        }
        // update his middle dot 
        player.middot = getCenterDot(player.blobs);
      })

    }
    socket.on('updateplayer', updateplayer);

    // When a player split
    function splitPlayer() {

      const playerIndex = getIndexById(socket.id, room.players)
      if (playerIndex !== -1) {
        if (room.players[playerIndex].blobs.length < room.maxBlobsForEachPlayer) {
          // Splice
          room.players[playerIndex].blobs.forEach((blob) => {
            if (blob.r > room.minSizeToSplit) {

              blob.split();
            }
          })
        }
      }
    }

    socket.on('split', splitPlayer);

    function onrecivechat(data) {
      let data2 = {
        message: data.message,
        nickname: data.nickname,
        id: socket.id
      };
      if (data.to === 'all') {
        io.emit('recivechat', data2);
        console.log(data2.id + 'sending to all: ' + data.message);
      } else {
        io.to(socket.id).emit('recivechat', data2);
        io.to(data.to).emit('recivechat', data2);

      }
    }
    socket.on('chatup', onrecivechat);
  }
  addFood() {
    for (let i = 0; i < room.howManyEvrytime; i++) {
      if (room.foods.length < room.foodsMaxCount) {
        const food = new Food();
        room.foods.push(food);
      }
    }
    debugger
    // io.sockets.emit('updateyamies', fooddata);
  }
  // there is a problem with room.function
  rediuceRadiusBy(step = 2) {
    room.players = room.players.map(player => {
      player.blobs = player.blobs.map(blob => {
        let blobSize = blob.r - step;
        if (blobSize < room.minPlayerSize) {
          blobSize = room.minPlayerSize;
        }
        debugger
        blob.r = blobSize;
        return {
          blob
        }
      })
      debugger
      return player
    })
    debugger
  }
  // updating/sending info of everything is hppening within and to the players

  /**
   * eat smaller objects and increase the raduis of the players
   * @param {*} Objects other smaller players or food
   */
  eatEatable(Objects) {

    let objectIndexesToRemove = [];

    room.players.forEach((player) => {
      player.blobs.forEach((blob) => {
        // constrain possition of blobs
        blob.constrain();

        // eat food event
        Objects.forEach((food, j) => {
          const state = getCollisionState(blob, food, 0);
          if (state === collisionState.firstPlayerBigger) {
            blob.r += 2 * food.r / (blob.r);
            objectIndexesToRemove.push(j);
          }
        })
      })
    })

    return objectIndexesToRemove;
  }

  // timer when it gets back together
  splitingtimeer() {
    room.players.forEach(player => {
      player.blobs.forEach(blob => {
        blob.timertoeatme -= 1;
      });
    });
  }
  Updates() {
    debugger
    if (room.players.length > 0) {
      // updating his radiouse bassed on his blobs
      room.updatePlayerRadious();
      // eat events:
      // eat food
      room.eatEatable(room.foods).forEach(index => room.foods.splice(index, 1))
      // eat player
      room.eatEatable(room.players).forEach(index => room.players.splice(index, 1))
      // Sending data to players
      room.players.forEach(player => {
        const fooddata = [];
        const playersdata = [];
        // Updating the foods
        room.foods.forEach(food => {
          // calculate the distance between room.player and the food
          let dist = calculateDis(
            player.middot.x,
            player.middot.y,
            food.x,
            food.y);
          //check if its viewd by the player, else don't bother 
          let itsok = false;
          if (player.zoom * room.zoomView > dist) {
            itsok = true;
          }

          // push the data
          fooddata.push({
            isitok: itsok,
            id: (itsok) ? food.id : false,
            x: (itsok) ? food.x : false,
            y: (itsok) ? food.y : false,
            r: (itsok) ? food.r : false,
            type: (itsok) ? food.type : false,
          });

        });
        // updating the players
        room.players.forEach(player2 => {
          // calculate the distance between room.player and the other player
          let dist = calculateDis(
            player.middot.x,
            player.middot.y,
            player2.middot.x,
            player2.middot.y);

          //check if its viewd by the player, else don't bother 
          let itsok = false;
          if (player.zoom * room.zoomView > dist) {
            itsok = true;
          }

          // push the data
          playersdata.push({
            isitok: itsok,
            id: player2.id,
            x: (itsok) ? player2.x : false,
            y: (itsok) ? player2.y : false,
            r: player2.r,
            blobs: (itsok) ? player2.blobs : false,
            c: (itsok) ? player2.c : false,
            nickname: player2.nickname,
          });
        });
        // sending the data that colected above to the specific player that needs it
        // sending data about the food
        io.to(player.id).emit('updateyamies', fooddata);
        // sending data about the other players (within his range of view)
        io.to(player.id).emit('updatepipis', playersdata);
      });
    }
    //
  }
  runtime() {
    io.sockets.on('connection', room.Connection);
    ///// Timers
    setInterval(room.addFood, room.timerForFoodMaker);
    //setInterval(rediuceRadiusBy, room.timerPlayerGetsOld);
    setInterval(room.Updates, room.timerPlayersUpdating);
    setInterval(room.splitingtimeer, room.periodTimeCounter);
    setInterval(room.comparisionwithweight, room.comparisonTimer);
  }
}
const express = require('express');
const uniqid = require('uniqid');
const app = express();
app.use(express.static('./application/public'));
const sockets = require('socket.io');
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
const io = sockets(server);
console.log('server is running');

let room = new Room();
room.runtime();


const collisionState = {
  sameSize: 0,
  firstPlayerBigger: 1,
  secondPlayerBigger: 2,
  noCollision: 3
}