/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
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
    this.addr = 0;
    this.middot = createVector(1, 1);
    this.vel = createVector(1, 1);
    this.timer = 0;
  }
  show(br) {
    this.r = lerp(this.r, this.addr, 0.00002)
    if (this.x === null) {
      this.x = 0;
    } // if somehow x
    if (this.y === null) {
      this.y = 0;
    } // or y = null it will equal 0
    //// body
    // fill blob with his color
    fill(0, 0, 0);
    stroke(255);
    // get it pos
    var posx = this.x;
    var posy = this.y;
    // using 2d noise to create that bloby feels
    beginShape(); // built in p5.js function 
    this.timer += 50;
    for (let i = 0; i < TWO_PI; i += PI / 40) {
      var ofsetx = map(cos(i), -1, 1, 0, 222);
      var ofsety = map(sin(i), -1, 1, 0, 222);
      var r = map(noise(ofsetx / 2 + this.x / this.r, ofsety / 2 + this.y / this.r, this.timer / this.r), 0, 1, 0, this.r / 10 * 0.7) + this.r;
      var dx = r * cos(i);
      var dy = r * sin(i);
      vertex(posx + dx, posy + dy);
    }
    endShape(CLOSE); // ends of beginShape();
    fill(this.c1, this.c2, this.c3);
    ellipse(this.x, this.y, this.r * 2)
    stroke(0)
    fill(this.c1 + 20, this.c2 + 20, this.c3 + 20);
    ellipse(this.x, this.y, this.r - (this.r / 20))
    //// text
    textFont(br); // use font br on the files
    fill(255); // fill with white
    stroke(8); // coloring the stroke
    textSize(0.3 * this.r); // the size of the text
    textAlign(LEFT); // the alignment
    // showing the weight text of the blob
    text([parseInt(this.r)], this.x + this.r + 150, this.y + 3 * parseInt(this.r) / 4);
    fill(255); // fill color
    stroke(20);
    strokeWeight(10);
    textSize(0.3 * this.r);
    textAlign(LEFT);
    // show the nickname of the blob/player
    line(this.x + (this.r), this.y, this.x + (this.r), this.y - (2 * this.r ));
    text(this.nickname, this.x + this.r + 150, this.y - (this.r / 2));

    this.x += this.vx;
    this.y += this.vy;

  };
  setrad(add) {
    this.addr = add;
  }
  setvel(vel) {
    this.vx += vel.x;
    this.vy += vel.y;
  }
}