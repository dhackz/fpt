var crypto = require("crypto");
const sessions = {};
const lobbies = {};
var counter = 1;

var createLobby = (json) => {
    var id = crypto.createHash("sha256")
                   .update(""+counter)
                   .digest("base64");
    var join_code = id.replace("/", "")
                      .replace("=", "")
                      .replace("+", "")
                      .substring(0,4);
                      
    var socket = 'socket:of:doom';

    sessions[id] = {
        "game" : json.game,
        "socket" : socket
    }
    lobbies[join_code] = {
        "id" : id,
    }
    counter += 1;

    return {
        'session_id': id,
        'socket_info': socket,
        'join_code': join_code,
    };
}
export default createLobby;