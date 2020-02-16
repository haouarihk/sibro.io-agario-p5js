/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let socket;
let player;
let players = [];
let foods = [];
let zoom = 1;
let indexofplayer = 0;
let Nickname = '';
// Login
function login() {
  Nickname = document.getElementById('nickname').value;
  const blobs = [];
  blobs.push(new Blob(0, 0, 50));
  player = new Player(blobs, socket.id, 'Guest');
  // player.blobs=blobs;
  console.log(`YOOO ${blobs.length}`);
  socket.on('connect', () => {
    player.id = socket.id;
    const data = {
      x: player.pos.x,
      y: player.pos.y,
      c: color(random(100, 255), random(0, 120), random(0, 120)),
      b: { x: 0, y: 0, r: 0 },
      id: player.id,
      nickname: Nickname,
    }; socket.emit('ready', data);
  });
}
// controls
let pos = 200;
function mouseWheel(event) {
  // to zoom in and out
  pos += event.delta;
  pos = constrain(pos, 1, 2001);
}
function keyPressed() {
  if (key === 's') {
    console.log('SPACEBAR DETECTED');
    // we need it to tell the server that
    // it got pressed
    data = { id: player.id };
    socket.emit('split', data);
  }
}
// updates
function updatepeeps(pips) {
  players = [];

  for (let i = 0; i < pips.length; i += 1) {
    const blobs = [];
    // players[i].updatepos(pips[i].x, pips[i].y);
    for (let j = 0; j < pips[i].blobs.length; j += 1) {
      const newblob = new Blob(pips[i].blobs[j].x, pips[i].blobs[j].y, pips[i].blobs[j].r);
      blobs.push(newblob);
    }
    players[i] = new Player(blobs, pips[i].id, pips[i].nickname);
    players[i].r = pips[i].r;

    // console.log(" has "+ blobs.length);
    if (player.id === pips[i].id) {
      // player.updatepos(pips[i].x, pips[i].y);
      player.r = lerp(parseInt(player.r), pips[i].r, 0.8);
      player.blobs = blobs;
      indexofplayer = i;
    }

    // console.log('list players updated' );
  }
}
function updateyamies(yam) {
  foods = [];
  for (let i = 0; i < yam.length; i += 1) {
    foods[i] = new Food(0, yam[i].x, yam[i].y, yam[i].r, yam[i].id);
  }
}
// spectating
function imspectating() {

}
function warfeilddata(data) {
  if (data.aterid === player.id) {
    console.log('You KILLED HIM');
  } else if (data.atenid === player.id) {
    console.log('You are dead');
    imspectating();
  }
}

// setup
function setup() {
  socket = io.connect('http://localhost:3000/');
  this.connecttotheserver = function connetingtoserver() {
    socket = io.connect('http://localhost:3000/');
  };
  document.getElementById('play').onclick = function onclickplay() {
    socket = io.connect('http://localhost:3000/');
    login();
  };
  login();
  socket.on('updatepipis', updatepeeps);
  socket.on('updateyamies', updateyamies);
  socket.on('warfeilddata', warfeilddata);
}

// functions
function searchindexwithid(id) {
  for (let i = 0; i < players.length; i += 1) {
    if (this.players[i].id === id) {
      return i;
    }
    return 0;
  }
}
function calculatemid(arraydots) {
  this.Mid = function mido() { this.x = 0; this.y = 0; };
  const middle = new this.Mid();
  for (let i = 0; i < arraydots.length; i += 1) {
    middle.x += arraydots[i].x;
    middle.y += arraydots[i].y;
  }

  middle.x /= (arraydots.length);
  middle.y /= (arraydots.length);
  return middle;
}

function draw() {
  createCanvas(windowWidth, windowHeight - 22);
  // background(255);
  fill(240);
  square(width, height, 100);
  translate(width / 2, height / 2);
  for (let i = 0; i < players.length; i += 1) {
    if (player.id === players[i].id) {
      indexofplayer = i;
      player.r = players[i].r;
    }
  }
  const newzoom = pos;
  zoom = lerp(zoom, newzoom, 0.2);
  // console.log(newzoom);
  scale(120 / (zoom));
  const middot = calculatemid(player.blobs);
  translate(-middot.x, -middot.y);


  // fill(100);
  // square(-5000, -5000, 10000);

  for (let index = 0; index < foods.length; index += 1) {
    foods[index].show();
  }
  for (let index = 0; index < players.length; index += 1) {
    players[index].show();
  }

  // player.update();
  for (let index = 0; index < player.blobs.length; index += 1) {
    player.blobs[index].update();
  }
  // console.log(player.pos);
  // player.show();
  // player.constrain();
  const blobsvelxx = [];
  const blobsvelyy = [];
  for (let index = 0; index < player.blobs.length; index += 1) {
    blobsvelxx.push(player.blobs[index].vel.x);
    blobsvelyy.push(player.blobs[index].vel.y);
  }

  const data = {
    velx: player.vx,
    vely: player.vy,
    blobsvelx: blobsvelxx,
    blobsvely: blobsvelyy,
    id: player.id,
  };
  socket.emit('updateplayer', data);
}
