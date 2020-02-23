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
const uniqid = require('uniqid');
const app = express();

let players = [];
let foods = [];

app.use(express.static('./application/public'));
const sockets = require('socket.io');

const PORT = process.env.PORT || 5000;// The port

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
const comparisonTimer = 100; // how much to refresh the Top 10 players list
//
// Food settings
const foodsMaxCount = 500; // how manny foods (default 500)
const howManyEvrytime = 200; // how much everytime (default 200)
const timerForFoodMaker = 200; // how mutch to wait to make another food object
const maxFoodSize = 300; // how big can the food be (default 300)
const minFoodSize = 100; // how small can the food be (default 100)
const howManyYypes = 2; // how many kinds of food (don't touch that if you haven't read the code) (default 2)
const fortype1toshowup = 20;
const fortype2toshowup = 23;
//
// Player Settings
const startingSize = 1200; // in what size the player start with (default 1200)
const timerPlayerGetsOld = 5000; // how mutch to wait till his mass gose down (default 5000)
const timerPlayersUpdating = 24; // how mutch to wait till the server sends player info (default 24)
const avregePlayerSpeed = 60000; // how mutch speed can the player have (default 60000)
const minSizeToSplit = 400; // the minimume size for the player to split (default 400)
const maxBlobsForEachPlayer = 8; // the maximume number of blobs can the player have (default 8)
const minPlayerSize = 200; // the minimume size that can the player be (default 200)
const periodTime = 3; // how mutch to end the split (default 3)
const periodTimeCounter = 300; // how mutch to end the split 2 (default 300)
const zoomView = 8; // how much can the player see the world (default 8)
//
// World Settings
const worldSize = 50000; // how big the world can be
  const worldSizeMin = -worldSize;
  const worldSizeMax = worldSize;
//
const io = sockets(server);
console.log('server is running');
const collisionState={
  sameSize:0,
  firstPlayerBigger:1,
  secondPlayerBigger:2, 
  noCollision:3
}
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
    } if (player1.r === player2.r - minDiff) {
      return collisionState.sameSize;
    } if (player1.r < player2.r - minDiff) {
      return collisionState.secondPlayerBigger;
    }
  }
  return collisionState.noCollision;
}

function getIndexById(id, players) {
  players.forEach((player, index) => {
    if (player.id === id) {
      return index;
    }
  });
  return -1;
}

function getCenterDot(blobs) {

  const center = { x : 0, y : 0 };
  
  let radiouseSum = 0;

  for (let i = 0; i < blobs.length; i += 1) {
    center.x += blobs[i].x * blobs[i].r;
    center.y += blobs[i].y * blobs[i].r;
    radiouseSum += blobs[i].r;
  }

  center.x /= (blobs.length) + radiouseSum;
  center.y /= (blobs.length) + radiouseSum;
  return center;
}

function updatePlayerRadious(){
  players.forEach((player,index,playersArray)=> {
   if(player.blobs){
    playersArray[index].r=player.blobs.reduce((sum, blob)=>blob.r+sum,0)
  } else {
    player.blobs=[]
  }
  })
  
}

