/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const express = require('express');

const app = express();
const server = app.listen(3000);
const players = [];
const foods = [];
const foodscount = 10000;
app.use(express.static('public'));
const sockets = require('socket.io');

const io = sockets(server);
console.log('server is running');

function GenerateId() {
  const idnew = Math.floor(Math.random() * (50000 + foodscount));
  for (let i = 0; i < foods.length; i += 1) {
    if (foods.id === idnew) {
      return GenerateId();
    } return idnew;
  }
}
function calculatedis(x1, y1, x2, y2) {
  const xx = (x1 - x2) * (x1 - x2);
  const yy = (y1 - y2) * (y1 - y2);
  const d = Math.sqrt(xx + yy);
  return d;
}
function Generatex(ppls, foodi) {
  const x = Math.floor(Math.random() * 10000) - 5000;
  const y = Math.floor(Math.random() * 10000) - 5000;
  let prob = 0;

  for (let i = 0; i < foodi.length; i += 1) {
    if (foodi[i].x === x) {
      if (foodi[i].y === y) {
        prob += 1;
      }
    }
  }
  for (let i = 0; i < ppls.length; i += 1) {
    if (ppls[i].x === x) {
      if (ppls[i].y === y) {
        prob += 1;
      }
    }
    const c = ppls[i].r - (calculatedis(ppls[i].x, ppls[i].y, x, y));
    if (c < 0) {
      prob += 1;
    }
  }
  if (prob !== 0) {
    return Generatex(ppls, foodi);
  }
  if (prob === 0 || posi !== 0) {
    return { xx: x, yy: y };
  }
}

function calculatedis1(other, other2) {
  const xx = (other2.x - other.x) * (other2.x - other.x);
  const yy = (other2.y - other.y) * (other2.y - other.y);
  const d = Math.sqrt(xx + yy) + 50;
  if (d < other.r + other2.r) {
    if (other.r > other2.r) {
      return 1;
    } if (other.r === other2.r) {
      return null;
    }
    return 2;
  } return null;
}

function Food() {
  this.generate = function generating() {
    const saved = Generatex(players, foods);
    this.x = saved.xx;
    this.y = saved.yy;
    this.id = GenerateId();
    this.r = Math.floor(Math.random() * 60) + 50;
  };
}
function Blob(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.updatevel = function updatingvel(velx, vely) {
    this.x = Math.min(Math.max(this.x, -5000), 5000);
    this.y = Math.min(Math.max(this.y, -5000), 5000);
    this.x += (200 * velx) / this.r;
    this.y += (200 * vely) / this.r;
  };
}
function SmallPipi(id, blobs, x, y, r, c, nickname) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.c = c;
  this.blobs = blobs;
  this.nickname = nickname;
}
function Connection(socket) {
  console.log(`new connection:${socket.id}`);
  // new connection plays one time
  function playerjoined(newplayer) {
    const blobs = [];
    blobs.push(new Blob(newplayer.b.x, newplayer.b.y, 200));
    players.push(new SmallPipi(newplayer.id,
      blobs,
      newplayer.x,
      newplayer.y,
      200,
      newplayer.c,
      newplayer.nickname));
  }
  socket.on('ready', playerjoined);


  function updateplayer(uplayer) {
    for (let index = 0; index < players.length; index += 1) {
      if (players[index].id === uplayer.id) {
        i = index;

        // players[i].updatevel(uplayer.velx, uplayer.vely);
        for (let i = 0; i < players[index].blobs.length; i += 1) {
          // players[index].blobs[i].updatevel(uplayer.velx, uplayer.vely);
          players[index].blobs[i].updatevel(uplayer.blobsvelx[i], uplayer.blobsvely[i]);
        }
      }
    }
  }
  socket.on('updateplayer', updateplayer);


  function splitplayer(data) {
    console.log(`${data.id} wants to split`);
    for (let i = 0; i < players.length; i += 1) {
      if (players[i].id === data.id) {
        const { blobs } = players[i];
        const newblobs = [];
        if (players[i].blobs.length < 8) {
          for (let j = 0; j < players[i].blobs.length; j += 1) {
            if (players[i].blobs.r >= 50) {
              newblobs.push(new Blob(blobs[j].x, blobs[j].y, blobs[j].r / 2));
              // players[i].blobs[j].r /= 2;
            }
          }
          for (let j = 0; j < newblobs.length; j += 1) {
            players[i].blobs.push(newblobs[j]);
          }
          // console.log(players[i].blobs[1].x);
        }
      }
    }
  }
  socket.on('split', splitplayer);
}
function disconnection(socket) {
  console.log('Got disconnect!');

  const i = players.indexOf(socket);
  players.splice(i, 1);
}
io.sockets.on('connection', Connection);
io.sockets.on('disconnect', disconnection);
function foodgen() {
  const newfood = new Food();
  newfood.generate();
  if (foods.length < foodscount) {
    foods.push(newfood);
    console.log(`${foods.length}/${foodscount} new food with id:${newfood.id} in${newfood.x},${newfood.y}`);
  }
}
setInterval(foodgen, 300);
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
function updatepipis() {
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
          const killer = calculatedis1(players[i].blobs[k], foods[j]);
          if (killer !== 0) {
            players[i].blobs[k].r += foods[j].r / (players[i].blobs[k].r * 0.2);
            foods.splice(j, 1);
          }
        }
      }
      // player(players[i]) eat other player
      for (let j = 0; j < players.length; j += 1) {
        if (players[j].velx === 0) { if (players[j].vely === 0) players.splice(j, 1); }
        for (let k = 0; k < players[j].blobs.length; k += 1) {
          for (let l = 0; l < players[i].blobs.length; l += 1) {
            const killer = calculatedis1(players[i].blobs[l], players[j].blobs[k]);

            if (killer !== 0) {
              if (killer === 1) {
                players[i].blobs[l].r += players[j].blobs[k].r * 0.8;
                players[j].blobs.splice(k, 1);
              } else if (killer === 2) {
                players[j].blobs[k].r += players[i].blobs[l].r * 0.8;
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

  io.sockets.emit('updateyamies', data2);
  io.sockets.emit('updatepipis', data);
}
setInterval(updatepipis, 24);
