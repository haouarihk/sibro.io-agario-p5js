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
let lines = [];
let zoom = 1; // screen zoom
let indexofplayer = 0; // index of this player in the players array
let nickname = ''; // nickname of this player
//login componet saved here//
let username = ''; ///////////
let password = ''; //
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
  pips.forEach((pip, i) => {
    let blobs = [];
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
      blobs.forEach((blob, k) => {
        let oldr = blob.r;
        if (players[i].blobs[k]) {
          oldr = players[i].blobs[k].r;
        }
        players[i].blobs[k] = blob;
        players[i].blobs[k].r = oldr;
        if (players[i].blobs[k]) {
          players[i].blobs[k].setrad(blob.r);
        }
      })

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
  yams.forEach(yam => {
    // show the food if its in range
    if (yam.isitok) {
      foods.push(new Food(yam.type, yam.x, yam.y, yam.r, yam.id));
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
// this function slice food when it get eaten
function killthisfoodwiththatid(fooddata) {
  let index = getIndexById(fooddata, foods);

  if (index !== -1) {
    foods.splice(index, 1);
  }
}
// this function called when the player about to join
function login() {


  // for login
  if (connected) {
    socket.disconnect()
  }
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
      foods = [];
      settings.foods.forEach(food => {
        foods.push(new Food(food.type, food.x, food.y, food.r, food.id))
      });
      player.blobs = settings.blobs;
      MinSizeToSplit = settings.minSizeToSplit;
      console.log(socket.id);
      connected = true;
      // listening for thoes when he is connected
      socket.on('updatepipis', updatepeeps);
      socket.on('updateyamies', updateyamies);
      socket.on('warfeilddata', warfeilddata);
      socket.on('recivechat', reciveTextChat);
      socket.on('foodeatenEvent', killthisfoodwiththatid);
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
  posWheel = constrain(posWheel, 1, 9000);
}
// the chat
// this for wether he is playing or typing
let showinput = false;
let typedodo = 0;
// 0 means play
// 1 means type inside the box
// 2 means type outside the box
// this is a built in function in p5.js
function keyTyped() {
  // if he is not in the game, don't bother
  if (!connected) {
    return;
  }
  if (typedodo === 2) {
    // typing ....
    inputfeild.value(inputfeild.value() + key);
  }
}

function contains(ax, ay, aw, x, y) {
  return (x > ax && x < ax + aw && y > ay && y < ay + 36);
}

function mousePressed() {
  let x = (width) / 300 + 10
  let y = 5 * height / 7 + 150
  let w = 380;
  console.log(x + "," + y + "," + w + "," + mouseX + "," + mouseY)
  if (contains(x, y, w, mouseX, mouseY)) {
    console.log("YOOOOOO")
    typedodo = 1;
  } else {
    typedodo = 0;
  }
}
// this is a built in function in p5.js
function keyPressed() {

  // if he is not in the game, don't bother
  if (!connected) {
    return;
  }
  if (typedodo === 2) {
    // exit chat
    if (keyCode === ESCAPE) {
      // escape from the chatbox
      typedodo = 0;
    }
    // type
    if (keyIsDown(ENTER)) {
      // trigering if he want to type
      typedodo = 0;
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
    // delete
    if (keyIsDown(BACKSPACE)) {
      // if he wants to delete letters (BACKSPACE)
      inputfeild.value(inputfeild.value().substring(0, inputfeild.value().length - 1));
    }
  } else
  if (typedodo === 0) {
    // exit game
    if (keyIsDown(ESCAPE)) {
      // escape from the game (ESCAPE)
      socket.disconnect();
      connected = false;
    }
    // playing
    // if he is not typing, then he is playing
    if (key === ' ') {
      // the split key (Spacebar)
      socket.emit('split');
    }
    if (key === 't' || keyIsDown(ENTER)) {
      // to start typing (t)
      inputfeild.value('');
      typedodo = 2;
    }
  } else
  if (typedodo === 1) {
    // exit chat
    if (keyCode === ESCAPE) {
      inputfeild.hide();
      // escape from the chatbox
      typedodo = 0;
    }
    if (keyCode === ENTER) {
      // trigering if he want to type
      typedodo = 0;
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
  let indexofar = -1;
  array.forEach((ar, i) => {
    if (ar.id === id) {
      indexofar = i;
    }
  });
  return indexofar;
}
// ge the center dot
function getCenterDot(blobs) {  
  // the form of this equation is:
  // g1 = sum((a * Ma) + (b * Mb) + ...) i=>length
  // r = sum(Ma + Mb + ...) i => length
  if (blobs) {
    const center = createVector(0, 0);
    let radiouseSum = 0;
    blobs.forEach(blob => {
      center.x += (blob.x);
      center.y += (blob.y);
      //radiouseSum += blob.r;
    });
    // g = g1 / (length + r)
    center.x /= (blobs.length);
    center.y /= (blobs.length);
    // g =
    return center;
  }
  // console.error("There is something wrong with getting the center blob is not defined getCenterDot()");
  return new Point(0, 0);
}

/////////////////////////
/// chat stuff //////////
/////////////////////////
let inputfeild; //// for the textfeild of the chatbox
let heistyping = false; //
let chatbox; //
let chatlist = []; //
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
let newbe = 0;

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
  zoom = lerp(zoom, newzoom, 1);
  // this is a built in p5.js function to scale screen
  let sumr = 0;
  player.blobs.forEach(blob => {
    sumr += blob.r;
  });
  newbe = lerp(newbe, player.blobs.length * 120 / (sumr + zoom - 100), 0.2)
  scale(newbe);
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
  // show all the lines
  lines.forEach(line => {
    line.show();
  })
  // built in p5.js function 
  stroke(255);
  strokeWeight(20);
  // show all the players in the array
  for(let i = players.length-1;i>=0;i--){
    if (players[i]) {
      players[i].show(br);
    }
  }
 
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