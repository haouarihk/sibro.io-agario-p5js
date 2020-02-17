/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Food {
  constructor(type, x, y, r, id) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;
    this.r = r;
    this.show = function showing() {
      // if (type === 0) {
      fill(0, 255, 0);
      ellipse(this.x, this.y, this.r, this.r);
      // }
    };
  }
}
