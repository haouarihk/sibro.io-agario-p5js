function Food(type,x,y,r,id){
    this.id=id;
    this.x=x;
    this.y=y;
    this.type=type;
    this.r=r;
    this.show=function(){
        //fill(0, 0, 0);
        //ellipse(this.x-4,this.y-1,this.r,this.r);
        fill(0,255,0);
        ellipse(this.x,this.y,this.r,this.r);
    }
}