/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Listing {
  constructor(x, y, players) {
    this.players = players;
    this.x = x;
    this.y = y;
    this.count = 10;
    this.show = function showtext() {
      let counter = 0;
      for (let i = 0; i < players.length; i += 1) {
        if (counter !== 10) {
          fill(255);
          textAlign(LEFT);
          textSize(20);
          text(`${i + 1})${this.players[i].nickname}`, this.x + 5, this.y + i * 20 + 5, 20, 20);
          counter += 1;
        }
      }
    };
  }
}
