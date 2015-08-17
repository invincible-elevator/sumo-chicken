var lobbies = []; 

var playerLobbies = {}; // to improve lookup when finding lobby that a player is in

var maxLobbySize = 6;

/* Helper function: gets the next lobby with an empty space 
 * returns a tuple of lobbyID and position in the lobby
 */
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
  if (lobbyId === undefined) { // if all lobbies are full, creates new lobby object
    // Example format of a lobby
    // lobbies.push({ '0': '', '1': '', '2': '', '3': '', '4': '', numPlayers: 0 }); 
    lobbies[i] = {numPlayers:0};
    for (var x = 0; x<maxLobbySize; x++) {
      lobbies[i][x] = '';
    }
    lobbyId = i;
    position = 0;
  }
  return [lobbyId, position];
};

// Given a new socketID, inserts the new player into a lobby
var addToLobby = function(socketID) {
  var openLobby = getNextLobby();
  var lobbyId = openLobby[0];
  var positionId = openLobby[1];
  lobbies[lobbyId][positionId] = socketID;
  lobbies[lobbyId].numPlayers ++; 
  playerLobbies[socketID] = openLobby;
};

// Given a socketID from a disconnected player, removes the player from a lobby
var removeFromLobby = function(socketID) {
  var playerLobby = playerLobbies[socketID];
  lobbies[playerLobby[0]].numPlayers --;
  lobbies[playerLobby[0]][playerLobby[1]] = '';
  delete playerLobbies[socketID];
};

// Gets a player's lobby information given a player's socketID
var getLobbyById = function(id) {
  return lobbies[playerLobbies[id][0]];
};

module.exports = {
  addToLobby : addToLobby,
  removeFromLobby : removeFromLobby,
  getLobbyById : getLobbyById
};
