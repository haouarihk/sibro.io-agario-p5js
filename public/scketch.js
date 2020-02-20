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
let MinSizeToSplit = 200;
let color = [];
let connected = false;
// Login
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
    if (socket.id === pips[i].id) {
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
function login() {
  socket = io();
  Nickname = document.getElementById('nickname').value;
  const blobs = [];
  color = [random(50, 200), random(50, 200), random(50, 200)];
  player = new Player(socket.id, 'Guest');
  player.blobs = blobs;
  socket.on('connect', () => {
    player.id = socket.id;
    player.blobs = blobs;
    const data = {
      c: color,
      id: player.id,
      nickname: Nickname,
    }; socket.emit('ready', data);
    socket.on('set!', (settings) => {
      console.log(`YOOO ${socket.id}`);
      player.id = settings.id;
      player.blobs = blobs;
      MinSizeToSplit = settings.minisizetosplit;
      console.log(socket.id);
      connected = true;
      socket.on('updatepipis', updatepeeps);
      socket.on('updateyamies', updateyamies);
      socket.on('warfeilddata', warfeilddata);
    });
  });
  socket.on('disconnectThatSoc', () => {
    player = null;
    players = [];
    socket.disconnect();
    connected = false;
    console.log('disconnection');
  });
}
function login2() {
  username = document.getElementById('username').value;
  password = document.getElementById('password').value;

  const data = {
    id: socket.id,
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
    for (let j = 0; j < player.blobs.length; j += 1) {
      if (player.blobs[j].r > MinSizeToSplit) {
        data = { // id: socket.id
        };
        socket.emit('split', data);
      }
    }
    // console.log('SPACEBAR DETECTED');
    // we need it to tell the server that
    // it got pressed
  }
}

// updates


// setup
function setup() {
  connected = false;
  // socket = io();
  // socket.disconnect();
  this.connecttotheserver = function connetingtoserver() {
    socket = io();
  };
  // When press play in the html
  document.getElementById('play').onclick = function onclickplay() {
    if (connected) { socket.disconnect(); }
    login();
  };
  // login();
  document.getElementById('login').onclick = function onclickplay() {
    login2();
  };
}

// functions
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

function draw() {
createCanvas(windowWidth, windowHeight - 22);
if (!connected) {
  const menu = new Menu(width / 4, height / 4);
  menu.show();
  return;
 }
  fill(200);
  rect((6 * width) / 7, height / 20, 200, 400);
  const list = new Listing((6 * width) / 7, height / 20, players);
  list.show();
  translate(width / 2, height / 2);
  // search for the player in the players array
  // to find his own index and store it on indexofplayer
  const il = searchindexwithid(socket.id, players);
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

  const data = {
    mousex: mouseX,
    mousey: mouseY,
    // id: socket.id,
    width,
    height,
    c: [player.c1, player.c2, player.c3],
  };
  socket.emit('updateplayer', data);
}
