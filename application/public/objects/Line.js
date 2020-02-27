class Line{
    constructor(x,y,x2,y2,l){
        this.l = l;
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
    }
    show(){
        strokeWeight(100)
        fill(255)
        stroke(255)
        line(this.x,this.y,this.x2,this.y2)
    }
}