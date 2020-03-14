/* eslint-disable linebreak-style */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */


let colorshown = [];
let showPlayerPicker = false;
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
    rect(this.x, this.y + 10, 300, powerups.length * 50 + 55);
    latency++;

    for (let i = 0; i < powerups.length; i += 1) {
      if (timestospeedup <= 0 && i === 2) {
        console.log(timestospeedup)
      } else {
        timestospeedup--;
        if (player.lvl < powerupscost[i]) {
          filter = 50;
        } else {
          filter = 0;
        }
        if (keyIsPressed && key == buttons[i]) {
          if (latency > 5) {
            latency = 0;
            if (filter !== 50) {
              fill(40 + 200);
              socket.emit("buyItem", i);
            } else {
              fill(200, 10, 10);
            }
          }

        }
        if (contains(this.x, this.y + i * 55 + 50, 250, mouseX, mouseY, 20)) {
          if (mouseIsPressed) {
            if (latency > 5) {
              latency = 0;
              if (filter !== 50) {
                colorshown[0] = 240
                colorshown[1] = 240
                colorshown[2] = 240
                socket.emit("buyItem", i);
              } else {
                colorshown[0] = 200
                colorshown[1] = 10
                colorshown[2] = 10
              }
            }
          } else {
            colorshown[0] = 90
            colorshown[1] = 90
            colorshown[2] = 90
          }

        } else {
          fill(40 - filter);
        }
        fill(colorshown[0], colorshown[1], colorshown[2])
        rect(this.x, this.y + i * 55 + 50, 300, 50);
        fill(colorshown[0] + 50, colorshown[1] + 50, colorshown[2] + 50)
        rect(this.x, this.y + i * 55 + 50, 50, 50);
        fill(255 - filter)
        text(buttons[i], this.x + 20, this.y + i * 55 + 80)
        fill(255 - filter)
        textSize(16)
        text(powerups[i], this.x + 70, this.y + i * 55 + 80)
        text(powerupscost[i], this.x + 250, this.y + i * 55 + 80)
        colorshown[0] = 0
        colorshown[1] = 0
        colorshown[2] = 0
      }
      fill(255)
      text("Buy Powers :", this.x + 55, this.y + 35)
      fill(255)
      text("Diamond :", this.x, this.y - 50)
      fill(255, 0, 255)
      text(0, this.x + 80, this.y - 50)

      fill(255)
      text("Coins :", this.x, this.y - 20)
      fill(255, 255, 0)
      text(this.playerlvl, this.x + 60, this.y - 20)

    }
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
class playersPicker {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = w / 2;
    this.playerslist = [];
    this.list = [];
    this.biglist = [];
  }
  show() {
    if (showPlayerPicker) {
      fill(0);
      rect(this.x, this.y, this.w * 2, this.playerslist.length * this.h * 0.5);
      fill(255);
      this.list.forEach((playerline, i) => {
        playerline.show(i + 1);
      });
    }
  }
  update(key) {
    this.list = [];
    showPlayerPicker = true;
    let ef = inputfeild.value().split(" ");
    let realvalueofinputfield = ef[0]

    if (realvalueofinputfield !== "" && ef[1]) {
      this.playerslist = searchwithnickname(ef[1], this.biglist);
      this.playerslist.forEach(playerline => {
        let nline = new Pickerline(this.x, this.y, this.biglist[getIndexById(playerline, this.biglist)].nickname);
        nline.id = playerline;
        nline.w = this.w;
        nline.h = this.h;
        nline.x = this.x;
        nline.y = this.y;
        this.list.push(nline);
      });
      //here the third command with else if then this else
    } else {
      this.playerslist = searchwithnickname(ef[0], commands);
      this.playerslist.forEach(playerline => {
        let nline = new Pickerline(this.x, this.y, commands[getIndexById(playerline, commands)].nickname);
        nline.id = playerline;
        nline.w = this.w;
        nline.h = this.h;
        nline.x = this.x;
        nline.y = this.y;
        this.list.push(nline);
      });
    }
    
  }
  changelocation(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
  changewidth(newW) {
    this.w = newW;
  }
}
const commands = [{nickname:"/m",id:"0"},{nickname:"/k",id:"1"},{nickname:"/g",id:"2"}]