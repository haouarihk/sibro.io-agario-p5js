class Chatline{
    constructor(text,playername,playercolor) {
        this.text = text;
        this.playername = playername;
        this.playercolor = playercolor;
    }
    show(index , x , y){
        const txt = [this.playername+": ", this.text];
        
        txt.forEach((word, i) => {
            textSize(12)
            if(i === 0) {
            fill(this.playercolor)
              text(word,x +10+ (i) * textWidth(txt[i]), y + 15 + index * 12*1.9,  0);
            } else {
            fill(255)
              text(word,x+15+ (i) * textWidth(txt[i-1]), y +15 +index * textHeight(word) *12 * 1.9, 0);
            }
              
          })
    }
}
function textHeight(text){
 let count = text.length;
 let lines = count / 49;

 return parseInt(lines) + 1;
}