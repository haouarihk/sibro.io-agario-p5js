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
let color = [];
// Login
function login() {
  Nickname = document.getElementById('nickname').value;
  const blobs = [];
  color = [random(50, 200), random(50, 200), random(50, 200)];
  blobs.push(new Blob(Nickname, 0, 0, 50, color));
  player = new Player(socket.id, 'Guest');
  console.log(`YOOO ${blobs.length}`);
  player.blobs = blobs;
  socket.on('connect', () => {
    player.id = socket.id;
    player.blobs = blobs;
    const data = {
      c: color,
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
        pips[i].blobs[j].r,
        pips[i].c));
    }
    players[i] = new Player(pips[i].id, pips[i].nickname);
    players[i].blobs = blobs;
    // console.log(" has "+ blobs.length);
    if (player.id === pips[i].id) {
      player = players[i];
      player.blobs = blobs;
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

function draw() {
  createCanvas(windowWidth, windowHeight - 22);
  translate(width / 2, height / 2);
  // search for the player in the players array
  // to find his own index and store it on indexofplayer
  const il = searchindexwithid(player.id, players);
  if (il !== false) {
    indexofplayer = il;
  }
  // zooming accoring to the mouse wheel
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
  if (searchindexwithid(player.id, players) !== false) {
    const data = {
      mousex: mouseX,
      mousey: mouseY,
      id: player.id,
      width,
      height,
      c: [player.c1, player.c2, player.c3],
    };
    socket.emit('updateplayer', data);
  }
}
