/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Player {
  constructor(id, nickname) {
    this.middot = createVector(0, 0);
    this.nickname = nickname;
    this.id = id;
    this.isitshown = false;
    this.blobs = [];
  }

  update() {
    if (this.isitshown) {
      this.blobs.forEach(blob => {
        blob.update();
        blob.middot = this.middot;
      });
    }
  };
  show(br) {
    if (this.isitshown) {
      this.blobs.forEach(blob => {
        blob.show(br);
      });
    }
  };
  updatetext() {
    socket.on('someonechangedhisname', someonechangedhisname);
    fill(120);
    textAlign(CENTER);
    textSize(16);
    text(this.nickname, this.pos.x, this.pos.y, this.r);
  };
  updatepos(newx, newy) {
    this.pos.x = newx;
    this.pos.y = newy;
  };
  setrad(r) {
    this.r = r;
  };
}