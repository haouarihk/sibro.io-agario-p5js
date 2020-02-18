/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable no-undef */
class Blob {
  constructor(nickname, x, y, r, c) {
    this.nickname = nickname;
    this.r = r;
    this.x = x;
    this.y = y;
    this.c1 = c[0];
    this.c2 = c[1];
    this.c3 = c[2];
    this.vx = 0;
    this.vy = 0;
    this.setcolor = function setcolor(c1, c2, c3) {
      this.c1 = c1;
      this.c2 = c2;
      this.c3 = c3;
    };
    this.middot = createVector(1, 1);
    this.vel = createVector(1, 1);
    this.setrad = function setrad(r2) {
      this.r = r2;
    };
    this.show = function showing() {
      if (this.x === null) { this.x = 0; }
      if (this.y === null) { this.y = 0; }
      // body
      fill(this.c1, this.c2, this.c3);
      ellipse(this.x, this.y, this.r * 2, this.r * 2);

      // text
      fill(255);
      textSize(0.3 * this.r);
      textAlign(CENTER);
      text([parseInt(this.r)], this.x - 2, this.y + [parseInt(this.r)] / 2);
      fill(255);
      textSize(0.3 * this.r);
      textAlign(CENTER);
      text(this.nickname, this.x - 2, this.y);
    };
    this.update = function updating() {
      // calculating mouse possition
      const vel = createVector(mouseX, mouseY);
      vel.sub((width / 2) - this.middot.x, (height / 2) - this.middot.y);
      vel.setMag(3);
      this.vx = vel.x;
      this.vy = vel.y;
    };
  }
}