function Vector(velx, vely) {
  this.x = velx;
  this.y = vely;
  this.setMag = function setmag(c) {
    const Mag = Math.sqrt(this.x * this.x + this.y * this.y);
    if (this.x === 0 && this.y === 0) {
      this.x = Math.random();
      this.y = Math.random();
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

  const idnew = Math.floor(Math.random() * (50000 + foodsMaxCount));
  foods.forEach((food) => {
    if (food.id === idnew) {
      return generateId();
    } return idnew;
  });
  return 0;
}
/**
 * get free random position
 * @returns {{x, y}} return available postion(x,y)
 */
function getFreeRandomPosition() {
  let collision = true;
  let x = 0;
  let y = 0; 
  
  let tries = 10000;
  
  while (collision && tries >0) {
    x = Math.floor(Math.random() * worldSizeMax * 2) + worldSizeMin;
    y = Math.floor(Math.random() * worldSizeMax * 2) + worldSizeMin;
    if(isItAvaible(x,y)){
      collision=false;
    }
    tries--;
  }
  if (tries === 0) {
    console.error("World is full!");
  }
  return {x,y} 
}

function isItAvaible(x,y){
  return (!isThereAFood(x,y)&&!isThereAPlayer(x,y));
}

function isThereAFood(x,y){
  foods.forEach((food) => {
    if (food.x === x && food.y === y) {
      return true;
    } 
  });
  return false;
}

function isThereAPlayer(x,y) {
  players.forEach((player)=>{
    player.blobs.forEach((blob)=>{
      const dist = blob.r - calculateDis(blob.x,blob.y, x, y);
      if ((blob.x === x && blob.y === y) || dist > 0) {
        return true;
      } 
    })
  })

  return false;

}



///// Classes
class Food {
  constructor(){
    this.x = 0;
    this.y = 0;
    this.type = 0;
    const position = getFreeRandomPosition();
    this.x = position.x;
    this.y = position.y;
    this.id = uniqid();
    this.r = Math.floor(Math.random() * maxFoodSize) + minFoodSize;
    const kindProbs= [0.8, 0.2];
    this.type = this.getRandomType(kindProbs)+1;
  }

  /**
 * Get Random number based on the provided varaibles
 * @param {*} kindProbs 
 * @returns {int} index of selected value
 */
 getRandomType(kindProbs) {
  const winner = Math.random();
  let threshold=0;

  for (let i = 0; i < kindProbs.length; i++) {
    threshold += kindProbs[i]
    if (threshold >= winner) {
        return i;
    }
  }

  }
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
    const indexofplayer = getIndexById(this.id, players);
    if (indexofplayer !== -1) {
      if (this.timertoeatme <= 0) {
        this.eatmyself = true;
      } else {
        this.eatmyself = false;
      }
      if (this.eatmyself === true) {
        for (let i = 0; i < players[indexofplayer].blobs.length; i += 1) {
          if (this !== players[indexofplayer].blobs[i]) {
            const dis = getCollisionState(this, players[indexofplayer].blobs[i],
              -players[indexofplayer].blobs[i].r - this.r + 20);
            if (dis === 1) {
            // this blob will eat another blob
              this.r += players[indexofplayer].blobs[i].r;
             players[indexofplayer].blobs.splice(i, 1);
            }
          }
        }
      }
      const middot = getCenterDot(players[indexofplayer].blobs);
      // calculating mouse possition
      this.vx = (mousex - (width / 2)) + (-this.x + middot.x);
      this.vy = (mousey - (height / 2)) + (-this.y + middot.y);

      //  calculating magnitude
      Mag = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

      // setting the magnitude
      this.vx *= (avregePlayerSpeed / Mag);
      this.vy *= (avregePlayerSpeed / Mag);

      this.x += (this.vx) / this.r;
      this.y += (this.vy) / this.r;

    }
   
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
      periodTime));
    this.timertoeatme = periodTime;
    this.r /= 2;
  };

  this.constrain = function constrainer() {
    // stop it from going outside of the world
    this.x = limitNumberWithinRange(this.x, worldSizeMin, worldSizeMax);
    this.y = limitNumberWithinRange(this.y, worldSizeMin, worldSizeMax);
  };
}

