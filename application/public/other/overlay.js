/* eslint-disable linebreak-style */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */



let latency = 0
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
      fill(0, 0, 0, 0)
      if (typedodo !== 0) {
        rect(this.x + 10, this.y + 150, 380, 16);
      }
      inputfeild.position(this.x + 10, this.y + 150);
      inputfeild.size(380);
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
class Leveltab {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.count = 9;
    this.playerlvl = 0;
  }

  show() {
    let filter = 0;
 
    fill(70);
    rect(this.x, this.y + 10, 200, 200);
    latency ++;

    for (let i = 0; i < powerups.length; i += 1) {
      if (player.lvl < powerupscost[i]) {
        filter = 50;
      } else{
        filter = 0;
      }
      console.log(latency)
      if(keyIsPressed && key == buttons[i]){
        if(latency > 5){
          latency = 0;
        if (filter !== 50) {
          fill(40 + 200);
          socket.emit("buyItem", i);
        } else {
          fill(200,10,10);
        }
      }

      }
      if (contains(this.x, this.y + i * 55 + 50, 200, mouseX, mouseY, 20)) {
        if (mouseIsPressed) {
          if(this.latency>1){
            
          }else{
          if (filter !== 50) {
            fill(40 + 200);
            socket.emit("buyItem", i);
          } else {
            fill(200,10,10);
          }
        }
        } else {
          fill(40 + 50);
        }
      
      } else {
        fill(40 - filter);
      }
      rect(this.x, this.y + i * 55 + 50, 200, 50);
      fill(255 - filter)
      text(powerups[i], this.x, this.y + i * 55 + 70)
      text(powerupscost[i], this.x + 140, this.y + i * 55 + 70)

    }

    fill(255)
    text("Coins " + this.playerlvl, this.x, this.y)

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
        text(((i + 1 < 10) ? (i + 1 + " ") : (i + 1 + "")) + ") " + player.nickname, this.x + 5, this.y + i * 20 + 30);
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