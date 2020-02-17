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
let username = '';
let password = '';
// Login
function login() {
  Nickname = document.getElementById('nickname').value;
  const blobs = [];
  blobs.push(new Blob(Nickname, 0, 0, 50));
  player = new Player(socket.id, 'Guest');
  player.blobs = blobs;
  console.log(`YOOO ${blobs.length}`);
  socket.on('connect', () => {
    player.id = socket.id;
    const data = {
      c: color(random(100, 255), random(0, 120), random(0, 120)),
      id: player.id,
      nickname: Nickname,
    }; socket.emit('ready', data);
  });
}
function login2() {
  username = document.getElementById('username').value;
  password = document.getElementById('password').value;

  const data = {
    id: player.id,
    user: username,
    pass: password,
  }; socket.emit('login', data);
}
// controls
let pos = 200;
function mouseWheel(event) {
  // to zoom in and out
  pos += event.delta;
  pos = constrain(pos, 1, 5000);
}
function keyPressed() {
  if (key === 's') {
    // console.log('SPACEBAR DETECTED');
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
      blobs.push(new Blob(pips[i].nickname,
        pips[i].blobs[j].x,
        pips[i].blobs[j].y,
        pips[i].blobs[j].r));
    }
    players[i] = new Player(pips[i].id, pips[i].nickname);
    players[i].blobs = blobs;
    // console.log(" has "+ blobs.length);
    if (player.id === pips[i].id) {
      player = players[i];
      indexofplayer = i;
    }
  }
}
function updateyamies(yam) {
  foods = [];
  for (let i = 0; i < yam.length; i += 1) {
    foods[i] = new Food(yam.type, yam[i].x, yam[i].y, yam[i].r, yam[i].id);
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
  socket = io();
  this.connecttotheserver = function connetingtoserver() {
    socket = io();
  };
  // When press play in the html
  document.getElementById('play').onclick = function onclickplay() {
    socket = io();
    login();
  };
  login();
  document.getElementById('login').onclick = function onclickplay() {
    login2();
  };
  socket.on('updatepipis', updatepeeps);
  socket.on('updateyamies', updateyamies);
  socket.on('warfeilddata', warfeilddata);
}

// functions
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
  translate(width / 2, height / 2);
  const il = searchindexwithid(player.id, players);
  if (il !== false) {
    indexofplayer = il;
  }
  const newzoom = pos;
  zoom = lerp(zoom, newzoom, 0.2);
  scale(120 / (zoom));

  const middot = calculatemid(player.blobs);
  translate(-middot.x, -middot.y);
  player.midpoint = middot;

  for (let index = 0; index < foods.length; index += 1) {
    foods[index].show();
  }
  for (let index = 0; index < players.length; index += 1) {
    players[index].show();
  }
  player.update();

  const data = {
    mousex: mouseX,
    mousey: mouseY,
    id: player.id,
    width,
    height,
  };
  socket.emit('updateplayer', data);
}
