class Chatline {
  constructor(text, playername, playercolor) {
    this.text = text;
    this.playername = playername;
    this.playercolor = playercolor;
    this.textweight = 1;
  }

  show(index, x, y) {
    const txt = [this.playername + ": ", this.text];

      textSize(12)

        fill(this.playercolor)
        text(txt[0], x + 10 , y + 15 * index + 15); 
        fill(255)
        text(txt[1], x + 15 + textWidth(txt[0]), y + 15 * index + 15);
  }
}