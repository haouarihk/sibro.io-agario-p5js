/* eslint-disable linebreak-style */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Chatbox {
  constructor(x, y, chatlist) {
    this.chatlist = chatlist;
    this.x = x;
    this.y = y;
    this.count = 9;
  }

  show() {
    fill(40);
    rect(this.x, this.y, 400, 190);
    let counter = 0;
    this.chatlist.forEach((chatline, index) => {
      if (counter === this.count) {
        // show chatline
        chatline.show(index, this.x, this.y);
        // slice the previewse one
        this.chatlist.splice(0, 1);
        // lower the counter for more to come
        counter -= 1;
      } else {
        
        // show the chatline
        chatline.show(index, this.x, this.y);
        // continue
        counter += 1;
      }
    });
    // if he is in game
    if (connected) {
      // show text input feild
      inputfeild.show();
      inputfeild.position(this.x, this.y + 150);
      inputfeild.size(400);
    } else {
      // hide text input feild
      inputfeild.hide();
      inputfeild.value('');
    }
  };
  setChat(chat) {
    this.chatlist = chat;
  }

}
class Listing {
  constructor(x, y, players) {
    this.players = players;
    this.x = x;
    this.y = y;
    this.count = 10;
  }
  show() {
    fill(50);
    rect(this.x, this.y, 200, 240);
    let counter = 0;
    this.players.forEach((player, i) => {
      if (counter !== 10) {
        fill(255);
        textAlign(LEFT);
        textSize(20);
        text(`${i + 1})${player.nickname}`, this.x + 5, this.y + i * 20 + 5, 20, 20);
        counter += 1;
      }
    });
  };

}
class Menu {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.textfeild = createInput();
  }
  show() {
    fill(100);
    rect(this.x, this.y - 100, 500 + this.x / 2, 500 + this.y / 2);
    this.textfeild.position((6 * this.x) / 4, this.y);
    this.textfeild.size(200, 30);
  };
  hide() {
    this.textfeild.size(0, 0);
  };

}