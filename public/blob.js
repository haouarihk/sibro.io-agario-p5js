function Blob() {
    this.show = function (x, y, r) {
        //showing
        //fill(0, 0, 0);
        //ellipse(x-9, y-1, r * 2, r * 2);
        fill(50, 200, 0);
        ellipse(x, y, r * 2, r * 2);
        
        fill(255);
        textSize(0.3*r);
        textAlign(CENTER);
        text([parseInt(r)], x-2, y+[parseInt(r)]/2);
    }
}
