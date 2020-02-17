/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Player {
  constructor(id, nickname) {
    this.pos = createVector(0, 0);
    this.middot = createVector(0, 0);
    this.nickname = nickname;
    this.id = id;
    this.blobs = [];
    this.setrad = function setrad(r) {
      this.r = r;
    };
    this.update = function updating() {
      for (let i = 0; i < this.blobs.length; i += 1) {
        this.blobs[i].update();
        this.blobs[i].middot = this.middot;
      }
    };
    this.updatetext = function updatingtext() {
      socket.on('someonechangedhisname', someonechangedhisname);
      fill(120);
      textAlign(CENTER);
      textSize(16);
      text(this.nickname, this.pos.x, this.pos.y, this.r);
    };
    this.updatepos = function updatingpossition(newx, newy) {
      this.pos.x = newx;
      this.pos.y = newy;
    };
    this.show = function showing() {
      for (let i = 0; i < this.blobs.length; i += 1) {
        this.blobs[i].show();
      }
    };
    this.constrain = function constrainer() {
      // stop it from going outside of the world
      this.pos.x = constrain(this.pos.x, -10000, 10000);
      this.pos.y = constrain(this.pos.y, -10000, 10000);
    };
  }
}
