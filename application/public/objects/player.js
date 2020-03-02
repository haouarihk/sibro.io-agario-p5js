/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class Player {
  constructor(id, nickname) {
    this.middot = createVector(0, 0);
    this.nickname = nickname;
    this.id = id;
    this.isitshown = false;
    this.blobs = [];
    this.r =0;
    this.lvl = 0;
  }
  // show blobs
  show(br) {
    if (this.isitshown) {
      this.blobs.forEach(blob => {
        blob.show(br);
      });
    }
  };
}