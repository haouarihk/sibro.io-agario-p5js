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
let nickname = '';
let username = '';
let password = '';
let MinSizeToSplit = 200;
let color = [];
let connected = false;
function preload() {
 br = loadFont('fonts/br2.ttf');
}
// Login
function updatepeeps(pips) {
  players = [];

  for (let i = 0; i < pips.length; i += 1) {
    const blobs = [];
    for (let j = 0; j < pips[i].blobs.length; j += 1) {
      if(pips[i].isitok){
        blobs.push(new Blob(pips[i].nickname,
          pips[i].blobs[j].x,
          pips[i].blobs[j].y,
          pips[i].blobs[j].r,
          pips[i].c));

      }
    }
    players[i] = new Player(pips[i].id, pips[i].nickname);
    if(pips[i].isitok){
      players[i].blobs = blobs;
    }
    if (socket.id === pips[i].id) {
      player = players[i];
      indexofplayer = i;
    }
  }
}
function updateyamies(yam) {
  foods = [];
  for (let i = 0; i < yam.length; i += 1) {
    if(yam[i].isitok) {
    foods[i] = new Food(yam.type, yam[i].x, yam[i].y, yam[i].r, yam[i].id);
    foods[i].type = yam.type;
    }
  }
}
// spectating
function imspectating() {

}
// not using that function 
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
  nickname = document.getElementById('nickname').value;
  const blobs = [];
  color = [random(50, 200), random(50, 200), random(50, 200)];
  player = new Player(socket.id, 'Guest');
  player.blobs = blobs;
  socket.on('connect', () => {
    player.id = socket.id;
    player.blobs = blobs;
    
    const id =player.id;
    const data = {color,id,nickname};

    socket.emit('ready', data);
    socket.on('set!', (settings) => {
      console.log(`YOOO ${socket.id}`);
      player.id = settings.id;
      player.blobs = blobs;
      MinSizeToSplit = settings.minSizeToSplit;
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
  username = document.getElementById('Username').value;
  password = document.getElementById('Password').value;

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
  if (!connected) { return; }
  if (key === ' ') {
    for (let j = 0; j < player.blobs.length; j += 1) {

      if (player.blobs[j].r > MinSizeToSplit) {
        socket.emit('split');
      }
    }
    // console.log('SPACEBAR DETECTED');
    // we need it to tell the server that
    // it got pressed
  }
  if (keyCode === ESCAPE) {
    socket.disconnect();
    connected = false;
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
function getCenterDot(blobs) {

  const center = createVector(0, 0);
  let radiouseSum = 0;
  // the form of this equation is:
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

function draw() {
  createCanvas(windowWidth, windowHeight - 22);
  // const menu = new Menu(width / 4, height / 4);
  if (!connected) {
    // background(0);
    // menu.show();
    document.getElementById("game").style.visibility = "hidden"; 
    document.getElementById("Login").style.visibility = "visible"; 
    if(document.getElementById('nickname').value.length > 10) {
      document.getElementById('nickname').value = document.getElementById('nickname').value.substring(0,9);
    }
    return;
  }
  document.getElementById("Login").style.visibility = "hidden"; 
  document.getElementById("game").style.visibility = "visible";
  // menu.hide();
  background(0);
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

  const middot = getCenterDot(player.blobs);
  translate(-middot.x, -middot.y);
  player.midpoint = middot;

  for (let index = 0; index < foods.length; index += 1) {
    if(foods[index]) {
      foods[index].show();
    }
  }
  stroke(255);
  strokeWeight(20);
  for (let index = 0; index < players.length; index += 1) {
    if(players[index]) {
      players[index].show(br);
    }
  }

  player.update();

  const data = {
    mousex: mouseX,
    mousey: mouseY,
    // id: socket.id,
    zoomsize:parseInt(zoom),
    width,
    height,
    c: [player.c1, player.c2, player.c3],
  };
  socket.emit('updateplayer', data);
}
