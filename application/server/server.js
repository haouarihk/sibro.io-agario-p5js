/* eslint-disable linebreak-style */
/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable spaced-comment */
/* eslint-disable no-undef */
/* eslint-disable no-console */
// bot implementation
require('child_process').fork('botScript/bot.js');
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

function getCollisionState(obj1, obj2, minDiff) {
  const distance = calculateDis(obj1.x, obj1.y, obj2.x, obj2.y);

  if (distance <= obj1.r) {
    if (obj1.r > obj2.r - minDiff) {
      return collisionState.firstPlayerBigger;
    }
    if (obj1.r === obj2.r - minDiff) {
      return collisionState.sameSize;
    }
    if (obj1.r < obj2.r - minDiff) {
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
  // the form of this.equation is:
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

function checkNickname(nickname) {
  if (nickname.length > 10) {
    return nickname.substring(0, 9);
  }
  return nickname;
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
    this.id = uniqid();
    const kindProbs = [0.8, 0.2];
    let food = this;
    this.type = food.getRandomType(kindProbs) + 1;

  }
  setRad(min, max) {
    this.r = Math.floor(Math.random() * max) + min;
  }
  setPos(pos) {
    let position = pos;
    this.x = position.x;
    this.y = position.y;
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
    this.indexofplayer = -1;
  }
  // this function for updating the location
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

  constructor(index, playersQuantity, foodsQuantity, worldsize) {
    this.players = [];
    this.foods = [];
    this.roomindex = index;
    // Server
    this.comparisonTimer = 500; // how much to refresh the Top 10 players list
    //
    // Food settings
    this.foodsMaxCount = foodsQuantity || 500; // how manny foods (default 500)
    this.howManyEvrytime = 500; // how much everytime (default 200)
    this.timerForFoodMaker = 200; // how mutch to wait to make another food object (default 200)
    this.maxFoodSize = 300; // how big can the food be (default 300)
    this.minFoodSize = 250; // how small can the food be (default 100)
    //
    // Player Settings
    this.howManyPlayersInThisRoom = playersQuantity || 24;
    this.avregePlayerSpeed = 200000; // how mutch speed can the player have (default 60000)
    this.startingSize = 400; // in what size the player start with (default 1200)
    this.timerPlayerGetsOld = 5000; // how mutch to wait till his mass gose down (default 5000)
    this.timerPlayersUpdating = 24; // how mutch to wait till the server sends player info (default 24)
    this.minSizeToSplit = 650; // the minimume size for the player to split (default 400)
    this.maxBlobsForEachPlayer = 8; // the maximume number of blobs can the player have (default 8)
    this.minPlayerSize = 410; // the minimume size that can the player be (default 200)
    this.periodTime = 3; // how mutch to end the split (default 3)
    this.periodTimeCounter = 300; // how mutch to end the split 2 (default 300)
    this.zoomView = 8; // how much can the player see the world (default 8)
    //
    // World Settings
    this.worldSize = worldsize || 80000; // how big the world can be (default 50000)
    this.worldSizeMin = -this.worldSize;
    this.worldSizeMax = this.worldSize;
  }
  updatePlayerRadious() {
    this.players.forEach((player, index, playersArray) => {
      if (player.blobs) {
        player.r = player.blobs.reduce((sum, blob) => blob.r + sum, 0)
      } else {
        player.blobs = []
      }
    })
  }
  comparisionwithweight() {
    if (this.players.length > 1) {
      this.players.sort((player1, player2) => player2.r - player1.r);
    }
  }
  //// Generators
  /**
   * get free random position
   * @returns {{x, y}} return available postion(x,y)
   */
  getFreeRandomPosition() {
    let collision = true;
    let x = 0;
    let y = 0;

    let tries = 10000;

    while (collision && tries > 0) {
      x = Math.floor(Math.random() * this.worldSizeMax * 2) + this.worldSizeMin;
      y = Math.floor(Math.random() * this.worldSizeMax * 2) + this.worldSizeMin;
      if (this.isItAvaible(x, y)) {
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
  isItAvaible(x, y) {
    return (!this.isThereAFood(x, y) && !this.isThereAPlayer(x, y));
  }
  isThereAFood(x, y) {
    this.foods.forEach((food) => {
      if (food.x === x && food.y === y) {
        return true;
      }
    });
    return false;
  }
  isThereAPlayer(x, y) {
    this.players.forEach((player) => {
      player.blobs.forEach((blob) => {
        const dist = blob.r - calculateDis(blob.x, blob.y, x, y);
        if ((blob.x === x && blob.y === y) || dist > 0) {
          return true;
        }
      })
    })
    return false;
  }
  addFood() {
    const fooddata = [];
    for (let i = 0; i < this.howManyEvrytime; i++) {
      if (this.foods.length < this.foodsMaxCount) {
        let food = new Food();
        food.setPos(this.getFreeRandomPosition());
        food.setRad(this.minFoodSize, this.maxFoodSize);
        this.foods.push(food);
        fooddata.push({
          id: food.id,
          x: food.x,
          y: food.y,
          r: food.r,
          type: food.type,
        });
      }

    }

    // sending data about the food
    io.emit('updateyamies', fooddata);
    // io.sockets.emit('updateyamies', fooddata);
  }
  // there is a problem with this.function
  rediuceRadiusBy(step = 2) {
    this.players = this.players.map(player => {
      player.blobs = player.blobs.map(blob => {
        let blobSize = blob.r - step;
        if (blobSize < this.minPlayerSize) {
          blobSize = this.minPlayerSize;
        }

        blob.r = blobSize;
        return {
          blob
        }
      })

      return player
    })

  }
  // updating/sending info of everything is hppening within and to the players

  /**
   * eat smaller objects and increase the raduis of the players
   * @param {*} Objects other smaller players or food
   */
  eatEatable(Objects, alive) {

    let objectIndexesToRemove = [];

    this.players.forEach((player) => {
      player.blobs.forEach((blob) => {
        // constrain possition of blobs
        this.constrainblob(blob);
        debugger
        // eat food event
        Objects.forEach((food, j) => {
          if (alive) {
            food.blobs.forEach((yam, k) => {
              const state = getCollisionState(blob, yam, 0);
              if (state === collisionState.firstPlayerBigger) {
                blob.r += 100 * yam.r / blob.r;
                objectIndexesToRemove.push({
                  index: k,
                  id: food.id
                });
              }
            });
          } else {
            const state = getCollisionState(blob, food, 0);
            if (state === collisionState.firstPlayerBigger) {
              blob.r += 100 * food.r / blob.r;
              objectIndexesToRemove.push({
                index: j,
                id: 0
              });
            }
          }
        })
      })
    })

    return objectIndexesToRemove;
  }
  // timer when it gets back together
  splitingtimeer() {
    this.players.forEach(player => {
      player.blobs.forEach(blob => {
        blob.timertoeatme -= 1;
      });
    });
  }
  // updating/sending/Events the current data
  Updates() {
    if (this.players.length > 0) {
      // updating his radiouse bassed on his blobs
      this.updatePlayerRadious();
      /////////// eat events:
      // eat food
      this.eatEatable(this.foods).forEach(dat => {
        if (this.foods[dat.index]) {
          let fooddata = this.foods[dat.index].id;
          io.sockets.emit('foodeatenEvent', fooddata);
          this.foods.splice(dat.index, 1);
        }
      })
      // eat player
      let a = this.eatEatable(this.players, true)
      a.forEach((dat) => {
        if (this.players[dat.index]) {
          let index = dat.index;
          let playerid = dat.id;
          let indexofme = getIndexById(playerid, this.players);
          if (indexofme !== -1) {
            console.log(playerid + ',' + index)
            this.players[indexofme].blobs.splice(index, 1)
          }
        }
      })
      /////////// Sending data to players
      this.players.forEach(player => {

        const playersdata = [];
        // updating the players
        this.players.forEach(player2 => {
          // calculate the distance between this.player and the other player
          let dist = calculateDis(
            player.middot.x,
            player.middot.y,
            player2.middot.x,
            player2.middot.y);

          //check if its viewd by the player, else don't bother 
          let itsok = false;
          if (player.zoom * this.zoomView > dist) {
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

        // sending data about the other players (within his range of view)
        io.to(player.id).emit('updatepipis', playersdata);
      });
    }
  }
  // connection reciver
  runtime() {
    console.log('room ' + this.roomindex + ' is running');
    io.sockets.on('connection', (socket) => {
      console.log(`new connection:${socket.id}`);
      // on disconnect
      socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        const i = getIndexById(socket.id, this.players);
        this.players.splice(i, 1);
        console.log(`${socket.id} sliced in index of ${i}`);
        socket.emit('disconnectThatSoc');

      });
      // on new player join
      socket.on('ready', (playerInfo) => {
        const blobs = [];
        const position = this.getFreeRandomPosition();
        // creating the player
        blobs.push(new Blob(socket.id, position.x, position.y, this.startingSize, 0));
        this.players.push(new Player(socket.id,
          blobs,
          playerInfo.color,
          checkNickname(playerInfo.nickname)));
        // sending back the info
        const settingsofplayer = {
          blobs,
          id: socket.id,
          foods: this.foods,
          minSizeToSplit: this.minSizeToSplit,
        };

        socket.emit('set!', settingsofplayer);

      });
      // on player login
      socket.on('login', (logindata) => {
        objppl.forEach(data => {
          if (logindata.user === data.un && logindata.pass === data.pw) {
            adminsID.push(logindata.id);
          }
        });
      });
      // on player sends his data
      socket.on('updateplayer', (uplayer) => {
        // updating players list
        this.players.forEach((player) => {
          if (player.id === socket.id) {
            // player update his zoom
            player.zoom = uplayer.zoomsize;
            // player update his blobs
            player.blobs.forEach(blob => {
              blob.id = socket.id;
              blob.indexofplayer = getIndexById(blob.id, this.players);
              this.updateBlob(blob, uplayer.mousex,
                uplayer.mousey,
                uplayer.width,
                uplayer.height);

            })

          }
          // update his middle dot 
          player.middot = getCenterDot(player.blobs);
        })
      });

      // When a player split
      function splitPlayer() {}

      socket.on('split', () => {
        const playerIndex = getIndexById(socket.id, this.players)
        if (playerIndex !== -1) {
          if (this.players[playerIndex].blobs.length < this.maxBlobsForEachPlayer) {
            // Splice
            this.players[playerIndex].blobs.forEach((blob) => {
              if (blob.r > this.minSizeToSplit) {
                this.split(blob);
              }
            })
          }
        }
      });

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
    });
    ///// Timers

  }
  // blob functions 
  updateBlob(blob, mousex, mousey, width, height) {
    if (blob.indexofplayer !== -1) {
      if (blob.timertoeatme <= 0) {
        blob.eatmyself = true;
      } else {
        blob.eatmyself = false;
      }
      if (blob.eatmyself === true) {
        this.players[blob.indexofplayer].blobs.forEach(blob2 => {
          if (blob !== blob2) {
            const dis = getCollisionState(blob, blob2, -blob2.r - blob.r + 20);
            if (dis === collisionState.firstPlayerBigger) {
              // this blob will eat another blob
              this.r += blob2.r;
              this.players[blob.indexofplayer].blobs.splice(i, 1);
              console.log("this has lunched")
            }
          }
        });

      }
      // console.log('wait what ' + indexofplayer);
      const middot = getCenterDot(this.players[blob.indexofplayer].blobs);
      var direction = new Point(
        (mousex - (width / 2)),
        (mousey - (height / 2)));
      // setting the magnitude
      direction.setMag(this.avregePlayerSpeed);
      // moving the blob
      blob.x += (direction.x) / blob.r;
      blob.y += (direction.y) / blob.r;

    }
  }
  constrainblob(blob) {
    // stop it from going outside of the world
    blob.x = limitNumberWithinRange(blob.x, this.worldSizeMin, this.worldSizeMax);
    blob.y = limitNumberWithinRange(blob.y, this.worldSizeMin, this.worldSizeMax);
  }
  split(blob) {
    let playerindex = getIndexById(blob.id, this.players);
    if (playerindex !== -1) {
      if (this.players[playerindex].id === blob.id) {
        this.players[playerindex].blobs.push(new Blob(blob.id,
          blob.x + 10,
          blob.y + 10,
          blob.r / 2,
          this.periodTime));
        blob.timertoeatme = this.periodTime;
        blob.r /= 2;
      }
    }
  };
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
let rooms = 1;
for (let i = 0; i < rooms; i++) {
  let room = new Room(i);
  room.runtime();
  setInterval(() => {
    room.addFood()
  }, room.timerForFoodMaker);
  //setInterval(()=>{rediuceRadiusBy()}, this.timerPlayerGetsOld);
  setInterval(() => {
    room.Updates()
  }, room.timerPlayersUpdating);
  setInterval(() => {
    room.splitingtimeer()
  }, room.periodTimeCounter);
  setInterval(() => {
    room.comparisionwithweight()
  }, room.comparisonTimer);
}
const collisionState = {
  sameSize: 0,
  firstPlayerBigger: 1,
  secondPlayerBigger: 2,
  noCollision: 3
}