class Pickerline {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.h = 0;
        this.w = 0;
        this.size = 16;
        //this.color = (0, 2, 2);
        this.text = text;
        this.id = '';
        this.selected = false;
    }
    show(index) {
        let y = index*this.w/4 + this.y-24;
        if(this.selected){
        fill(150)
        } else{
        fill(50)
        }
        rect(this.x, y,this.w*2,this.h/2);
        fill(255);
        textAlign(LEFT);
        textSize(this.size);
        text(this.text,this.x+10,y+16);
    }

}