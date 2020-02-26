class Chatline {
  constructor(text, playername, playercolor) {
    this.text = text;
    this.playername = playername;
    this.playercolor = playercolor;
    this.textweight = 1;
  }
  show(index, x, y) {
    const txt = [this.playername + ": ", this.text];
      textSize(12) // text size
        fill(this.playercolor) // fill player color
        text(txt[0], x + 10 , y + 15 * index + 15); // player name
        fill(255) // color of the text
        text(txt[1], x + 15 + textWidth(txt[0]), y + 15 * index + 15); // the text
  }
}