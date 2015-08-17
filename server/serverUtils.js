var lobbies = [];

// Example format of a lobby
// lobbies.push({ '0': '', '1': '', '2': '', '3': '', '4': '', numPlayers: 0 }); 

var playerLobbies = {};

var maxLobbySize = 5;

var getNextLobby = function() {
  var lobbyId, position;
  var i = 0;
  while ((lobbyId === undefined) && i<lobbies.length) {
    if (lobbies[i].numPlayers < maxLobbySize) {
      lobbyId = i;
      var j = 0;
      while (position === undefined) {
        if (lobbies[i][j] === '') {
          position = j;
        } else {
          j++;
        }
      }
    } else {
      i++;
    }
  } 
  if (lobbyId === undefined) {
    lobbies[i] = {numPlayers:0};
    for (var x = 0; x<maxLobbySize; x++) {
      lobbies[i][x] = '';
    }
    lobbyId = i;
    position = 0;
  }
  return [lobbyId, position];
};

var addToLobby = function(socketID) {
  var openLobby = getNextLobby();
  var lobbyId = openLobby[0];
  var positionId = openLobby[1];
  lobbies[lobbyId][positionId] = socketID;
  lobbies[lobbyId].numPlayers ++; 
  playerLobbies[socketID] = openLobby;
};

var removeFromLobby = function(socketID) {
  var playerLobby = playerLobbies[socketID];
  lobbies[playerLobby[0]].numPlayers --;
  lobbies[playerLobby[0]][playerLobby[1]] = '';
  delete playerLobbies[socketID];
};

var getLobbyById = function(id) {
  return lobbies[playerLobbies[id][0]];
};

module.exports = {
  addToLobby : addToLobby,
  removeFromLobby : removeFromLobby,
  getLobbyById : getLobbyById
};