function Player(id, blobs, c, nickname) {
  this.id = id;
  this.c = c;
  this.r = 0;
  this.blobs = blobs;
  this.zoom = 1;
  this.nickname = nickname;
  this.middot = new Vector(0,0);
  // this function for saving ram
  this.calculatemidofhisblobs = function cmohb(){
    const newmiddot = getCenterDot(this.blobs);
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
    const i = getIndexById(socket.id, players);
    if (i !== false) {
      players.splice(i, 1);
      console.log(`${socket.id} sliced in index of ${i}`);
    }
  });
  function checkNickname(nickname){
    if(nickname.length > 10) {
      return nickname.substring(0,9);
    }
    return nickname;
  }
  // When a new player joins
  function newPlayer(playerInfo) {
    const blobs = [];
    const position = new getFreeRandomPosition();
    
    blobs.push(new Blob(socket.id, position.x, position.y, startingSize, 0));

    players.push(new Player(socket.id,
      blobs,
      playerInfo.color,
      checkNickname(playerInfo.nickname)));

    const settingsofplayer = {
      blobs,
      id: socket.id,
      minSizeToSplit,
    };

    socket.emit('set!', settingsofplayer);
  }

  socket.on('ready', newPlayer);

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
  function splitPlayer() {
    const playerIndex= getIndexById(socket.id,players)
        if (players[playerIndex].blobs.length < maxBlobsForEachPlayer) {
        // Splice
          players[playerIndex].blobs.forEach((blob)=>{
          if (blob.r > minSizeToSplit) {
            blob.split();
          }
        })  
      }
    
  }
  
  socket.on('split', splitPlayer);
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




function comparisionwithweight() {
  // it doesn't work yet
  players.sort((player1,player2)=>player2.r-player1.r);
}


/**
 * Add food within the maximum number of availble food foodsMaxCount
 */
function addFood() {
  for (let i = 0; i < howManyEvrytime; i ++) {
    if (foods.length < foodsMaxCount) {
      const food = new Food();
      foods.push(food);
    }
  }
  
  // io.sockets.emit('updateyamies', fooddata);
}

function reduiceRadiusBy(step = 2) {
  players=players.map(player=>{
      player=player.blobs.map(blob=>{
        {
          let blobSize = blob.r - step;
          if (blobSize < minPlayerSize) {
            blobSize = minPlayerSize;
          }
          return {...blob,r:blobSize}
        }})
      return player
  })
}
// updating/sending info of everything is hppening to the players
function Updates() {
  // step 1 : calculate radiouse of the player 
  if(players.length > 0){
  updatePlayerRadious();
  
  eatEatable(foods).forEach(index=>foods.splice(index,1))
  eatEatable(players).forEach(index=>players.splice(index,1))

  }
               /* } else
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
          */
        

      
    
  
  // updating stuff
  if(players.length>0){
  for(var j = 0 ; j< players.length; j += 1){
    const fooddata = [];
    const playersdata = [];
    // Updating foods
    for (let i = 0; i < foods.length; i += 1) {
      // see if its in the same range
      let dist = calculateDis(
        players[j].middot.x,
        players[j].middot.y,
        foods[i].x,
        foods[i].y);
      let itsok = false;
      if(players[j].zoom * zoomView  > dist) {
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
      let dist = calculateDis(
        players[j].middot.x,
        players[j].middot.y,
        players[i].middot.x,
        players[i].middot.y);     
        let itsok = false;
      if(players[j].zoom * zoomView  > dist) {
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

/**
 * eat smaller objects and increase the raduis of the players
 * @param {*} Objects other smaller players or food
 */
function eatEatable(Objects) {
let objectIndexesToRemove = [];

 players.forEach((player)=>{
    player.blobs.forEach((blob)=>{
      blob.constrain();
      // eat food event
      Objects.forEach((food,j)=>{
        const state = getCollisionState(blob, food, 0);
        if (state === collisionState.firstPlayerBigger) {
          blob.r += food.r * 0.8;
          objectIndexesToRemove.push(j);
        } 
      })
    })
  })

  return objectIndexesToRemove;   
}

function splitingtimeer() {
  for (let i = 0; i < players.length; i += 1) {
    for (let j = 0; j < players[i].blobs.length; j += 1) {
      players[i].blobs[j].timertoeatme -= 1;
    }
  }
}
///// Timers
setInterval(addFood, timerForFoodMaker);
setInterval(reduiceRadiusBy, timerPlayerGetsOld);
setInterval(Updates, timerPlayersUpdating);
setInterval(splitingtimeer, periodTimeCounter);
setInterval(comparisionwithweight, comparisonTimer);
console.log(process.env.SecuredCode);
