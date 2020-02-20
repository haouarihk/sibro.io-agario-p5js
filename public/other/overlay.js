/* eslint-disable linebreak-style */
/* eslint-disable max-classes-per-file */
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
      for (let i = players.length - 1; i >= 0; i -= 1) {
        if (counter !== 10) {
          fill(255);
          textAlign(LEFT);
          textSize(20);
          text(`${i + 1})_${this.players[i].nickname}`, this.x + 5, this.y + i * 20 + 5, 20, 20);
          counter += 1;
        }
      }
    };
  }
}
class Menu {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.show = function show() {
      fill(5);
      rect(this.x, this.y - 100, 500 + this.x / 2, 500 + this.y / 2);
      input = createInput();
      input.position(200, 200);
      input.size(200, 20);
    };
  }
}
