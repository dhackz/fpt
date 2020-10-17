var crypto = require("crypto");
const lobbies = {};
var counter = 1;
var createLobby = (json) => {

    var id = crypto.createHash("sha256")
    .update(""+counter)
    .digest("base64");
    
    var socket = 'socket:of:doom';

    lobbies[id] = {
        "game" : json.game,
        "socket" : socket
    }
    console.log(lobbies);
    return {
        'session_id': id,
        'socket_info': socket,
    };
}
export default createLobby;