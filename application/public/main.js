/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let socket; // socket.io
let player; // this player
let players = []; // players in the world
let foods = []; // foods in the world
let zoom = 1; // screen zoom
let indexofplayer = 0; // index of this player in the players array
let nickname = ''; // nickname of this player
//login componet saved here//
let username = '';///////////
let password = '';//
////////////////////
let MinSizeToSplit = 200; // informations sets by the server
let color = []; // player color
let connected = false; // connection
// built in p5.js function (one time before anything happen)
function preload() {
  inputfeild = createInput();
  inputfeild.hide();
  br = loadFont('fonts/br2.ttf');
}
// this function updates the players list
function updatepeeps(pips) {
  players = [];

  pips.forEach((pip, i) => {
    const blobs = [];
    // this for taking all the blobs from pip and store it in this variable
    if (pip.isitok) {
      pip.blobs.forEach(blob => {
        blobs.push(new Blob(pip.nickname,
          blob.x,
          blob.y,
          blob.r,
          pip.c));
      });
    }
    // this function for updaing/creating player in the players list
    // with the same index
    players[i] = new Player(pip.id, pip.nickname);
    players[i].isitshown = pip.isitok;
    // this askes if the player is within my range
    if (pip.isitok) {
      players[i].blobs = blobs;
    }
    // this asks wether this player is me
    if (socket.id === pip.id) {
      player = players[i];
      player.blobs = players[i].blobs;
      indexofplayer = i;
    }
  });

}
// this function updates the foods list
function updateyamies(yams) {
  foods = [];
  yams.forEach((yam, i) => {
    // show the food if its in range
    if (yam.isitok) {
      foods[i] = new Food(yam.type, yam.x, yam.y, yam.r, yam.id);
      foods[i].type = yam.type;
    }
  });
}
// this function would activate when the player is not playing but in
function imspectating() {

}
// not using that function , this function to let the player know when he get eaten
function warfeilddata(data) {
  if (data.aterid === player.id) {
    console.log('You KILLED HIM');
  } else if (data.atenid === player.id) {
    console.log('You are dead');
    imspectating();
  }
}
// this function for reciving texts
function reciveTextChat(data) {
  const datanickname = data.nickname;
  chatlist.push(new Chatline(data.message, datanickname, [255, 255, 0]));
}
// this function called when the player about to join
function login() {
  // for login
  socket = io();
  // for seting the nickname from html input feild
  nickname = document.getElementById('nickname').value;
  // random color for the player
  color = [random(50, 200), random(50, 200), random(50, 200)];
  player = new Player(socket.id, 'Guest');
  // when the player is connected
  socket.on('connect', () => {
    player.id = socket.id;
    player.blobs = [];
    const id = player.id;
    // the player sends to the server that he is connected/ready
    const data = {
      color,
      id,
      nickname
    };
    socket.emit('ready', data);
    // reciving from the server the new settings to start
    socket.on('set!', (settings) => {
      console.log(`YOOO ${socket.id}`);
      player.id = settings.id;
      player.blobs = settings.blobs;
      MinSizeToSplit = settings.minSizeToSplit;
      console.log(socket.id);
      connected = true;
      // listening for thoes when he is connected
      socket.on('updatepipis', updatepeeps);
      socket.on('updateyamies', updateyamies);
      socket.on('warfeilddata', warfeilddata);
      socket.on('recivechat', reciveTextChat);
      // this for an instant kick for the player
      socket.on('disconnectThatSoc', () => {
        player = null;
        players = [];
        socket.disconnect();
        connected = false;
        console.log('disconnection');
      });
    });
  });

}
// this function for login with an account , not used yet
function login2() {
  // taking username and password from html input feild
  username = document.getElementById('Username').value;
  password = document.getElementById('Password').value;
  // sending that data to the server to verify that is correct
  const data = {
    id: socket.id,
    user: username,
    pass: password,
  };
  socket.emit('login', data);
  // revciving the log from the server
  socket.on('loging', (a) => {
    console.log(a);
  })
}

let posWheel = 200;

