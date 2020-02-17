/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const fs = require('fs');


const acc = fs.readFileSync('accounts.json');
const accounts = JSON.parse(acc);
const express = require('express');

const app = express();

const players = [];
const foods = [];

app.use(express.static('public'));
const sockets = require('socket.io');

const PORT = process.env.PORT || 5001;// The port


// Server
const server = app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));

// Food settings
const FoodsMaxCount = 100; // how manny foods
const TimerForFoodMaker = 200; // how mutch to wait to make another food object
const MaxFoodSize = 200; // how big can the food be
const MinFoodSize = 120; // how small can the food be
//
// Player Settings
const StartingSize = 600; // in what size the player start with
const TimerPlayerGetsOld = 2000; // how mutch to wait till his mass gose down
const TimerPlayersUpdating = 24; // how mutch to wait till the server sends player info
const AvregePlayerSpeed = 2000; // how mutch speed can the player have
const MinSizeToSplit = 400; // the minimume size for the player to split
const MaxBlobsForEachPlayer = 8; // the maximume number of blobs can the player have
const MinPlayerSize = 200; // the minimume size that can the player be
const TimerToRegainYourBlobs = 5000; // how mutch to end the split
// world Settings
const worldsize = 10000; // how big the world can be
const WorldSizeMin = -worldsize;
const WorldSizeMax = worldsize;
//
const io = sockets(server);
console.log('server is running');

///// Calculators
function calculatedis(x1, y1, x2, y2) {
  const xx = (x1 - x2) * (x1 - x2);
  const yy = (y1 - y2) * (y1 - y2);
  const d = Math.sqrt(xx + yy);
  return d;
}
function calculatedis1(other, other2) {
  const d = calculatedis(other.x, other.y, other2.x, other2.y);

  if (d <= other.r + other2.r - (other.r / 4)) {
    if (other.r > other2.r) {
      return 1;
    } if (other.r === other2.r) {
      return null;
    } if (other.r < other2.r) {
      return 2;
    }
  }
  return null;
}


///// Generators
function generateId() {
  const idnew = Math.floor(Math.random() * (50000 + FoodsMaxCount));
  for (let i = 0; i < foods.length; i += 1) {
    if (foods.id === idnew) {
      return generateId();
    } return idnew;
  }
  return 0;
}
function GenerateX(ppls, foodi) {
  const x = Math.floor(Math.random() * WorldSizeMax * 2) + WorldSizeMin;
  const y = Math.floor(Math.random() * WorldSizeMax * 2) + WorldSizeMin;
  let prob = 0;

  for (let i = 0; i < foodi.length; i += 1) {
    if (foodi[i].x === x) {
      if (foodi[i].y === y) {
        prob += 1;
      }
    }
  }
  for (let i = 0; i < ppls.length; i += 1) {
    for (let j = 0; j < ppls[i].blobs.length; j += 1) {
      if (ppls[i].blobs[j].x === x) {
        if (ppls[i].blobs[j].y === y) {
          prob += 1;
        }
      }
      const c = ppls[i].blobs[j].r - (calculatedis(ppls[i].blobs[j].x, ppls[i].blobs[j].y, x, y));
      if (c < 0) {
        // prob += 1;
      }
    }
  }
  if (prob !== 0) {
    return GenerateX(ppls, foodi);
  }
  if (prob === 0 || posi !== 0) {
    return { xx: x, yy: y };
  }
  return null;
}

///// Classes
function Food() {
  this.x = 0;
  this.y = 0;
  this.generate = function generating() {
    const saved = GenerateX(players, foods);
    this.x = saved.xx;
    this.y = saved.yy;
    this.id = generateId();
    this.r = Math.floor(Math.random() * MaxFoodSize) + MinFoodSize;
  };
}
function Blob(id, x, y, r, Timer) {
  this.x = x;
  this.timertoeatme = Timer;
  this.eatmyself = false;
  this.y = y;
  this.r = r;
  this.id = id;
  this.updatevel = function updatingvel(velx, vely) {
    this.x = Math.min(Math.max(this.x, WorldSizeMin), WorldSizeMax);
    this.y = Math.min(Math.max(this.y, WorldSizeMin), WorldSizeMax);
    this.x += (AvregePlayerSpeed * velx) / this.r;
    this.y += (AvregePlayerSpeed * vely) / this.r;
  };
  this.split = function split() {
    let playerindex = 0;
    for (let i = 0; i < players.length; i += 1) {
      if (players[i].id === this.id) {
        playerindex = i;
      }
    }

    players[playerindex].blobs.push(new Blob(this.id,
      this.x,
      this.y,
      this.r / 2,
      TimerToRegainYourBlobs));

    this.r /= 2;
    // Count till the time is over and take care of it
    if (this.timertoeatme !== 0) {
      setInterval(() => { this.eatmyself = true; }, this.timertoeatme);
    }
  };
}
function SmallPipi(id, blobs, c, nickname) {
  this.id = id;
  this.c = c;
  this.r = 0;
  this.blobs = blobs;
  this.nickname = nickname;
}


