/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable radix */
/* eslint-disable no-undef */
class Blob {
  constructor(x, y, r) {
    this.r = r;
    this.x = x;
    this.y = y;
    this.vel = createVector(1, 1);
    this.show = function showing() {
      // showing
      // fill(0, 0, 0);
      // ellipse(x-9, y-1, r * 2, r * 2);
      fill(50, 200, 0);
      ellipse(this.x, this.y, this.r * 2, this.r * 2);
      fill(255);
      textSize(0.3 * this.r);
      textAlign(CENTER);
      text([parseInt(this.r)], this.x - 2, this.y + [parseInt(this.r)] / 2);
    };
    this.update = function updating() {
      // calculating mouse possition
      const vel = createVector(mouseX, mouseY);
      vel.sub(width / 2, height / 2);
      vel.setMag(3);
      this.vx = vel.x;
      this.vy = vel.y;
      // adding vel-
      this.vel.add(vel);
    };
  }
}
