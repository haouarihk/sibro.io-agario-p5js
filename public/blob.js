function Blob(x,y,r) {
    this.r=r;
    this.x=x;
    this.y=y;
    this.show = function () {
        //showing
        //fill(0, 0, 0);
        //ellipse(x-9, y-1, r * 2, r * 2);
        fill(50, 200, 0);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
        
        fill(255);
        textSize(0.3*this.r);
        textAlign(CENTER);
        text([parseInt(this.r)], this.x-2, this.y+[parseInt(this.r)]/2);
    }
    
}
