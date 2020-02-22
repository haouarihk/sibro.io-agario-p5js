/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Food {
  constructor(type, x, y, r, id) {
    this.id = id;
    this.x = x;
    this.y = y;
    // type 0 is the normal type
    // type 1 is the eat to split type usually bigger than the avrege size
    this.type = type;
    this.r = r;
    this.show = function showing() {
      switch (1) {
        case 1:
          fill(0, 250, 0);
          ellipse(this.x, this.y, this.r, this.r);
          break;
        case 2:
          fill(0, 255, 0);
          ellipse(this.x, this.y, this.r * 2, this.r * 2);
          break;
        }
      };
    }
  }
