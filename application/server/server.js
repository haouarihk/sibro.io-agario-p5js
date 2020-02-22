/* eslint-disable linebreak-style */
/* eslint-disable radix */
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

app.use(express.static('./application/public'));
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
const comparisonTimer = 100; // how mutch to refresh the Top 10 players list
// Food settings
const FoodsMaxCount = 500; // how manny foods
const howmanyatatime = 200;
const TimerForFoodMaker = 200; // how mutch to wait to make another food object
const MaxFoodSize = 300; // how big can the food be
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
const ZoomView = 8;
// world Settings
const worldsize = 50000; // how big the world can be
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

  if (d <= other.r - plusval) {
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
  }
  return false;
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
function limitNumberWithinRange(num, min, max) {
  const MIN = min || 1;
  const MAX = max || 20;
  const parsed = parseInt(num);
  return Math.min(Math.max(parsed, MIN), MAX);
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
  this.id = id;
  this.timertoeatme = Timer;
  this.eatmyself = false;

  this.vel = new Vector(0, 0);
  this.update = function updating(mousex, mousey, width, height) {
    const indexofplayer = searchindexwithid(this.id, players);
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
      if (players[i].id === this.id) {
        playerindex = i;
      }
    }

    players[playerindex].blobs.push(new Blob(this.id,
      this.x + 10,
      this.y + 10,
      this.r / 2,
      PeriodTime));
    this.timertoeatme = PeriodTime;
    this.r /= 2;
  };
  this.constrain = function constrainer() {
    // stop it from going outside of the world
    this.x = limitNumberWithinRange(this.x, WorldSizeMin, WorldSizeMax);
    this.y = limitNumberWithinRange(this.y, WorldSizeMin, WorldSizeMax);
  };
}
function SmallPipi(id, blobs, c, nickname) {
  this.id = id;
  this.c = c;
  this.r = 0;
  this.blobs = blobs;
  this.zoom = 1;
  this.nickname = nickname;
  this.middot = new Vector(0,0);
  // this function for saving ram
  this.calculatemidofhisblobs = function cmohb(){
    const newmiddot = calculatemid(this.blobs);
    this.middot.x = newmiddot.x;
    this.middot.y = newmiddot.y;
  }
}


