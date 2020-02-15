
function Player( id, nickname) {
    this.blobs = [];
    this.pos = createVector(0, 0);
    this.nickname = nickname;
    this.id = id;

    this.setrad = function (r) {
        this.r = r;

    }

    this.update = function () {
        //calculating mouse possition

        var vel = createVector(mouseX, mouseY);
        vel.sub(width / 2, height / 2);
        vel.setMag(3);
        this.vx = vel.x;
        this.vy = vel.y;
        //adding vel-
        this.pos.add(vel);
    }
    this.updatetext = function () {
        socket.on('someonechangedhisname', someonechangedhisname);
        fill(120);
        textAlign(CENTER);
        textSize(16);
        text(this.nickname, this.pos.x, this.pos.y, this.r);
    }
    this.updatepos = function (newx, newy) {
        this.pos.x = newx;
        this.pos.y = newy;
    }
    this.show = function () {
        for (var i = 0; i < this.blobs.length; i++) {
            this.blobs[i].show();
        }
        //fill(255);
        //textSize(0.3 * this.r);
       // textAlign(CENTER);
       // text(this.nickname, x - 2, y);
    }
    this.constrain = function () {
        //stop it from going outside of the world
        this.pos.x = constrain(this.pos.x, -5000, 5000);
        this.pos.y = constrain(this.pos.y, -5000, 5000);

    }

}
