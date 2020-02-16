var express = require('express');
var app = express();
var server = app.listen(3000);
var players = [];
var foods = [];
var foodscount = 10000;
app.use(express.static('public'));
console.log("server is running");

function generateid() {
  var idnew = Math.floor(Math.random() * (50000 + foodscount));
  for (var i = 0; i < foods.length; i++) {
    if (foods.id == idnew) {
      return generateid();
    } else {
      return idnew;
    }

  }
}
function generatex(ppls, foodi) {
  var x = Math.floor(Math.random() * 10000) - 5000;
  var y = Math.floor(Math.random() * 10000) - 5000;
  var prob = 0;

  for (var i = 0; i < foodi.length; i++) {
    if (foodi[i].x == x) {
      if (foodi[i].y == y) {
        prob++;
      }
    }
  }
  for (var i = 0; i < ppls.length; i++) {
    if (ppls[i].x == x) {
      if (ppls[i].y == y) {
        prob++;
      }
    }
    var c=ppls[i].r-(calculatedis(ppls[i].x,ppls[i].y,x,y));
    if(c<0){
      prob++;
    }
  }
  if (prob != 0) {
    return generatex(ppls, foodi);
  }
  if (prob == 0 || posi != 0) {
    return { xx: x, yy: y };
  }

}
function calculatedis(x1,y1, x2,y2) {
  var xx = (x1 -x2) * (x1 - x2);
  var yy = (y1 - y2) * (y1 - y2);
  return d = Math.sqrt(xx + yy) ;
  
}
function calculatedis(other, other2) {
  var xx = (other2.x - other.x) * (other2.x - other.x);
  var yy = (other2.y - other.y) * (other2.y - other.y);
  var d = Math.sqrt(xx + yy) +50;
  if (d < other.r + other2.r) {
    if (other.r > other2.r) {
      return other.id;
    } else if (other.r == other2.r) {
      return null;
    } else {
      return other2.id;
    }
  }else{return null;}
}
function food() {
  this.generate = function () {
    var saved = generatex(players, foods);
    this.x = saved.xx;
    this.y = saved.yy;
    this.id = generateid();
    this.r = Math.floor(Math.random() * 60) + 50;
  }
}
function blob(x,y,r){
  this.x=x;
  this.y=y;
  this.r=r;
  this.updatevel = function (velx, vely) {
    this.x = Math.min(Math.max(this.x, -5000), 5000);
    this.y = Math.min(Math.max(this.y, -5000), 5000);
    this.x += velx;
    this.y += vely;

  }
}
function smallpipi(id,blobs, x, y, r, c,nickname) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.c = c;
  this.blobs=blobs;
  this.nickname =nickname;
 
}

var sockets = require('socket.io');
var io = sockets(server);
io.sockets.on('connection', Connection);
io.sockets.on('disconnect', disconnection);
setInterval(foodgen, 300);
function foodgen() {
  var newfood = new food();
  newfood.generate();
  if (foods.length < foodscount) {
    foods.push(newfood);
    console.log(foods.length + '/' + foodscount + ' new food with id:' + newfood.id + ' in' + newfood.x + ',' + newfood.y);
  }
}
setInterval(updatepipis, 24);
function updatepipis() {
  comparisionwithweight();
  var data = [];
  for (var i = 0; i < players.length; i++) {
    data.push({ blobs:players[i].blobs,id: players[i].id, x: players[i].x, y: players[i].y, r: players[i].r, nickname: players[i].nickname });
    
  }
  var data2 = [];
  for (var i = 0; i < foods.length; i++) {
    data2.push({ id: foods[i].id, x: foods[i].x, y: foods[i].y, r: foods[i].r });
  }
  if(players.length!=0){
  for(var i=0; i<players.length;i++){
    for(var j=0;j<foods.length;j++){
      var killer= calculatedis(players[i],foods[j]);
      if(killer!=null){
        var aten = foods[j].id;
        players[i].r+=foods[j].r/(players[i].r*0.2);
        foods.splice(j,1);
      }
    }
    for(var j=0;j<players.length;j++){
      if(players[j].velx==0){if(players[j].vely==0)players.splice(j,1);}
      var killer= calculatedis(players[i],players[j]);
      if(killer!=null){

        if(killer==players[j].id){
          var aten = players[i].id;
          var ater = players[j].id;
        players[j].r+=players[i].r*0.8;
        players.splice(i,1);
        }else
        if(killer==players[i].id){
          var aten = players[j].id;
          var ater = players[i].id;
        players[i].r+=players[j].r*0.8;
        players.splice(j,1);
        }
        var warfeilddata={aterid:ater,atenid:aten};
        io.sockets.emit('warfeilddata', warfeilddata);
      }
    }
  }}
  
  io.sockets.emit('updateyamies', data2);
  io.sockets.emit('updatepipis', data);
}


function Connection(socket) {
  console.log("new connection:" + socket.id);
  //new connection plays one time
  socket.on('ready', playerjoined);
  function playerjoined(newplayer) {
    var blobs=[];
    //for(var i =0;i<newplayer.Blobs.length;i++)
    {
      //blobs.push(new blob(newplayer.b[i].x,newplayer.b[i].y,200));
    }
    blobs.push(new blob(newplayer.b.x,newplayer.b.y,200));
    players.push(new smallpipi(newplayer.id,blobs, newplayer.x, newplayer.y, 200, newplayer.c,newplayer.nickname));
    console.log("new player got pushed");
  }
  socket.on('updateplayer', updateplayer);
  function updateplayer(uplayer) {
    var i;
    for (let index = 0; index < players.length; index++) {
      if (players[index].id == uplayer.id) {
        i = index;
        //console.log('Got' + uplayer.velx);
        //players[i].updatevel(uplayer.velx, uplayer.vely);
        for(let i = 0 ; i<players[index].blobs.length;i++){
          players[index].blobs[i].updatevel(uplayer.velx, uplayer.vely);
          
        }
      }
    }
  }
  socket.on('split',splitplayer);
  function splitplayer(data){
    console.log(data.id+' wants to split');
    for(var i=0;i<players.length;i++){
      if(players[i].id==data.id){
        var blobs=players[i].blobs;
        for(var j=0;j<blobs.length;j++){
          blobs.push(new blob(blobs[j].x,blobs[j].y,blobs[j].r/2));
          blobs[j].r/=2;
        }
        //players[i].blobs[0].r=players[i].r/2;
      }
    }
  }


}

function disconnection(socket) {
  console.log('Got disconnect!');

  var i = players.indexOf(socket);
  players.splice(i, 1);
}
function waittilnotnull(data) {
  if (data == null) {
    return waittilnotnull(data);
  } else {
    return data;
  }
}
function comparisionwithweight(){
  players.sort( compare );
}
function compare( a, b ) {
  if ( a.r< b.r ){
    return 1;
  }
  if ( a.r > b.r ){
    return -1;
  }
  return 0;
}