///// Events
function Connection(socket) {
  console.log(`new connection:${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    socket.emit('disconnectThatSoc');
    const i = searchindexwithid(socket.id, players);
    if (i !== false) {
      players.splice(i, 1);
      console.log(`${socket.id} sliced in index of ${i}`);
    }
  });
  function verifynickname(nickname){
    if(nickname.length > 10) {
      return nickname.substring(0,9);
    }
    return nickname;
  }
  // When a new player joins
  function playerjoined(newplayer) {
    const blobs = [];
    const generatedXY = new GenerateX(newplayer, foods);
    blobs.push(new Blob(socket.id, generatedXY.xx, generatedXY.yy, StartingSize, 0));

    players.push(new SmallPipi(socket.id,
      blobs,
      newplayer.c,
      verifynickname(newplayer.nickname)));
    const settingsofplayer = {
      blob2: blobs,
      id: socket.id,
      minisizetosplit: MinSizeToSplit,
    };
    socket.emit('set!', settingsofplayer);
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
      // socket.emit('disconnectThatSoc');
    }
    for (let index = 0; index < players.length; index += 1) {
      if (players[index].id === socket.id) {
        for (let i = 0; i < players[index].blobs.length; i += 1) {
          players[index].blobs[i].id = socket.id;
          players[index].blobs[i].update(uplayer.mousex,
            uplayer.mousey,
            uplayer.width,
            uplayer.height);
          players[index].zoom = uplayer.zoomsize;
        }
      }
      // update his middle dot 
      players[index].calculatemidofhisblobs();
    }
  }
  socket.on('updateplayer', updateplayer);

  // When a player split
  function splitplayer() {
    // console.log(`${data.id} wants to split`);
    for (let i = 0; i < players.length; i += 1) {
      if (players[i].id === socket.id) {
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
  // to make sure that non of no players have body
  for (let i = 0; i < players.length; i += 1) {
    let at = false;
    for (let j = 0; j < io.sockets.length; j += 1) {
      if (io.sockets[j].id === players[i].id) {
        at = true;
      }
    }
    if (at === false) {
      // players.splice(i, 1);
    }
  }
}

// When someone connect
io.sockets.on('connection', Connection);


///// functions
// rerange by their weight
function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const playerA = a.r;
  const playerB = b.r;

  let comparison = 0;
  if (playerA > playerB) {
    comparison = 1;
  } else if (playerA < playerB) {
    comparison = -1;
  }
  return comparison;
}

function comparisionwithweight() {
  // it doesn't work yet
  players.sort(compare);
}


///// Repeaters
function foodgen() {
  for (let i = 0; i < howmanyatatime; i += 1) {
    const newfood = new Food();
    newfood.generate();
    if (foods.length < FoodsMaxCount) {
      foods.push(newfood);
    }
  }
  
  // io.sockets.emit('updateyamies', fooddata);
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
function Updates() {
  // Eat Events
  if (players.length !== 0) {
    if (players.length !== 0) {
      for (let i = 0; i < players.length; i += 1) {
        let rad = 0;
        for (let l = 0; l < players[i].blobs.length; l += 1) {
          // calculate raidiuse of all his blobs
          rad += players[i].blobs[l].r;
          // constraining a player to not go outside the world
          players[i].blobs[l].constrain();
          // player(players[i]) eat food
          for (let j = 0; j < foods.length; j += 1) {
          // canlculate distance of each blob with each food
            if (foods !== undefined) {
              const killer = coliders(players[i].blobs[l], foods[j], 0);
              if (killer === 1) {
                players[i].blobs[l].r += foods[j].r / (players[i].blobs[l].r * 0.02);
                foods.splice(j, 1);
              }
            }
          }
          //if (players[j].velx === 0) { if (players[j].vely === 0) players.splice(j, 1); }
          // player(players[i]) eat other player
          for (let j = 0; j < players.length; j += 1) {
            for (let k = 0; k < players[j].blobs.length; k += 1) {
            // If its not the same player
              if (players.length > 1) {
                if (players[j] !== players[i]) {
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
                } else
                if (players[i].blobs[k].eatmyself) {
                  if (players[i].blobs[k] !== players[i].blobs[j]) {
                    const colition = 3;// coliders(players[i].blobs[k], players[i].blobs[j]);
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
        // giving the raduse of his all blobs to him
        players[i].r = rad;
      }
    }
  }
  if(players.length>0){
  for(var j = 0 ; j< players.length; j += 1){
    const fooddata = [];
    const playersdata = [];
    // Updating foods
    for (let i = 0; i < foods.length; i += 1) {
      // see if its in the same range
      let dist = calculatedis(
        players[j].middot.x,
        players[j].middot.y,
        foods[i].x,
        foods[i].y);
      let itsok = false;
      if(players[j].zoom * ZoomView  > dist) {
        itsok = true;
        // console.log('GOT SOMETHING '+players[j].zoom  +','+ dist );
      }

      // push the data
      fooddata.push({
        isitok: itsok,
        id: (itsok)?foods[i].id:false,
        x: (itsok)?foods[i].x:false,
        y: (itsok)?foods[i].y:false,
        r: (itsok)?foods[i].r:false,
        type: (itsok)?foods[i].type:false,
      });
    }
    // Updating players
    for (let i = 0; i < players.length; i += 1) {
      // see if its in the same range
      let dist = calculatedis(
        players[j].middot.x,
        players[j].middot.y,
        players[i].middot.x,
        players[i].middot.y);
      let itsok = false;
      if(players[j].zoom * ZoomView  > dist) {
        itsok = true;
       // console.log('GOT SOMETHING '+players[j].zoom  +','+ dist );
      }

      // push the data
      playersdata.push({
        isitok: itsok,
        id: players[i].id,
        x:(itsok)?players[i].x:false,
        y:(itsok)?players[i].y:false,
        r:players[i].r,

        blobs:(itsok)?players[i].blobs:false,
        c:(itsok)?players[i].c:false,
        nickname: players[i].nickname,
      });
    }
    io.to(players[j].id).emit('updateyamies',fooddata);
    io.to(players[j].id).emit('updatepipis',playersdata);
  }
}
  // io.sockets.emit('updatepipis', playersdata);
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
setInterval(Updates, TimerPlayersUpdating);
setInterval(splitingtimeer, PeriodTimeCounter);
setInterval(comparisionwithweight, comparisonTimer);
console.log(process.env.SecuredCode);
