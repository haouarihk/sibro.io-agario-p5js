class Room{
    constructor(){
        var room = this;
        room.players = [];
        room.update = function (){
            console.log(room.players.length);
        }
    }
    
}
let room = new Room();
setInterval(room.update, 200);