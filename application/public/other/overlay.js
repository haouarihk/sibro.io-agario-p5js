/* eslint-disable linebreak-style */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function toggleOverlay(a) {
  const overlay = document.getElementById('overlay');
  const specialBox = document.getElementById('specialBox');
  overlay.style.opacity = 0.8;
  if (a) {
    overlay.style.display = 'none';
    specialBox.style.display = 'none';
  } else {
    overlay.style.display = 'block';
    specialBox.style.display = 'block';
  }
}

class Listing {
  constructor(x, y, players) {
    this.players = players;
    this.x = x;
    this.y = y;
    this.count = 10;
    this.show = function showtext() {
      fill(50);
      rect((6 * width) / 7, height / 20, 200, 400);
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
    this.textfeild = createInput();
    this.show = function show() {
      fill(100);
      rect(this.x, this.y - 100, 500 + this.x / 2, 500 + this.y / 2);
      this.textfeild.position((6 * this.x) / 4, this.y);
      this.textfeild.size(200, 30);
    };
    this.hide = function hide() {
      this.textfeild.size(0, 0);
    };
  }
}
