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
    var timer =0;
    var minX = -49980;
    var maxX = 49980;
    var minY = -49980;
    var maxY = 49980;
    this.preload = function preload(){
      br = loadFont('fonts/br.ttf');
    }
    this.show = function showing(br) {
      if (this.x === null) { this.x = 0; }
      if (this.y === null) { this.y = 0; }
      // body
      fill(this.c1, this.c2, this.c3);
      //ellipse(this.x, this.y, this.r * 2, this.r * 2);
      var middotx = this.x;
      var middoty = this.y;
      beginShape();
      timer += 50;
      for(let i =0; i< TWO_PI;i += PI/40) {
        var ofsetx = map(cos(i),-1,1,0,10);
        var ofsety = map(sin(i),-1,1,0,10);
        var r = map(noise(ofsetx/2  + this.x/this.r ,ofsety/2+ this.y/this.r , timer/this.r),0,1,0,this.r/10 * 2) + this.r;
        if((i <= PI/2 && (i >= 3 * PI / 2) && this.x < minX)) {
          r = map(noise(ofsetx/2  + this.x/this.r ,ofsety/2+ this.y/this.r , timer/this.r),0,1,0,this.r/100 * 2) + this.r;
          console.log("minx");
        }
        if((i >= PI/2 && (i <= 3 * PI / 2) && this.x > maxX)) {
          r = map(noise(ofsetx/2  + this.x/this.r ,ofsety/2+ this.y/this.r , timer/this.r),0,1,0,this.r/100 * 2) + this.r;
          console.log("maxx");
        }
        if((i <= 0 && (i >= PI) && this.y < minY)) {
          r = map(noise(ofsetx/2  + this.x/this.r ,ofsety/2+ this.y/this.r , timer/this.r),0,1,0,this.r/100 * 2) + this.r;
          console.log("miny");
        }
        if((i >= 2*PI && (i <= PI) && this.y > maxY)) {
          r = map(noise(ofsetx/2  + this.x/this.r ,ofsety/2+ this.y/this.r , timer/this.r),0,1,0,this.r/100 * 2) + this.r;
          console.log("maxy");
        }
        var dx = r * cos(i);
        var dy = r * sin(i);
        vertex(middotx + dx, middoty + dy);
      }
      endShape(CLOSE);

      // text

      textFont(br);
      fill(255);
      stroke(8);
      textSize(0.3 * this.r);
      textAlign(CENTER);
      text([parseInt(this.r)], this.x - 2, this.y + [parseInt(this.r)] / 2);
      fill(255,0,0);
      stroke(0);
      strokeWeight(10)
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
