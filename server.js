/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable spaced-comment */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const objppl = [
  {
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
  },

];

const express = require('express');

const app = express();

const players = [];
const foods = [];

app.use(express.static(`${__dirname}/public`));
const sockets = require('socket.io');

const PORT = process.env.PORT || 5000;// The port

const adminsID = [];
////////////////////////////////////////////////// login needed component
/*const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);*/
//////////////////////////////////////////////////
// Server
const server = app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
// Food settings
const FoodsMaxCount = 1000; // how manny foods
const TimerForFoodMaker = 100; // how mutch to wait to make another food object
const MaxFoodSize = 150; // how big can the food be
const MinFoodSize = 100; // how small can the food be
//
// Player Settings
const StartingSize = 1200; // in what size the player start with
const TimerPlayerGetsOld = 5000; // how mutch to wait till his mass gose down
const TimerPlayersUpdating = 24; // how mutch to wait till the server sends player info
const AvregePlayerSpeed = 60000; // how mutch speed can the player have
const MinSizeToSplit = 400; // the minimume size for the player to split
const MaxBlobsForEachPlayer = 8; // the maximume number of blobs can the player have
const MinPlayerSize = 202; // the minimume size that can the player be
const PeriodTime = 3; // how mutch to end the split
const PeriodTimeCounter = 300; // how mutch to end the split 2
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
function coliders(other, other2, plusval) {
  const d = calculatedis(other.x, other.y, other2.x, other2.y);

  if (d <= other.r + other2.r - plusval) {
    if (other.r > other2.r) {
      return 1;
    } if (other.r === other2.r) {
      return 0;
    } if (other.r < other2.r) {
      return 2;
    }
  }
  return 3;
}
function searchindexwithid(id, Players) {
  for (let i = 0; i < Players.length; i += 1) {
    if (Players[i].id === id) {
      return i;
    }
    return false;
  }
}
function calculatemid(arraydots) {
  this.Mid = function mido() { this.x = 0; this.y = 0; };
  const middle = new this.Mid();
  let allr = 0;
  for (let i = 0; i < arraydots.length; i += 1) {
    middle.x += arraydots[i].x * arraydots[i].r;
    middle.y += arraydots[i].y * arraydots[i].r;
    allr += arraydots[i].r;
  }

  middle.x /= (arraydots.length) + allr;
  middle.y /= (arraydots.length) + allr;
  return middle;
}
function Vector(velx, vely) {
  this.x = velx;
  this.y = vely;
  this.setMag = function setmag(c) {
    const Mag = Math.sqrt(this.x * this.x + this.y * this.y);
    if (this.x === 0 && this.y === 0) {
      this.x *= Math.random();
      this.y *= Math.random();
    } else {
      this.x *= (c / Mag);
      this.x *= (c / Mag);
    }
  };
  this.vector = function vector(x1, y1, x2, y2) {
    this.x = x2 - x1;
    this.y = y2 - y1;
  };
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
  this.type = 0;
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
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.r = r;
  this.playerid = id;
  this.timertoeatme = Timer;
  this.eatmyself = false;

  this.vel = new Vector(0, 0);
  this.update = function updating(mousex, mousey, width, height) {
    const indexofplayer = searchindexwithid(this.playerid, players);
    if (indexofplayer !== false) {
      if (this.timertoeatme <= 0) {
        this.eatmyself = true;
      } else {
        this.eatmyself = false;
      }
      if (this.eatmyself === true) {
        for (let i = 0; i < players[indexofplayer].blobs.length; i += 1) {
          if (this !== players[indexofplayer].blobs[i]) {
            const dis = coliders(this, players[indexofplayer].blobs[i],
              -players[indexofplayer].blobs[i].r - this.r + 20);
            if (dis === 1) {
            // this blob will eat another blob
              this.r += players[indexofplayer].blobs[i].r;
              players[indexofplayer].blobs.splice(i, 1);
            }
          }
        }
      }
      const middot = calculatemid(players[indexofplayer].blobs);
      // calculating mouse possition
      this.vx = (mousex - (width / 2)) + (-this.x + middot.x);
      this.vy = (mousey - (height / 2)) + (-this.y + middot.y);
      //  calculating magnitude
      Mag = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      // setting the magnitude
      this.vx *= (AvregePlayerSpeed / Mag);
      this.vy *= (AvregePlayerSpeed / Mag);

      //this.vx = this.vel.x;
      //this.vy = this.vel.y;
      //this.vel.x += this.vx;
      //this.vel.y += this.vy;
      //this.vel.setMag(AvregePlayerSpeed);
    }
    this.x += (this.vx) / this.r;
    this.y += (this.vy) / this.r;
  };
  this.split = function split() {
    let playerindex = 0;
    for (let i = 0; i < players.length; i += 1) {
      if (players[i].id === this.playerid) {
        playerindex = i;
      }
    }

    players[playerindex].blobs.push(new Blob(this.playerid,
      this.x + 10,
      this.y + 10,
      this.r / 2,
      PeriodTime));
    this.timertoeatme = PeriodTime;
    this.r /= 2;
    // Count tilsl the time is over and take care of it
    if (this.timertoeatme !== 0) {
    //setInterval(() => { this.eatmyself = true; }, this.timertoeatme);
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
    for (let i = 0; i < objppl.length; i += 1) {
      if (logindata.user === objppl[i].un && logindata.pass === objppl[i].pw) {
        adminsID.push(logindata.id);
      }
    }
  }
  socket.on('login', Login);

  // update every blob's velocity
  function updateplayer(uplayer) {
    if (socket.id !== uplayer.id) {
      // console.log(socket.id + " is not matched");
    }
    // let addthere = 0;
    for (let index = 0; index < players.length; index += 1) {
      if (players[index].id === uplayer.id) {
        for (let i = 0; i < players[index].blobs.length; i += 1) {
          players[index].blobs[i].id = socket.id;
          players[index].blobs[i].update(uplayer.mousex,
            uplayer.mousey,
            uplayer.width,
            uplayer.height);
        }
      } // else { addthere += 1; }
    }
    // if (addthere === players.length) { socket.disconnect(); }
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
function Broadcast() {
  // update player radiuse bassed on his blobs
  for (let i = 0; i < players.length; i += 1) {
    let rad = 0;
    for (let j = 0; j < players[i].blobs.length; j += 1) {
      rad += players[i].blobs[j].r;
    }
    players[i].r = rad;
  }
  comparisionwithweight();
  const playersdata = [];
  for (let i = 0; i < players.length; i += 1) {
    playersdata.push({
      blobs: players[i].blobs,
      id: players[i].id,
      x: players[i].x,
      y: players[i].y,
      r: players[i].r,
      c: players[i].c,
      nickname: players[i].nickname,
    });
  }
  // broatcasting food data
  const fooddata = [];
  for (let i = 0; i < foods.length; i += 1) {
    // data for food gen
    fooddata.push({
      id: foods[i].id, x: foods[i].x, y: foods[i].y, r: foods[i].r, type: foods[i].type,
    });
  }
  // Eat Events
  if (players.length !== 0) {
    for (let i = 0; i < players.length; i += 1) {
      for (let l = 0; l < players[i].blobs.length; l += 1) {
        // player(players[i]) eat food
        for (let j = 0; j < foods.length; j += 1) {
          // canlculate distance of each blob with each food
          if (foods !== undefined) {
            const killer = coliders(players[i].blobs[l], foods[j], 0);
            if (killer === 1) {
              players[i].blobs[l].r += foods[j].r / (players[i].blobs[l].r * 0.2);
              foods.splice(j, 1);
            }
          }
        }
        //if (players[j].velx === 0) { if (players[j].vely === 0) players.splice(j, 1); }
        // player(players[i]) eat other player
        for (let j = 0; j < players.length; j += 1) {
          for (let k = 0; k < players[j].blobs.length; k += 1) {
            // If its not the same player
            if (players[j] !== players[i] && players.length > 1) {
              const killer = coliders(players[i].blobs[l],
                players[j].blobs[k], 0);

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
              const colition = coliders(players[i].blobs[k], players[i].blobs[j]);
              if (colition !== 3) {
                const minDist = players[i].blobs[j].r / 2 + players[i].blobs[k].d / 2;
                const dx = players[i].blobs[j].x - players[i].blobs[k].x;
                const dy = players[i].blobs[j].y - players[i].blobs[k].y;
                const angle = Math.atan2(dy, dx);
                const targetX = players[i].blobs[k].x + Math.cos(angle) * (minDist);
                const targetY = players[i].blobs[k].y + Math.sin(angle) * (minDist);
                const ax = (targetX - players[i].blobs[j].x) * 0.5;
                const ay = (targetY - players[i].blobs[j].y) * 0.5;
                players[i].blobs[k].vx -= ax;
                players[i].blobs[k].vy -= ay;
                console.log(`${ax} , ${ay}`);
                players[i].blobs[j].vx += ax;
                players[i].blobs[j].vy += ay;
              }
            }
          }
        }
      }
    }
  }

  io.sockets.emit('updateyamies', fooddata);
  io.sockets.emit('updatepipis', playersdata);
}
function splitingtimeer() {
  for (let i = 0; i < players.length; i += 1) {
    for (let j = 0; j < players[i].blobs.length; j += 1) {
      players[i].blobs[j].timertoeatme -= 1;
    }
  }
}
///// Timers
setInterval(foodgen, TimerForFoodMaker);
setInterval(gettingOld, TimerPlayerGetsOld);
setInterval(Broadcast, TimerPlayersUpdating);
setInterval(splitingtimeer, PeriodTimeCounter);
console.log(process.env.SecuredCode);
