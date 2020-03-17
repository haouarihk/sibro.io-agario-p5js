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
        this.touchedWithMouse = false;
        this.filler = 50;
    }
    show(index) {
        let y = index * this.w / 4 + this.y - 24;
        this.touchedWithMouse = mouseHovingOverBox(this.x + this.w * 2, y + 20, this.w * 2, this.h / 2);
        fill(this.filler);
        rect(this.x, y, this.w * 2, this.h / 2);
        fill(255);
        textAlign(LEFT);
        textSize(this.size);
        text(this.text, this.x + 10, y + 16);
    }

}