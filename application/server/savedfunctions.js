/////////// Sending data to players
// sending data (whole stack)
this.players.forEach(player => {
    const fooddata = [];
    const playersdata = [];
    // Updating the foods
    this.foods.forEach(food => {
      // calculate the distance between this.player and the food
      let dist = calculateDis(
        player.middot.x,
        player.middot.y,
        food.x,
        food.y);
      //check if its viewd by the player, else don't bother 
      let itsok = false;
      if (player.zoom * this.zoomView > dist) {
        itsok = true;
      }

      // push the data
      fooddata.push({
        isitok: itsok,
        id: (itsok) ? food.id : false,
        x: (itsok) ? food.x : false,
        y: (itsok) ? food.y : false,
        r: (itsok) ? food.r : false,
        type: (itsok) ? food.type : false,
      });

    });
    // updating the players
    this.players.forEach(player2 => {
      // calculate the distance between this.player and the other player
      let dist = calculateDis(
        player.middot.x,
        player.middot.y,
        player2.middot.x,
        player2.middot.y);

      //check if its viewd by the player, else don't bother 
      let itsok = false;
      if (player.zoom * this.zoomView > dist) {
        itsok = true;
      }

      // push the data
      playersdata.push({
        isitok: itsok,
        id: player2.id,
        x: (itsok) ? player2.x : false,
        y: (itsok) ? player2.y : false,
        r: player2.r,
        blobs: (itsok) ? player2.blobs : false,
        c: (itsok) ? player2.c : false,
        nickname: player2.nickname,
      });
    });
    // sending the data that colected above to the specific player that needs it
    // sending data about the food
    io.to(player.id).emit('updateyamies', fooddata);
    // sending data about the other players (within his range of view)
    io.to(player.id).emit('updatepipis', playersdata);
});