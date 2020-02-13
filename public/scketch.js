var socket;
var player;
var players = [];
var foods = [];
var zoom = 1;
var id = '';
var indexofplayer = 0;

function login() {

    player = new Player(random(-width, width), random(-height, height), socket.id, 'Guest');

    socket.on('connect', function () {
    player.id = socket.id; var data = {
        x: player.pos.x,
        y: player.pos.y,
        c: color(random(100, 255), random(0, 120), random(0, 120)),
        id: player.id

    }; socket.emit('ready', data);
    });

}
var pos=1;
function mouseWheel(event) {
    //print(pos);
    //to zoom in and out
    pos += event.delta;
  }
function setup() {
    socket = io.connect('http://localhost:3000/');
    this.connecttotheserver = function () {
        socket = io.connect('http://localhost:3000/');
    }

    login()
    socket.on('updatepipis', updatepeeps);
    socket.on('updateyamies', updateyamies);
    
}

function searchindexwithid(id){
    for(var i=0;i<players.length;i++){
        if(this.players[i].id==id){
            return i;
        }
    }
}
function draw() {
    
    createCanvas(windowWidth, windowHeight);
    //background(255);
    translate(width / 2, height / 2);
    for (let i = 0; i < players.length; i++) {
        if (player.id == players[i].id) {
            indexofplayer=i;
            player.r=players[i].r;
        }
    }
    var newzoom = 600/pos;
    zoom = lerp(zoom, newzoom, 0.5);
        scale(zoom+120/[player.r]); 
    translate(-player.pos.x, -player.pos.y);
    

    fill(100);
    square(-5000, -5000, 10000);
    for (let index = 0; index < foods.length; index++) {
        foods[index].show();
    }
    for (let index = 0; index < players.length; index++) {
        players[index].show();
    }
    
    player.update();
    //console.log(player.pos);
    //player.show();
    player.constrain();

    var data = {
        velx: player.vx,
        vely: player.vy,
        id: player.id
    };
    socket.emit('updateplayer', data);
    
}
function updatepeeps(pips) {
    players=[];
    
    for (let i = 0; i < pips.length; i++) {
        players[i] = new Player(pips[i].x, pips[i].y, pips[i].id, pips[i].nickname);
        players[i].r=pips[i].r;
        players[i].updatepos(pips[i].x, pips[i].y);
        if (player.id == pips[i].id) {
            player.updatepos(pips[i].x, pips[i].y);
            player.r=lerp(parseInt(player.r),pips[i].r,0.8);
            indexofplayer=i;
        }
        //console.log('list players updated' );
        

    }
}
function updateyamies(yam){
    foods=[];
    for(var i=0;i<yam.length;i++)
    {
        foods[i]=new Food(0,yam[i].x,yam[i].y,yam[i].r,yam[i].id);
    }
}