function mouseWheel(event) {
  // to zoom in and out
  posWheel += event.delta;
  posWheel = constrain(posWheel, 1, 5000);
}
// the chat
// this for wether he is playing or typing
let showinput = false;
// this is a built in function in p5.js
function keyTyped() {
  // if he is not in the game, don't bother
  if (!connected) {
    return;
  }
  if (heistyping) {
    // typing ....
    inputfeild.value(inputfeild.value() + key);
  } else {
    // if he is not typing, then he is playing
    if (key === ' ') {
      // the split key (Spacebar)
      socket.emit('split');
    }
    if (key === 't') {
      // to start typing (t)
      inputfeild.value('');
      heistyping = true;
    }
  }
}
// this is a built in function in p5.js
function keyPressed() {
  // if he is not in the game, don't bother
  if (!connected) {
    return;
  }
  // exit game
  if (keyCode === ESCAPE) {
    // escape from the game (ESCAPE)
    socket.disconnect();
    connected = false;
  }
  // type
  if (heistyping) {
    if (keyCode === ENTER) {
      // trigering if he want to type
      heistyping = !heistyping;
      // if he typed something
      if (inputfeild.value().length > 0) {
        // send what he has typed
        data = {
          // to: is to who he want to send the message
          // all mean to everyone
          to: 'all',
          nickname: player.nickname,
          message: inputfeild.value()
        };
        socket.emit('chatup', data);
      }
      // clean afterwords
      inputfeild.value('');
    }
  }
  // delete
  if (keyCode === BACKSPACE) {
    // if he wants to delete letters (BACKSPACE)
    inputfeild.value(inputfeild.value().substring(0, inputfeild.value().length - 1));
  }

}


// this is a built in function in p5.js (one time function)
function setup() {
  // start to make sure that he is disconnected
  connected = false;
  // When press play in the html
  document.getElementById('play').onclick = function onclickplay() {
    // if he is connected then disconnect him
    if (connected) {
      socket.disconnect();
    }
    // join the game
    login();
  };
  // when pressing the login button instead
  document.getElementById('login').onclick = function onclickplay() {
    login2();
  };
}

function getIndexById(id, array) {
  array.forEach((player, i) => {
    if (player.id === id) {
      return i;
      console.log(i);
    }
  });
  return -1;
}
// ge the center dot
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

/////////////////////////
/// chat stuff //////////
/////////////////////////
let inputfeild;      //// for the textfeild of the chatbox
let heistyping = false;//
let chatbox;           //
let chatlist = [];     //
/////////////////////////

// not used function for detecting if he is typing or not
function detectwetherheistyping() {
  if (inputfeild.value() !== savedtextfeild) {
    savedtextfeild = inputfeild.value();
    heistyping = true;
  } else {
    heistyping = false;
  }
}

function showMenu() {
  // hide game
  document.getElementById("game").style.visibility = "hidden";
  // show menu
  document.getElementById("Login").style.visibility = "visible";
  // if nickname box is larger than 10 contrain it
  if (document.getElementById('nickname').value.length > 10) {
    document.getElementById('nickname').value = document.getElementById('nickname').value.substring(0, 9);
  }
}

function showGame() {
  // hiding the lobby
  document.getElementById("Login").style.visibility = "hidden";
  // showing the game
  document.getElementById("game").style.visibility = "visible";
  // background color (built in p5.js function)
  background(0);
  // Making top 10 list 
  const list = new Listing((6 * width) / 7, height / 30, players);
  // Making chatbox 
  chatbox = new Chatbox((width) / 300, 5 * height / 7, []);
  // Setting chatbox list chat
  chatbox.setChat(chatlist);
  // Showing them
  list.show();
  chatbox.show();
  // Translating point of view from the edge of the screen(0,0) 
  // to the middle of the screen(width/2,height/2) to become (0,0)
  // built in p5.js function.
  translate(width / 2, height / 2);
  // zooming accoring to the mouse wheel
  const newzoom = posWheel;
  zoom = lerp(zoom, newzoom, 0.2);
  // this is a built in p5.js function to scale screen
  scale(120 / (zoom));
  // calculating the middle point
  const middot = getCenterDot(player.blobs);
  // translating according to this player location
  translate(-middot.x, -middot.y);
  // show all the foods in the array
  foods.forEach(food => {
    if (food) {
      food.show();
    }
  });
  // built in p5.js function 
  stroke(255);
  strokeWeight(20);
  // show all the players in the array
  players.forEach(player => {
    if (player) {
      player.show(br);
    }
  });
  // mouseX, mouseY is built in p5.js functions
  const data = {
    mousex: mouseX,
    mousey: mouseY,
    zoomsize: parseInt(zoom),
    width,
    height,
    c: [player.c1, player.c2, player.c3],
  };
  socket.emit('updateplayer', data);
}
// built in function from p5.js (loop function)
function draw() {
  createCanvas(windowWidth, windowHeight);
  // if he is on the lobby
  if (!connected) {
    // show the menu
    showMenu();
    return;
  }
  // if he is playing
  showGame();

}