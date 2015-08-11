var playerInformation= {};

var startingLocation = {x: 0,
                        y: 0};

var getPlayers = function(socketID) {
  return playerInformation;
};

var getStartLoc = function() {
  return startingLocation;
};

var newPlayer = function(socketID) {
  playerInformation[socketID] = {
    velocityX: 0,
    velocityY: 0,
    positionX: startingLocation.x,
    positionY: startingLocation.y,
    dashingBool: false
  };
};

var updatePlayer = function(socketID, data) {
  playerInformation[socketID].positionX = data.PX;
  playerInformation[socketID].positionY = data.PY;
  playerInformation[socketID].velocityX = data.VX;
  playerInformation[socketID].velocityY = data.VY;
  playerInformation[socketID].dashingBool = data.dashBool;
};

var dcPlayer = function(socketID) {
  delete playerInformation[socketID];
};

module.exports = {
  newPlayer: newPlayer,
  updatePlayer: updatePlayer,
  dcPlayer: dcPlayer,
  getPlayers: getPlayers,
  getStartLoc: getStartLoc
};