///// Events
function Connection(socket) {
  console.log(`new connection:${socket.id}`);

  // When a new player joins
  function playerjoined(newplayer) {
    const blobs = [];
    const generatedXY = new GenerateX(players, foods);
    blobs.push(new Blob(newplayer.id, generatedXY.xx, generatedXY.yy, StartingSize, 0));
    players.push(new SmallPipi(newplayer.id,
      blobs,
      newplayer.c,
      newplayer.nickname));
  }
  socket.on('ready', playerjoined);

  function Login(logindata) {

  }
  socket.on('login', Login);

  // update every blob's velocity
  function updateplayer(uplayer) {
    for (let index = 0; index < players.length; index += 1) {
      if (players[index].id === uplayer.id) {
        for (let i = 0; i < players[index].blobs.length; i += 1) {
          players[index].blobs[i].updatevel(uplayer.blobsvelx[i], uplayer.blobsvely[i]);
        }
      }
    }
  }
  socket.on('updateplayer', updateplayer);

  // When a player split
  function splitplayer(data) {
    console.log(`${data.id} wants to split`);
    for (let i = 0; i < players.length; i += 1) {
      if (players[i].id === data.id) {
        if (players[i].blobs.length < MaxBlobsForEachPlayer) {
        // Splice
          for (let j = 0; j < players[i].blobs.length; j += 1) {
            if (players[i].blobs[j].r > MinSizeToSplit) {
              players[i].blobs[j].split();
            }
          }
        }
      }
    }
  }
  socket.on('split', splitplayer);
}

// When someone disconnect
function disconnection(socket) {
  console.log('Got disconnect!');

  const i = players.indexOf(socket);
  players.splice(i, 1);
}
io.sockets.on('connection', Connection);
io.sockets.on('disconnect', disconnection);


///// functions
// rerange by their weight
function compare(a, b) {
  if (a.r < b.r) {
    return 1;
  }
  if (a.r > b.r) {
    return -1;
  }
  return 0;
}
function comparisionwithweight() {
  players.sort(compare);
}


///// Repeaters
function foodgen() {
  const newfood = new Food();
  newfood.generate();
  if (foods.length < FoodsMaxCount) {
    foods.push(newfood);
    console.log(`${foods.length}/${FoodsMaxCount} new food with id: ${newfood.id} in ${newfood.x},${newfood.y}`);
  }
}
function gettingOld() {
  for (let i = 0; i < players.length; i += 1) {
    for (let j = 0; j < players[i].blobs.length; j += 1) {
      if (players[i].blobs[j].r > MinPlayerSize) {
        players[i].blobs[j].r -= 2;
      }
    }
  }
}
// updating/sending info of everything is hppening to the players
function updatepipis() {
  // update player radiuse bassed on his blobs
  for (let i = 0; i < players.length; i += 1) {
    let rad = 0;
    for (let j = 0; j < players[i].blobs.length; j += 1) {
      rad += players[i].blobs[j].r;
    }
    players[i].r = rad;
  }
  comparisionwithweight();
  const data = [];
  for (let i = 0; i < players.length; i += 1) {
    data.push({
      blobs: players[i].blobs,
      id: players[i].id,
      x: players[i].x,
      y: players[i].y,
      r: players[i].r,
      nickname: players[i].nickname,
    });
  }
  // broatcasting food data
  const data2 = [];
  for (let i = 0; i < foods.length; i += 1) {
    // data for food gen
    data2.push({
      id: foods[i].id, x: foods[i].x, y: foods[i].y, r: foods[i].r,
    });
  }
  // broatcasting people data
  if (players.length !== 0) {
    for (let i = 0; i < players.length; i += 1) {
      // player(players[i]) eat food
      for (let j = 0; j < foods.length; j += 1) {
        for (let k = 0; k < players[i].blobs.length; k += 1) {
          // canlculate distance of each blob with each food
          if (foods !== undefined) {
            const killer = calculatedis1(players[i].blobs[k], foods[j]);
            if (killer === 1) {
              players[i].blobs[k].r += foods[j].r / (players[i].blobs[k].r * 0.2);
              foods.splice(j, 1);
            }
          }
        }
      }
      // player(players[i]) eat other player
      for (let j = 0; j < players.length; j += 1) {
        //if (players[j].velx === 0) { if (players[j].vely === 0) players.splice(j, 1); }
        for (let k = 0; k < players[j].blobs.length; k += 1) {
          for (let l = 0; l < players[i].blobs.length; l += 1) {
            // If its not the same player
            if (players[j] !== players[i]) {
              const killer = calculatedis1(players[i].blobs[l], players[j].blobs[k]);

              if (killer !== 0) {
                if (killer === 1) {
                  players[i].blobs[l].r += players[j].blobs[k].r * 0.8;
                  players[j].blobs.splice(k, 1);
                } else if (killer === 2) {
                  players[j].blobs[k].r += players[i].blobs[l].r * 0.8;
                  players[i].blobs.splice(l, 1);
                }
                //let warfeilddata = { aterid: ater, atenid: aten };
                //io.sockets.emit('warfeilddata', warfeilddata);
              }
            } else if (players[i].blobs[k].eatmyself) {
              const killer = calculatedis1(players[i].blobs[l], players[i].blobs[k]);
              if (killer !== 0) {
                if (killer === 1) {
                  players[i].blobs[l].r += players[i].blobs[k].r;
                  players[i].blobs.splice(k, 1);
                }
                //let warfeilddata = { aterid: ater, atenid: aten };
                //io.sockets.emit('warfeilddata', warfeilddata);
              }
            }
          }
        }
      }
    }
  }

  io.sockets.emit('updateyamies', data2);
  io.sockets.emit('updatepipis', data);
}
///// Timers
setInterval(foodgen, TimerForFoodMaker);
setInterval(gettingOld, TimerPlayerGetsOld);
setInterval(updatepipis, TimerPlayersUpdating);
