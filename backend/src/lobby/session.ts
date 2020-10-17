var crypto = require("crypto");
const sessions = {};
const lobbies = {};
var counter = 1;

var createLobby = (json) => {
    var id = crypto.createHash("sha256")
    .update(""+counter)
    .digest("base64");
    counter += 1;

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

    return {
        'session_id': id,
        'socket_info': socket,
        'join_code': join_code,
    };
}

var joinLobby = (json) => {
    if(lobbies[json.join_code]) {
        var session_id = lobbies[json.join_code].id;
        var session = sessions[session_id]
        return {
            session_id,
            'socket_info': session.socket
        }
    } else {
        return {'error': 'NO_SESSION_FOUND'}
    }

}
export {createLobby, joinLobby};